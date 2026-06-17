import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

type SupabaseConfig = {
  key: string;
  keySource: "VITE_SUPABASE_PUBLISHABLE_KEY" | "VITE_SUPABASE_ANON_KEY";
  url: string;
};

type SupabaseConfigResult =
  | {
      config: SupabaseConfig;
      error: "";
    }
  | {
      config: null;
      error: string;
    };

const supabaseUrl = readEnvValue(import.meta.env.VITE_SUPABASE_URL);
const supabasePublishableKey = readEnvValue(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
const supabaseAnonKey = readEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY);

function readEnvValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlaceholder(value: string) {
  const normalizedValue = value.toLowerCase();

  return (
    normalizedValue.length === 0 ||
    normalizedValue.includes("your-project") ||
    normalizedValue.includes("your_key") ||
    normalizedValue.includes("<project-ref>") ||
    normalizedValue.includes("<substitute")
  );
}

function decodeJwtPayload(key: string) {
  const [, payload] = key.split(".");

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );
    return JSON.parse(window.atob(paddedPayload)) as { role?: unknown };
  } catch {
    return null;
  }
}

function getKeyValidationError(key: string, keySource: SupabaseConfig["keySource"]) {
  if (isPlaceholder(key)) {
    return `${keySource} is missing or still uses the example value.`;
  }

  if (key.startsWith("sb_secret_")) {
    return `${keySource} is a secret key. Use a publishable key in this browser app.`;
  }

  if (key.includes("service_role")) {
    return `${keySource} appears to be a service role key. Use a publishable key in this browser app.`;
  }

  const jwtPayload = decodeJwtPayload(key);

  if (jwtPayload?.role === "service_role") {
    return `${keySource} is a service role JWT. Use a publishable key in this browser app.`;
  }

  if (!key.startsWith("sb_publishable_") && !jwtPayload) {
    return `${keySource} is not a valid Supabase publishable or legacy anon key.`;
  }

  return "";
}

function getValidatedSupabaseConfig(): SupabaseConfigResult {
  if (isPlaceholder(supabaseUrl)) {
    return {
      config: null,
      error: "VITE_SUPABASE_URL is missing or still uses the example value."
    };
  }

  if (!supabaseUrl.startsWith("https://") || !supabaseUrl.endsWith(".supabase.co")) {
    return {
      config: null,
      error: "VITE_SUPABASE_URL must look like https://<project-ref>.supabase.co."
    };
  }

  const keySource = supabasePublishableKey ? "VITE_SUPABASE_PUBLISHABLE_KEY" : "VITE_SUPABASE_ANON_KEY";
  const key = supabasePublishableKey || supabaseAnonKey;

  if (!key) {
    return {
      config: null,
      error: "Set VITE_SUPABASE_PUBLISHABLE_KEY in Vercel. VITE_SUPABASE_ANON_KEY is supported only as a legacy fallback."
    };
  }

  const keyError = getKeyValidationError(key, keySource);

  if (keyError) {
    return {
      config: null,
      error: keyError
    };
  }

  return {
    config: {
      key,
      keySource,
      url: supabaseUrl
    },
    error: ""
  };
}

const supabaseConfig = getValidatedSupabaseConfig();

export const supabaseConfigError = supabaseConfig.error;
export const isSupabaseConfigured = Boolean(supabaseConfig.config);
export const supabase = supabaseConfig.config
  ? createClient<Database>(supabaseConfig.config.url, supabaseConfig.config.key)
  : null;
