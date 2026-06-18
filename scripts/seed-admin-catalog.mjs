#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { createServer } from "vite";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("This server-only script seeds admin catalog tables and must not run in browser code.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false
  }
});

function safeId(value) {
  return (
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function defaultAssignmentRubric(lesson) {
  return [
    {
      id: `${lesson.id}-rubric-concept`,
      label: "Concept accuracy",
      description: "The answer uses the lesson concept correctly.",
      maxScore: 4,
      adminEditable: true
    },
    {
      id: `${lesson.id}-rubric-evidence`,
      label: "Evidence and reasoning",
      description: "The answer explains the reasoning with enough detail for review.",
      maxScore: 4,
      adminEditable: true
    },
    {
      id: `${lesson.id}-rubric-clarity`,
      label: "Clarity",
      description: "The response is organized, readable, and ready for mentor feedback.",
      maxScore: 2,
      adminEditable: true
    }
  ];
}

function defaultAssignmentConfig() {
  return {
    reviewMode: "manual",
    visibleToMentors: true,
    adminEditable: true
  };
}

function toCourseRow(course, index) {
  return {
    id: course.id,
    title: course.title,
    description: course.description ?? "",
    track: course.track ?? "",
    difficulty: course.difficulty ?? "Beginner",
    cover_url: course.coverUrl ?? null,
    tags: course.tags ?? [],
    enrollment_settings: course.enrollmentSettings ?? {},
    status: "published",
    sort_order: index
  };
}

function toLessonRow(courseId, lesson, index) {
  return {
    id: lesson.id,
    course_id: courseId,
    title: lesson.title,
    description: lesson.description ?? "",
    cover_url: lesson.coverUrl ?? null,
    duration: lesson.duration ?? "",
    video_label: lesson.video?.label ?? "Video placeholder",
    video_url: lesson.video?.url ?? null,
    video_source_type: lesson.video?.sourceType ?? "external",
    assignment_title: lesson.assignment?.title ?? "Lesson assignment",
    assignment_prompt: lesson.assignment?.prompt ?? "",
    assignment_accepts_files: lesson.assignment?.acceptsFiles ?? true,
    assignment_accepted_file_types: lesson.assignment?.acceptedFileTypes ?? [],
    assignment_max_file_size_mb: lesson.assignment?.maxFileSizeMb ?? 10,
    assignment_submit_label: lesson.assignment?.submitLabel ?? "Submit assignment",
    assignment_rubric: lesson.assignment?.rubric ?? defaultAssignmentRubric(lesson),
    assignment_management_config: lesson.assignment?.managementConfig ?? defaultAssignmentConfig(),
    mentor_lm_note_config: lesson.mentorLMNoteConfig ?? {},
    status: "published",
    sort_order: index
  };
}

function toMaterialRow(courseId, lessonId, material, index) {
  return {
    id: `${lessonId}-${material.id}`,
    course_id: courseId,
    lesson_id: lessonId,
    title: material.title,
    description: material.description ?? "",
    kind: material.kind ?? "document",
    url: material.url ?? "",
    storage_path: null,
    downloadable: material.downloadable ?? false,
    sort_order: index
  };
}

function toQuestionRow(courseId, lessonId, question, index) {
  return {
    id: question.id,
    course_id: courseId,
    lesson_id: lessonId,
    prompt: question.prompt,
    type: question.type ?? "radio",
    correct_answer: question.correctAnswer ?? "",
    accepted_answers: question.acceptedAnswers ?? [],
    feedback_correct: question.feedback?.correct ?? "",
    feedback_incorrect: question.feedback?.incorrect ?? "",
    sort_order: index
  };
}

function toChoiceRows(question) {
  return (question.options ?? []).map((option, index) => ({
    id: `${question.id}-${safeId(option)}-${index + 1}`,
    question_id: question.id,
    label: option,
    is_correct: option === question.correctAnswer,
    sort_order: index
  }));
}

function toOpportunityRow(opportunity, index) {
  return {
    id: opportunity.id,
    title: opportunity.title,
    category: opportunity.category ?? "",
    direction: opportunity.direction ?? "",
    format: opportunity.format ?? "Online",
    deadline: opportunity.deadline ?? "",
    grades: opportunity.grades ?? [],
    location: opportunity.location ?? "",
    description: opportunity.description ?? "",
    requirements: opportunity.requirements ?? "",
    tags: opportunity.tags ?? [],
    apply_url: opportunity.applyUrl ?? "",
    event_date: opportunity.eventDate ?? null,
    is_recurring: opportunity.isRecurring ?? false,
    posted_at: opportunity.postedAt ?? null,
    source_language: opportunity.sourceLanguage ?? null,
    source_title: opportunity.sourceTitle ?? null,
    source_description: opportunity.sourceDescription ?? null,
    source_requirements: opportunity.sourceRequirements ?? null,
    translations: opportunity.translations ?? {},
    status: "published",
    sort_order: index
  };
}

async function upsertRows(table, rows) {
  if (rows.length === 0) {
    return;
  }

  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }
}

const vite = await createServer({
  appType: "custom",
  logLevel: "warn",
  server: {
    middlewareMode: true
  }
});

try {
  const { courses, opportunities } = await vite.ssrLoadModule("/src/data/content.ts");
  const courseRows = courses.map(toCourseRow);
  const lessonRows = courses.flatMap((course) => course.lessons.map((lesson, index) => toLessonRow(course.id, lesson, index)));
  const materialRows = courses.flatMap((course) =>
    course.lessons.flatMap((lesson) => lesson.materials.map((material, index) => toMaterialRow(course.id, lesson.id, material, index)))
  );
  const questionRows = courses.flatMap((course) =>
    course.lessons.flatMap((lesson) =>
      lesson.selfCheck.questions.map((question, index) => toQuestionRow(course.id, lesson.id, question, index))
    )
  );
  const choiceRows = courses.flatMap((course) =>
    course.lessons.flatMap((lesson) => lesson.selfCheck.questions.flatMap((question) => toChoiceRows(question)))
  );
  const opportunityRows = opportunities.map(toOpportunityRow);

  await upsertRows("catalog_courses", courseRows);
  await upsertRows("catalog_lessons", lessonRows);
  await upsertRows("catalog_materials", materialRows);
  await upsertRows("catalog_quiz_questions", questionRows);
  await upsertRows("catalog_quiz_choices", choiceRows);
  await upsertRows("catalog_opportunities", opportunityRows);

  console.log(`Seeded ${courseRows.length} courses, ${lessonRows.length} lessons, and ${opportunityRows.length} opportunities.`);
} finally {
  await vite.close();
}
