import type { Database } from "./database.types";
import { isSupabaseConfigured, supabase } from "./supabase";

export type AssignmentSubmissionRow = Database["public"]["Tables"]["lesson_assignment_submissions"]["Row"];
export type AssignmentReviewEventRow = Database["public"]["Tables"]["assignment_review_events"]["Row"];
export type AssignmentReviewStatus = "reviewed" | "revision_requested";

export type AssignmentStudentProfile = {
  email: string;
  grade: string;
  id: string;
  name: string;
};

export type AdminAssignmentSubmission = AssignmentSubmissionRow & {
  student: AssignmentStudentProfile | null;
};

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

export async function fetchAdminAssignmentQueue(): Promise<AdminAssignmentSubmission[]> {
  const client = ensureSupabase();
  const { data: submissions, error: submissionsError } = await client
    .from("lesson_assignment_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (submissionsError) {
    throw submissionsError;
  }

  const studentIds = [...new Set((submissions ?? []).map((submission) => submission.student_id))];
  const profileMap = new Map<string, AssignmentStudentProfile>();

  if (studentIds.length > 0) {
    const { data: profiles, error: profilesError } = await client
      .from("profiles")
      .select("id, name, email, grade")
      .in("id", studentIds);

    if (profilesError) {
      throw profilesError;
    }

    (profiles ?? []).forEach((profile) => {
      profileMap.set(profile.id, {
        email: profile.email,
        grade: profile.grade,
        id: profile.id,
        name: profile.name
      });
    });
  }

  return (submissions ?? []).map((submission) => ({
    ...submission,
    student: profileMap.get(submission.student_id) ?? null
  }));
}

export async function fetchAssignmentReviewEvents(submissionId: number) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("assignment_review_events")
    .select("id, submission_id, actor_id, event_type, from_status, to_status, score, feedback_text, created_at")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function reviewAssignmentSubmission(input: {
  feedbackText: string;
  score: number | null;
  status: AssignmentReviewStatus;
  submissionId: number;
}) {
  const client = ensureSupabase();
  const { data, error } = await client.rpc("review_assignment_submission", {
    p_feedback_text: input.feedbackText.trim() || null,
    p_review_status: input.status,
    p_score: input.score,
    p_submission_id: input.submissionId
  });

  if (error) {
    throw error;
  }

  return data;
}
