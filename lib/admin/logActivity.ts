import { SupabaseClient } from "@supabase/supabase-js";

export async function logActivity(
  supabase: SupabaseClient,
  action: string,
  detail?: Record<string, unknown>,
  targetSignupId?: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("activity_log").insert({
    admin_id: user.id,
    action,
    target_signup_id: targetSignupId ?? null,
    detail: detail ?? null,
  });
}
