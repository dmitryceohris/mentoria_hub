export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_memberships: {
        Row: {
          user_id: string;
          role: "admin" | "mentor" | "content_editor";
          status: "active" | "suspended";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role: "admin" | "mentor" | "content_editor";
          status?: "active" | "suspended";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          role?: "admin" | "mentor" | "content_editor";
          status?: "active" | "suspended";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assignment_review_events: {
        Row: {
          id: number;
          submission_id: number;
          actor_id: string;
          event_type: "reviewed" | "revision_requested" | "commented";
          from_status: string | null;
          to_status: string | null;
          score: number | null;
          feedback_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          submission_id: number;
          actor_id: string;
          event_type: "reviewed" | "revision_requested" | "commented";
          from_status?: string | null;
          to_status?: string | null;
          score?: number | null;
          feedback_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          submission_id?: number;
          actor_id?: string;
          event_type?: "reviewed" | "revision_requested" | "commented";
          from_status?: string | null;
          to_status?: string | null;
          score?: number | null;
          feedback_text?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      catalog_courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          track: string;
          difficulty: "Beginner" | "Intermediate";
          cover_url: string | null;
          tags: Json;
          enrollment_settings: Json;
          status: "draft" | "published" | "archived";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          description?: string;
          track?: string;
          difficulty?: "Beginner" | "Intermediate";
          cover_url?: string | null;
          tags?: Json;
          enrollment_settings?: Json;
          status?: "draft" | "published" | "archived";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          track?: string;
          difficulty?: "Beginner" | "Intermediate";
          cover_url?: string | null;
          tags?: Json;
          enrollment_settings?: Json;
          status?: "draft" | "published" | "archived";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string;
          cover_url: string | null;
          duration: string;
          video_label: string;
          video_url: string | null;
          video_source_type: "youtube" | "telegram" | "file" | "external";
          assignment_title: string;
          assignment_prompt: string;
          assignment_accepts_files: boolean;
          assignment_accepted_file_types: Json;
          assignment_max_file_size_mb: number;
          assignment_submit_label: string;
          assignment_rubric: Json;
          assignment_management_config: Json;
          mentor_lm_note_config: Json;
          status: "draft" | "published" | "archived";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          course_id: string;
          title: string;
          description?: string;
          cover_url?: string | null;
          duration?: string;
          video_label?: string;
          video_url?: string | null;
          video_source_type?: "youtube" | "telegram" | "file" | "external";
          assignment_title?: string;
          assignment_prompt?: string;
          assignment_accepts_files?: boolean;
          assignment_accepted_file_types?: Json;
          assignment_max_file_size_mb?: number;
          assignment_submit_label?: string;
          assignment_rubric?: Json;
          assignment_management_config?: Json;
          mentor_lm_note_config?: Json;
          status?: "draft" | "published" | "archived";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string;
          cover_url?: string | null;
          duration?: string;
          video_label?: string;
          video_url?: string | null;
          video_source_type?: "youtube" | "telegram" | "file" | "external";
          assignment_title?: string;
          assignment_prompt?: string;
          assignment_accepts_files?: boolean;
          assignment_accepted_file_types?: Json;
          assignment_max_file_size_mb?: number;
          assignment_submit_label?: string;
          assignment_rubric?: Json;
          assignment_management_config?: Json;
          mentor_lm_note_config?: Json;
          status?: "draft" | "published" | "archived";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_materials: {
        Row: {
          id: string;
          course_id: string;
          lesson_id: string;
          title: string;
          description: string;
          kind: "document" | "download" | "link";
          url: string;
          storage_path: string | null;
          downloadable: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          course_id: string;
          lesson_id: string;
          title: string;
          description?: string;
          kind?: "document" | "download" | "link";
          url?: string;
          storage_path?: string | null;
          downloadable?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          lesson_id?: string;
          title?: string;
          description?: string;
          kind?: "document" | "download" | "link";
          url?: string;
          storage_path?: string | null;
          downloadable?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_opportunities: {
        Row: {
          id: string;
          title: string;
          category: string;
          direction: string;
          format: "Online" | "Offline" | "Hybrid";
          deadline: string;
          grades: Json;
          location: string;
          description: string;
          requirements: string;
          tags: Json;
          apply_url: string;
          event_date: string | null;
          is_recurring: boolean;
          posted_at: string | null;
          source_language: string | null;
          source_title: string | null;
          source_description: string | null;
          source_requirements: string | null;
          translations: Json;
          status: "draft" | "published" | "archived";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          category?: string;
          direction?: string;
          format?: "Online" | "Offline" | "Hybrid";
          deadline?: string;
          grades?: Json;
          location?: string;
          description?: string;
          requirements?: string;
          tags?: Json;
          apply_url?: string;
          event_date?: string | null;
          is_recurring?: boolean;
          posted_at?: string | null;
          source_language?: string | null;
          source_title?: string | null;
          source_description?: string | null;
          source_requirements?: string | null;
          translations?: Json;
          status?: "draft" | "published" | "archived";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          direction?: string;
          format?: "Online" | "Offline" | "Hybrid";
          deadline?: string;
          grades?: Json;
          location?: string;
          description?: string;
          requirements?: string;
          tags?: Json;
          apply_url?: string;
          event_date?: string | null;
          is_recurring?: boolean;
          posted_at?: string | null;
          source_language?: string | null;
          source_title?: string | null;
          source_description?: string | null;
          source_requirements?: string | null;
          translations?: Json;
          status?: "draft" | "published" | "archived";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_quiz_choices: {
        Row: {
          id: string;
          question_id: string;
          label: string;
          is_correct: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          question_id: string;
          label: string;
          is_correct?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          label?: string;
          is_correct?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_quiz_questions: {
        Row: {
          id: string;
          course_id: string;
          lesson_id: string;
          prompt: string;
          type: "radio" | "text";
          correct_answer: string;
          accepted_answers: Json;
          feedback_correct: string;
          feedback_incorrect: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          course_id: string;
          lesson_id: string;
          prompt: string;
          type?: "radio" | "text";
          correct_answer?: string;
          accepted_answers?: Json;
          feedback_correct?: string;
          feedback_incorrect?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          lesson_id?: string;
          prompt?: string;
          type?: "radio" | "text";
          correct_answer?: string;
          accepted_answers?: Json;
          feedback_correct?: string;
          feedback_incorrect?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_assignment_submissions: {
        Row: {
          id: number;
          student_id: string;
          course_id: string;
          lesson_id: string;
          answer: string;
          attachment_path: string | null;
          attachment_name: string | null;
          review_status: "submitted" | "reviewed" | "revision_requested";
          score: number | null;
          feedback_text: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          student_id: string;
          course_id: string;
          lesson_id: string;
          answer?: string;
          attachment_path?: string | null;
          attachment_name?: string | null;
          review_status?: "submitted" | "reviewed" | "revision_requested";
          score?: number | null;
          feedback_text?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          student_id?: string;
          course_id?: string;
          lesson_id?: string;
          answer?: string;
          attachment_path?: string | null;
          attachment_name?: string | null;
          review_status?: "submitted" | "reviewed" | "revision_requested";
          score?: number | null;
          feedback_text?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mentor_lm_lesson_notes: {
        Row: {
          id: number;
          student_id: string;
          course_id: string;
          lesson_id: string;
          title: string;
          body: string;
          created_by: "mentorlm";
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          student_id: string;
          course_id: string;
          lesson_id: string;
          title?: string;
          body: string;
          created_by?: "mentorlm";
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          student_id?: string;
          course_id?: string;
          lesson_id?: string;
          title?: string;
          body?: string;
          created_by?: "mentorlm";
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          grade: string;
          interests: Json;
          academic_direction: string;
          opportunity_preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string;
          grade?: string;
          interests?: Json;
          academic_direction?: string;
          opportunity_preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          grade?: string;
          interests?: Json;
          academic_direction?: string;
          opportunity_preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      telegram_course_announcements: {
        Row: {
          id: string;
          source_id: string;
          title: string;
          description: string;
          course_title: string | null;
          deadline: string | null;
          starts_at: string | null;
          apply_url: string;
          tags: Json;
          payload: Json;
          status: "draft" | "imported" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          source_id: string;
          title: string;
          description?: string;
          course_title?: string | null;
          deadline?: string | null;
          starts_at?: string | null;
          apply_url?: string;
          tags?: Json;
          payload?: Json;
          status?: "draft" | "imported" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string;
          title?: string;
          description?: string;
          course_title?: string | null;
          deadline?: string | null;
          starts_at?: string | null;
          apply_url?: string;
          tags?: Json;
          payload?: Json;
          status?: "draft" | "imported" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      telegram_ingest_events: {
        Row: {
          id: number;
          source_id: string;
          payload_type: "deadline" | "opportunity" | "course";
          payload: Json;
          status: "received" | "processed" | "failed";
          target_table: string | null;
          target_id: string | null;
          error_message: string | null;
          received_at: string;
          processed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          source_id: string;
          payload_type: "deadline" | "opportunity" | "course";
          payload?: Json;
          status?: "received" | "processed" | "failed";
          target_table?: string | null;
          target_id?: string | null;
          error_message?: string | null;
          received_at?: string;
          processed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          source_id?: string;
          payload_type?: "deadline" | "opportunity" | "course";
          payload?: Json;
          status?: "received" | "processed" | "failed";
          target_table?: string | null;
          target_id?: string | null;
          error_message?: string | null;
          received_at?: string;
          processed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_course_enrollments: {
        Row: {
          id: number;
          student_id: string;
          course_id: string;
          status: "active" | "paused" | "completed" | "archived";
          progress_percent: number;
          enrolled_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          student_id: string;
          course_id: string;
          status?: "active" | "paused" | "completed" | "archived";
          progress_percent?: number;
          enrolled_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          student_id?: string;
          course_id?: string;
          status?: "active" | "paused" | "completed" | "archived";
          progress_percent?: number;
          enrolled_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_opportunities: {
        Row: {
          id: number;
          student_id: string;
          opportunity_id: string;
          status: "saved" | "chosen";
          source: "search" | "recommended-window" | "manual";
          saved_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          student_id: string;
          opportunity_id: string;
          status?: "saved" | "chosen";
          source?: "search" | "recommended-window" | "manual";
          saved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          student_id?: string;
          opportunity_id?: string;
          status?: "saved" | "chosen";
          source?: "search" | "recommended-window" | "manual";
          saved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_workspace_state: {
        Row: {
          student_id: string;
          recommended_opportunities_dismissed: boolean;
          recommended_opportunities_dismissed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          student_id: string;
          recommended_opportunities_dismissed?: boolean;
          recommended_opportunities_dismissed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          student_id?: string;
          recommended_opportunities_dismissed?: boolean;
          recommended_opportunities_dismissed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      review_assignment_submission: {
        Args: {
          p_submission_id: number;
          p_review_status: "reviewed" | "revision_requested";
          p_score?: number | null;
          p_feedback_text?: string | null;
        };
        Returns: Database["public"]["Tables"]["lesson_assignment_submissions"]["Row"];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
