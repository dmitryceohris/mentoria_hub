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
      lesson_assignment_submissions: {
        Row: {
          id: number;
          student_id: string;
          course_id: string;
          lesson_id: string;
          answer: string;
          attachment_path: string | null;
          attachment_name: string | null;
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
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
