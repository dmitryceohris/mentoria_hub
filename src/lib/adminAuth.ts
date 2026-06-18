import type { Database } from "./database.types";
import { isSupabaseConfigured, supabase } from "./supabase";

export type AdminMembership = Database["public"]["Tables"]["admin_memberships"]["Row"];
export type AdminRole = AdminMembership["role"];
export type AdminStatus = AdminMembership["status"];

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

export function canEditCatalog(role: AdminRole) {
  return role === "admin" || role === "content_editor";
}

export function canReviewAssignments(role: AdminRole) {
  return role === "admin" || role === "mentor";
}

export function canManageStaff(role: AdminRole) {
  return role === "admin";
}

export async function fetchOwnAdminMembership(userId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("admin_memberships")
    .select("user_id, role, status, created_by, created_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchAdminMemberships() {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("admin_memberships")
    .select("user_id, role, status, created_by, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function upsertAdminMembership(
  actorId: string,
  input: { role: AdminRole; status: AdminStatus; userId: string }
) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("admin_memberships")
    .upsert(
      {
        user_id: input.userId,
        role: input.role,
        status: input.status,
        created_by: actorId
      },
      { onConflict: "user_id" }
    )
    .select("user_id, role, status, created_by, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
