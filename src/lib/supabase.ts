import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured =
  typeof supabaseUrl === "string" &&
  supabaseUrl.startsWith("https://") &&
  typeof supabasePublishableKey === "string" &&
  supabasePublishableKey.length > 20;

export const supabase = isSupabaseConfigured ? createClient<Database>(supabaseUrl, supabasePublishableKey) : null;
