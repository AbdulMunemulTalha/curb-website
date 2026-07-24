import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const actionLabels: Record<string, string> = {
  bulk_mark_notified: "marked signups as notified",
  bulk_delete: "deleted signups (bulk)",
  delete_signup: "deleted a signup",
  manual_bonus_adjusted: "adjusted a manual position bonus",
  settings_updated: "updated waitlist settings",
};

export default async function ActivityLogPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("activity_log")
    .select("id, action, detail, target_signup_id, created_at, admin_id")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: admins } = await supabase.from("admin_users").select("id, email");
  const adminEmailById = new Map((admins ?? []).map((a) => [a.id, a.email]));

  return (
    <main className="p-8">
      <h1 className="font-display text-2xl font-bold text-text-primary">Activity Log</h1>
      <p className="mt-1 font-body text-sm text-text-secondary">
        Lightweight accountability trail of admin actions — most recent first.
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {(logs ?? []).length === 0 && (
          <p className="font-body text-sm text-text-muted">No activity yet.</p>
        )}
        {(logs ?? []).map((log) => (
          <div
            key={log.id}
            className="rounded-card border border-border-subtle bg-bg-surface px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-body text-sm text-text-primary">
                <span className="text-accent-secondary">
                  {adminEmailById.get(log.admin_id) ?? "unknown admin"}
                </span>{" "}
                {actionLabels[log.action] ?? log.action}
              </p>
              <span className="font-mono text-xs text-text-muted">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
            {log.detail && (
              <pre className="mt-1.5 overflow-x-auto rounded-control bg-bg-base p-2 font-mono text-xs text-text-muted">
                {JSON.stringify(log.detail)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
