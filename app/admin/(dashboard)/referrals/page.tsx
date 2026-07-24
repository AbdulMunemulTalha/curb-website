"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/admin/logActivity";

type Row = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  referral_code: string;
  referral_count: number;
  manual_bonus: number;
  queue_position: number;
};

export default function ReferralsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("0");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("waitlist_positions")
      .select("id, email, first_name, last_name, referral_code, referral_count, manual_bonus, queue_position")
      .order("referral_count", { ascending: false });
    if (error) {
      setLoadError(error.message);
    } else {
      setLoadError("");
    }
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fullName(r: Row) {
    return [r.first_name, r.last_name].filter(Boolean).join(" ").trim();
  }

  function startEdit(row: Row) {
    setEditingId(row.id);
    setEditValue(String(row.manual_bonus));
  }

  async function saveBonus(id: string, email: string, previous: number) {
    const bonus = parseInt(editValue, 10);
    if (!Number.isFinite(bonus)) {
      setEditingId(null);
      return;
    }
    await supabase.from("waitlist_signups").update({ manual_bonus: bonus }).eq("id", id);
    await logActivity(supabase, "manual_bonus_adjusted", { email, from: previous, to: bonus }, id);
    setEditingId(null);
    load();
  }

  const ranked = [...rows].sort((a, b) => b.referral_count - a.referral_count);

  return (
    <main className="p-8">
      <h1 className="font-display text-2xl font-bold text-text-primary">Referrals</h1>
      <p className="mt-1 font-body text-sm text-text-secondary">
        Full leaderboard. Manual bonus moves someone up the queue independent of referrals —
        use it for partnerships or manual perks.
      </p>

      {loadError && (
        <p className="mt-3 font-body text-xs text-state-danger">Couldn&apos;t load referrals: {loadError}</p>
      )}

      <div className="mt-5 overflow-x-auto rounded-card border border-border-subtle">
        <table className="w-full min-w-[700px] font-body text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-surface text-left text-text-muted">
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Person</th>
              <th className="px-3 py-2">Referral code</th>
              <th className="px-3 py-2">Referrals</th>
              <th className="px-3 py-2">Manual bonus</th>
              <th className="px-3 py-2">Position</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              ranked.map((r, i) => (
                <tr key={r.id} className="border-b border-border-subtle text-text-secondary">
                  <td className="px-3 py-2 font-mono">#{i + 1}</td>
                  <td className="px-3 py-2 text-text-primary">{fullName(r) || r.email}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.referral_code}</td>
                  <td className="px-3 py-2 font-mono">{r.referral_count}</td>
                  <td className="px-3 py-2">
                    {editingId === r.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 rounded-control border border-border-subtle bg-bg-base px-2 py-1 font-mono text-xs text-text-primary"
                          autoFocus
                        />
                        <button
                          onClick={() => saveBonus(r.id, r.email, r.manual_bonus)}
                          className="rounded-control bg-accent-secondary px-2 py-1 font-body text-xs text-bg-base"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-control border border-border-subtle px-2 py-1 font-body text-xs text-text-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(r)}
                        className="font-mono text-xs text-text-primary underline decoration-border-subtle underline-offset-2 hover:decoration-accent-secondary"
                      >
                        {r.manual_bonus}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-accent-primary">#{r.queue_position}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
