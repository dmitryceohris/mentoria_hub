import { createClient } from "npm:@supabase/supabase-js@2";

type TelegramPayloadType = "deadline" | "opportunity" | "course";

type TelegramIngestPayload = {
  sourceId?: unknown;
  type?: unknown;
  title?: unknown;
  description?: unknown;
  deadline?: unknown;
  courseTitle?: unknown;
  applyUrl?: unknown;
  tags?: unknown;
};

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-mentoria-telegram-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*"
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return Response.json(body, {
    status,
    headers: corsHeaders
  });
}

function readRequiredEnv(name: string) {
  const value = Deno.env.get(name)?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function readSupabaseSecretKey() {
  const secretKeysJson = Deno.env.get("SUPABASE_SECRET_KEYS");

  if (secretKeysJson) {
    const parsed = JSON.parse(secretKeysJson) as Record<string, string | undefined>;
    const key = parsed.default ?? Object.values(parsed).find(Boolean);

    if (key) {
      return key;
    }
  }

  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY") ?? "";
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArrayValue(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(stringValue).filter(Boolean);
}

function safeId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "telegram-item";
}

function isPayloadType(value: unknown): value is TelegramPayloadType {
  return value === "deadline" || value === "opportunity" || value === "course";
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function validatePayload(payload: TelegramIngestPayload) {
  const sourceId = stringValue(payload.sourceId);
  const title = stringValue(payload.title);
  const type = payload.type;
  const deadline = stringValue(payload.deadline);

  if (!sourceId) {
    return "sourceId is required.";
  }

  if (!isPayloadType(type)) {
    return "type must be deadline, opportunity, or course.";
  }

  if (!title) {
    return "title is required.";
  }

  if ((type === "deadline" || type === "opportunity") && deadline && !isIsoDate(deadline)) {
    return "deadline must use YYYY-MM-DD.";
  }

  return "";
}

function buildOpportunityRow(payload: TelegramIngestPayload) {
  const sourceId = stringValue(payload.sourceId);
  const title = stringValue(payload.title);
  const description = stringValue(payload.description) || "Details are available in the Telegram announcement.";
  const deadline = stringValue(payload.deadline);
  const applyUrl = stringValue(payload.applyUrl);
  const courseTitle = stringValue(payload.courseTitle);
  const tags = stringArrayValue(payload.tags);
  const id = `telegram-${safeId(sourceId)}`;

  return {
    id,
    title,
    category: payload.type === "deadline" ? "Deadline" : "Opportunity",
    direction: courseTitle || "Opportunity",
    format: "Online",
    deadline,
    grades: ["8", "9", "10", "11"],
    location: "Online",
    description,
    requirements: "Review the source announcement for participation details.",
    tags,
    apply_url: applyUrl,
    event_date: null,
    is_recurring: false,
    posted_at: new Date().toISOString(),
    source_language: "en",
    source_title: title,
    source_description: description,
    source_requirements: "",
    translations: {
      en: {
        title,
        description,
        requirements: "Review the source announcement for participation details.",
        summary: description
      }
    },
    status: "published",
    sort_order: 0
  };
}

function buildCourseAnnouncementRow(payload: TelegramIngestPayload) {
  const sourceId = stringValue(payload.sourceId);
  const title = stringValue(payload.title);

  return {
    id: `telegram-course-${safeId(sourceId)}`,
    source_id: sourceId,
    title,
    description: stringValue(payload.description),
    course_title: stringValue(payload.courseTitle) || title,
    deadline: stringValue(payload.deadline) || null,
    starts_at: null,
    apply_url: stringValue(payload.applyUrl),
    tags: stringArrayValue(payload.tags),
    payload,
    status: "draft"
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const configuredSecret = Deno.env.get("TELEGRAM_INGEST_SECRET")?.trim();

  if (!configuredSecret) {
    return jsonResponse(500, { error: "TELEGRAM_INGEST_SECRET is not configured." });
  }

  if (request.headers.get("x-mentoria-telegram-secret") !== configuredSecret) {
    return jsonResponse(401, { error: "Invalid Telegram ingest secret." });
  }

  let payload: TelegramIngestPayload;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { error: "Request body must be valid JSON." });
  }

  const validationError = validatePayload(payload);

  if (validationError) {
    return jsonResponse(400, { error: validationError });
  }

  let supabaseUrl = "";
  let supabaseKey = "";

  try {
    supabaseUrl = readRequiredEnv("SUPABASE_URL");
    supabaseKey = readSupabaseSecretKey();
  } catch (error) {
    return jsonResponse(500, { error: error instanceof Error ? error.message : "Supabase env could not be read." });
  }

  if (!supabaseKey) {
    return jsonResponse(500, { error: "Supabase secret key is not configured for the Edge Function." });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const sourceId = stringValue(payload.sourceId);
  const payloadType = payload.type as TelegramPayloadType;
  const receivedAt = new Date().toISOString();
  const eventResult = await supabase
    .from("telegram_ingest_events")
    .upsert(
      {
        source_id: sourceId,
        payload_type: payloadType,
        payload,
        status: "received",
        target_table: null,
        target_id: null,
        error_message: null,
        received_at: receivedAt,
        processed_at: null
      },
      { onConflict: "source_id" }
    )
    .select("id")
    .single();

  if (eventResult.error) {
    return jsonResponse(500, { error: eventResult.error.message });
  }

  try {
    const target =
      payloadType === "course"
        ? {
            table: "telegram_course_announcements",
            row: buildCourseAnnouncementRow(payload),
            onConflict: "source_id"
          }
        : {
            table: "catalog_opportunities",
            row: buildOpportunityRow(payload),
            onConflict: "id"
          };

    const targetResult = await supabase
      .from(target.table)
      .upsert(target.row, { onConflict: target.onConflict })
      .select("id")
      .single();

    if (targetResult.error) {
      throw targetResult.error;
    }

    const targetId = String(targetResult.data.id);
    await supabase
      .from("telegram_ingest_events")
      .update({
        status: "processed",
        target_table: target.table,
        target_id: targetId,
        processed_at: new Date().toISOString()
      })
      .eq("source_id", sourceId);

    return jsonResponse(200, {
      ok: true,
      sourceId,
      type: payloadType,
      targetTable: target.table,
      targetId
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Telegram payload could not be processed.";
    await supabase
      .from("telegram_ingest_events")
      .update({
        status: "failed",
        error_message: message,
        processed_at: new Date().toISOString()
      })
      .eq("source_id", sourceId);

    return jsonResponse(500, { error: message });
  }
});
