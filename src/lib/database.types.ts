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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
