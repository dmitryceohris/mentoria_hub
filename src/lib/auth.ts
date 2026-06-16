import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Database, Json } from "./database.types";
import type { OnboardingProfile } from "../data/content";
import type { RegistrationForm, StudentProfile } from "../sections/AuthFlowSections";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type ProfileDraft = {
  name: string;
  email: string;
  grade: string;
  interests: string[];
  academic_direction: string;
  opportunity_preferences: {
    directions: string[];
    formats: string[];
    locations: string[];
  };
};

type OpportunityPreferencesRecord = {
  directions?: unknown;
  formats?: unknown;
  locations?: unknown;
  opportunity_types?: unknown;
};

function normalizeStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeOpportunityPreferences(value: Json | null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      directions: [],
      formats: [],
      locations: []
    };
  }

  const preferences = value as OpportunityPreferencesRecord;

  return {
    directions: normalizeStringArray(preferences.directions),
    formats: normalizeStringArray(preferences.formats),
    locations: normalizeStringArray(preferences.locations)
  };
}

export function mapProfileRow(row: ProfileRow): StudentProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    grade: row.grade,
    interests: normalizeStringArray(row.interests),
    academicDirection: row.academic_direction,
    opportunityPreferences: normalizeOpportunityPreferences(row.opportunity_preferences)
  };
}

export function buildProfilePayload(form: RegistrationForm, onboardingProfile: OnboardingProfile): ProfileDraft {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    grade: onboardingProfile.grade,
    interests: onboardingProfile.interests,
    academic_direction: onboardingProfile.academicDirection,
    opportunity_preferences: {
      directions: onboardingProfile.directions,
      formats: onboardingProfile.formats,
      locations: onboardingProfile.locations
    }
  };
}

export async function getSession() {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function onAuthStateChange(listener: (session: Session | null) => void) {
  if (!supabase) {
    return () => undefined;
  }

  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange((_event, session) => {
    listener(session);
  });

  return () => subscription.unsubscribe();
}

export async function signUpWithProfile(form: RegistrationForm, onboardingProfile: OnboardingProfile) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const profilePayload = buildProfilePayload(form, onboardingProfile);
  const { data, error } = await supabase.auth.signUp({
    email: form.email.trim(),
    password: form.password,
    options: {
      data: {
        name: profilePayload.name,
        grade: profilePayload.grade,
        interests: profilePayload.interests,
        academic_direction: profilePayload.academic_direction,
        opportunity_preferences: profilePayload.opportunity_preferences
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function fetchOwnProfile(userId: string) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfileRow(data) : null;
}

export async function updateOwnProfile(userId: string, form: RegistrationForm, onboardingProfile: OnboardingProfile) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const profilePayload = buildProfilePayload(form, onboardingProfile);
  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: profilePayload.name,
      email: profilePayload.email,
      grade: profilePayload.grade,
      interests: profilePayload.interests,
      academic_direction: profilePayload.academic_direction,
      opportunity_preferences: profilePayload.opportunity_preferences
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapProfileRow(data);
}
