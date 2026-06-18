import type { Database } from "./database.types";
import { isSupabaseConfigured, supabase } from "./supabase";

export type StudentCourseEnrollment = Database["public"]["Tables"]["student_course_enrollments"]["Row"];
export type StudentOpportunity = Database["public"]["Tables"]["student_opportunities"]["Row"];
export type StudentOpportunitySource = StudentOpportunity["source"];
export type StudentOpportunityStatus = StudentOpportunity["status"];
export type StudentWorkspaceState = Database["public"]["Tables"]["student_workspace_state"]["Row"];
export type MentorLMLessonNote = Database["public"]["Tables"]["mentor_lm_lesson_notes"]["Row"];
export type LessonAssignmentSubmission = Database["public"]["Tables"]["lesson_assignment_submissions"]["Row"];

export const defaultStudentWorkspaceState = (studentId: string): StudentWorkspaceState => ({
  student_id: studentId,
  recommended_opportunities_dismissed: false,
  recommended_opportunities_dismissed_at: null,
  created_at: "",
  updated_at: ""
});

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

export async function fetchStudentCourseEnrollments(studentId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("student_course_enrollments")
    .select("id, student_id, course_id, status, progress_percent, enrolled_at, created_at, updated_at")
    .eq("student_id", studentId)
    .neq("status", "archived")
    .order("enrolled_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function enrollStudentCourse(studentId: string, courseId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("student_course_enrollments")
    .upsert(
      {
        student_id: studentId,
        course_id: courseId,
        status: "active",
        progress_percent: 0
      },
      { onConflict: "student_id,course_id" }
    )
    .select("id, student_id, course_id, status, progress_percent, enrolled_at, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Course enrollment was not returned.");
  }

  return data;
}

export async function fetchStudentOpportunities(studentId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("student_opportunities")
    .select("id, student_id, opportunity_id, status, source, saved_at, created_at, updated_at")
    .eq("student_id", studentId)
    .order("saved_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchStudentAssignmentSubmissions(studentId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("lesson_assignment_submissions")
    .select("id, student_id, course_id, lesson_id, answer, attachment_path, attachment_name, review_status, score, feedback_text, reviewed_by, reviewed_at, submitted_at, created_at, updated_at")
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function saveStudentOpportunity(
  studentId: string,
  opportunityId: string,
  source: StudentOpportunitySource,
  status: StudentOpportunityStatus = "saved"
) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("student_opportunities")
    .upsert(
      {
        student_id: studentId,
        opportunity_id: opportunityId,
        status,
        source,
        saved_at: new Date().toISOString()
      },
      { onConflict: "student_id,opportunity_id" }
    )
    .select("id, student_id, opportunity_id, status, source, saved_at, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Saved opportunity was not returned.");
  }

  return data;
}

export async function fetchStudentWorkspaceState(studentId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("student_workspace_state")
    .select("student_id, recommended_opportunities_dismissed, recommended_opportunities_dismissed_at, created_at, updated_at")
    .eq("student_id", studentId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? defaultStudentWorkspaceState(studentId);
}

export async function dismissRecommendedOpportunitiesWindow(studentId: string) {
  const client = ensureSupabase();
  const dismissedAt = new Date().toISOString();
  const { data, error } = await client
    .from("student_workspace_state")
    .upsert(
      {
        student_id: studentId,
        recommended_opportunities_dismissed: true,
        recommended_opportunities_dismissed_at: dismissedAt
      },
      { onConflict: "student_id" }
    )
    .select("student_id, recommended_opportunities_dismissed, recommended_opportunities_dismissed_at, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Workspace state was not returned.");
  }

  return data;
}

export async function fetchMentorLMLessonNotes(studentId: string, courseId: string, lessonId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("mentor_lm_lesson_notes")
    .select("id, student_id, course_id, lesson_id, title, body, created_by, is_hidden, created_at, updated_at")
    .eq("student_id", studentId)
    .eq("course_id", courseId)
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function saveMentorLMLessonNote(studentId: string, courseId: string, lessonId: string, title: string, body: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("mentor_lm_lesson_notes")
    .insert({
      student_id: studentId,
      course_id: courseId,
      lesson_id: lessonId,
      title,
      body,
      created_by: "mentorlm",
      is_hidden: false
    })
    .select("id, student_id, course_id, lesson_id, title, body, created_by, is_hidden, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("MentorLM note was not returned.");
  }

  return data;
}

export async function setMentorLMLessonNotesHidden(
  studentId: string,
  courseId: string,
  lessonId: string,
  noteIds: number[],
  isHidden: boolean
) {
  if (noteIds.length === 0) {
    return [];
  }

  const client = ensureSupabase();
  const { data, error } = await client
    .from("mentor_lm_lesson_notes")
    .update({ is_hidden: isHidden })
    .eq("student_id", studentId)
    .eq("course_id", courseId)
    .eq("lesson_id", lessonId)
    .in("id", noteIds)
    .select("id, student_id, course_id, lesson_id, title, body, created_by, is_hidden, created_at, updated_at");

  if (error) {
    throw error;
  }

  return data ?? [];
}
