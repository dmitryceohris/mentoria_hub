import {
  courses,
  opportunities
} from "../data/content";
import type { Course, Lesson, LessonMaterial, LessonSelfCheckQuestion, Opportunity } from "../data/content";
import type { Database, Json } from "./database.types";
import { isSupabaseConfigured, supabase } from "./supabase";

export type CatalogCourseRow = Database["public"]["Tables"]["catalog_courses"]["Row"];
export type CatalogLessonRow = Database["public"]["Tables"]["catalog_lessons"]["Row"];
export type CatalogMaterialRow = Database["public"]["Tables"]["catalog_materials"]["Row"];
export type CatalogQuizQuestionRow = Database["public"]["Tables"]["catalog_quiz_questions"]["Row"];
export type CatalogQuizChoiceRow = Database["public"]["Tables"]["catalog_quiz_choices"]["Row"];
export type CatalogOpportunityRow = Database["public"]["Tables"]["catalog_opportunities"]["Row"];

export type AdminCatalog = {
  choices: CatalogQuizChoiceRow[];
  courses: CatalogCourseRow[];
  lessons: CatalogLessonRow[];
  materials: CatalogMaterialRow[];
  opportunities: CatalogOpportunityRow[];
  questions: CatalogQuizQuestionRow[];
};

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

function asJson(value: unknown): Json {
  return value as Json;
}

function safeId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function getAssignmentRubric(lesson: Lesson) {
  return lesson.assignment.rubric ?? [
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

function getAssignmentManagementConfig(lesson: Lesson) {
  return lesson.assignment.managementConfig ?? {
    reviewMode: "manual",
    visibleToMentors: true,
    adminEditable: true
  };
}

function toCourseRow(course: Course, index: number): Database["public"]["Tables"]["catalog_courses"]["Insert"] {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    track: course.track,
    difficulty: course.difficulty,
    cover_url: course.coverUrl ?? null,
    tags: asJson(course.tags),
    enrollment_settings: asJson(course.enrollmentSettings),
    status: "published",
    sort_order: index
  };
}

function toLessonRow(
  courseId: string,
  lesson: Lesson,
  index: number
): Database["public"]["Tables"]["catalog_lessons"]["Insert"] {
  return {
    id: lesson.id,
    course_id: courseId,
    title: lesson.title,
    description: lesson.description ?? "",
    cover_url: lesson.coverUrl ?? null,
    duration: lesson.duration,
    video_label: lesson.video.label,
    video_url: lesson.video.url ?? null,
    video_source_type: lesson.video.sourceType,
    assignment_title: lesson.assignment.title ?? "Lesson assignment",
    assignment_prompt: lesson.assignment.prompt,
    assignment_accepts_files: lesson.assignment.acceptsFiles,
    assignment_accepted_file_types: asJson(lesson.assignment.acceptedFileTypes),
    assignment_max_file_size_mb: lesson.assignment.maxFileSizeMb,
    assignment_submit_label: lesson.assignment.submitLabel,
    assignment_rubric: asJson(getAssignmentRubric(lesson)),
    assignment_management_config: asJson(getAssignmentManagementConfig(lesson)),
    mentor_lm_note_config: asJson(lesson.mentorLMNoteConfig),
    status: "published",
    sort_order: index
  };
}

function toMaterialRow(
  courseId: string,
  lessonId: string,
  material: LessonMaterial,
  index: number
): Database["public"]["Tables"]["catalog_materials"]["Insert"] {
  return {
    id: `${lessonId}-${material.id}`,
    course_id: courseId,
    lesson_id: lessonId,
    title: material.title,
    description: material.description ?? "",
    kind: material.kind,
    url: material.url,
    storage_path: null,
    downloadable: material.downloadable,
    sort_order: index
  };
}

function toQuestionRow(
  courseId: string,
  lessonId: string,
  question: LessonSelfCheckQuestion,
  index: number
): Database["public"]["Tables"]["catalog_quiz_questions"]["Insert"] {
  return {
    id: question.id,
    course_id: courseId,
    lesson_id: lessonId,
    prompt: question.prompt,
    type: question.type,
    correct_answer: question.correctAnswer,
    accepted_answers: asJson(question.acceptedAnswers ?? []),
    feedback_correct: question.feedback.correct,
    feedback_incorrect: question.feedback.incorrect,
    sort_order: index
  };
}

function toChoiceRows(question: LessonSelfCheckQuestion): Database["public"]["Tables"]["catalog_quiz_choices"]["Insert"][] {
  return (question.options ?? []).map((option, index) => ({
    id: `${question.id}-${safeId(option)}-${index + 1}`,
    question_id: question.id,
    label: option,
    is_correct: option === question.correctAnswer,
    sort_order: index
  }));
}

function toOpportunityRow(
  opportunity: Opportunity,
  index: number
): Database["public"]["Tables"]["catalog_opportunities"]["Insert"] {
  return {
    id: opportunity.id,
    title: opportunity.title,
    category: opportunity.category,
    direction: opportunity.direction,
    format: opportunity.format,
    deadline: opportunity.deadline,
    grades: asJson(opportunity.grades),
    location: opportunity.location,
    description: opportunity.description,
    requirements: opportunity.requirements,
    tags: asJson(opportunity.tags),
    apply_url: opportunity.applyUrl,
    event_date: opportunity.eventDate ?? null,
    is_recurring: opportunity.isRecurring ?? false,
    posted_at: opportunity.postedAt ?? null,
    source_language: opportunity.sourceLanguage ?? null,
    source_title: opportunity.sourceTitle ?? null,
    source_description: opportunity.sourceDescription ?? null,
    source_requirements: opportunity.sourceRequirements ?? null,
    translations: asJson(opportunity.translations ?? {}),
    status: "published",
    sort_order: index
  };
}

export async function fetchAdminCatalog(): Promise<AdminCatalog> {
  const client = ensureSupabase();
  const [courseResult, lessonResult, materialResult, questionResult, choiceResult, opportunityResult] = await Promise.all([
    client.from("catalog_courses").select("*").order("sort_order", { ascending: true }),
    client.from("catalog_lessons").select("*").order("sort_order", { ascending: true }),
    client.from("catalog_materials").select("*").order("sort_order", { ascending: true }),
    client.from("catalog_quiz_questions").select("*").order("sort_order", { ascending: true }),
    client.from("catalog_quiz_choices").select("*").order("sort_order", { ascending: true }),
    client.from("catalog_opportunities").select("*").order("sort_order", { ascending: true })
  ]);

  const firstError =
    courseResult.error ??
    lessonResult.error ??
    materialResult.error ??
    questionResult.error ??
    choiceResult.error ??
    opportunityResult.error;

  if (firstError) {
    throw firstError;
  }

  return {
    choices: choiceResult.data ?? [],
    courses: courseResult.data ?? [],
    lessons: lessonResult.data ?? [],
    materials: materialResult.data ?? [],
    opportunities: opportunityResult.data ?? [],
    questions: questionResult.data ?? []
  };
}

export async function seedCatalogFromStaticContent() {
  const client = ensureSupabase();
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

  const results = await Promise.all([
    client.from("catalog_courses").upsert(courseRows, { onConflict: "id" }),
    client.from("catalog_lessons").upsert(lessonRows, { onConflict: "id" }),
    client.from("catalog_materials").upsert(materialRows, { onConflict: "id" }),
    client.from("catalog_quiz_questions").upsert(questionRows, { onConflict: "id" }),
    client.from("catalog_quiz_choices").upsert(choiceRows, { onConflict: "id" }),
    client.from("catalog_opportunities").upsert(opportunityRows, { onConflict: "id" })
  ]);

  const firstError = results.find((result) => result.error)?.error;

  if (firstError) {
    throw firstError;
  }

  return fetchAdminCatalog();
}

export async function updateCatalogCourse(courseId: string, patch: Database["public"]["Tables"]["catalog_courses"]["Update"]) {
  const client = ensureSupabase();
  const { data, error } = await client.from("catalog_courses").update(patch).eq("id", courseId).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCatalogLesson(lessonId: string, patch: Database["public"]["Tables"]["catalog_lessons"]["Update"]) {
  const client = ensureSupabase();
  const { data, error } = await client.from("catalog_lessons").update(patch).eq("id", lessonId).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCatalogMaterial(materialId: string, patch: Database["public"]["Tables"]["catalog_materials"]["Update"]) {
  const client = ensureSupabase();
  const { data, error } = await client.from("catalog_materials").update(patch).eq("id", materialId).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCatalogOpportunity(
  opportunityId: string,
  patch: Database["public"]["Tables"]["catalog_opportunities"]["Update"]
) {
  const client = ensureSupabase();
  const { data, error } = await client.from("catalog_opportunities").update(patch).eq("id", opportunityId).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCatalogQuizQuestion(
  questionId: string,
  patch: Database["public"]["Tables"]["catalog_quiz_questions"]["Update"]
) {
  const client = ensureSupabase();
  const { data, error } = await client.from("catalog_quiz_questions").update(patch).eq("id", questionId).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}
