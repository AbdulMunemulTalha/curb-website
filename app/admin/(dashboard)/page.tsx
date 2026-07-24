import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/admin/StatCard";
import GrowthChart from "@/components/admin/GrowthChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: signups, error } = await supabase
    .from("waitlist_signups")
    .select("id, email, first_name, last_name, phone, platform_preference, referral_count, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-3 font-body text-sm text-state-danger">
          Couldn&apos;t load signups: {error.message}
        </p>
      </main>
    );
  }

  const rows = signups ?? [];
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const total = rows.length;
  const todayCount = rows.filter((r) => new Date(r.created_at) >= startOfToday).length;
  const weekCount = rows.filter((r) => new Date(r.created_at) >= weekAgo).length;

  // last 14 days growth
  const days: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayKey = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const count = rows.filter((r) => r.created_at.slice(0, 10) === dayKey).length;
    days.push({ date: label, count });
  }

  const topReferrers = [...rows]
    .filter((r) => r.referral_count > 0)
    .sort((a, b) => b.referral_count - a.referral_count)
    .slice(0, 5);

  const platformCounts = rows.reduce<Record<string, number>>((acc, r) => {
    const key = r.platform_preference || "both";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const platformBreakdown = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);

  function displayName(r: { first_name: string | null; last_name: string | null; email: string }) {
    const full = [r.first_name, r.last_name].filter(Boolean).join(" ").trim();
    return full || r.email;
  }

  return (
    <main className="p-8">
      <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-text-secondary">
        Overview of the Curb waitlist.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total signups" value={total} />
        <StatCard label="Today" value={todayCount} />
        <StatCard label="This week" value={weekCount} />
      </div>

      <div className="mt-6 rounded-card border border-border-subtle bg-bg-surface p-5">
        <h2 className="font-display text-base font-medium text-text-primary">
          Signups, last 14 days
        </h2>
        <div className="mt-3">
          <GrowthChart data={days} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-border-subtle bg-bg-surface p-5">
          <h2 className="font-display text-base font-medium text-text-primary">
            Top referrers
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {topReferrers.length === 0 && (
              <p className="font-body text-sm text-text-muted">No referrals yet.</p>
            )}
            {topReferrers.map((r, i) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-control border border-border-subtle bg-bg-base px-3 py-2"
              >
                <span className="font-body text-sm text-text-primary">
                  <span className="mr-2 font-mono text-xs text-text-muted">#{i + 1}</span>
                  {displayName(r)}
                </span>
                <span className="font-mono text-sm text-accent-secondary">
                  {r.referral_count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border-subtle bg-bg-surface p-5">
          <h2 className="font-display text-base font-medium text-text-primary">
            Device breakdown
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {platformBreakdown.map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between">
                <span className="font-body text-sm capitalize text-text-secondary">{platform}</span>
                <span className="font-mono text-sm text-text-primary">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
