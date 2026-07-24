"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/admin/logActivity";

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(true);
  const [spotsPerReferral, setSpotsPerReferral] = useState(5);
  const [countOverride, setCountOverride] = useState<string>("");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("waitlist_settings")
      .select("key, value")
      .in("key", ["waitlist_open", "referral", "displayed_count"]);

    for (const row of data ?? []) {
      if (row.key === "waitlist_open") setWaitlistOpen(!!row.value?.open);
      if (row.key === "referral") setSpotsPerReferral(row.value?.spots_per_referral ?? 5);
      if (row.key === "displayed_count") {
        setCountOverride(row.value?.override != null ? String(row.value.override) : "");
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setSaving(true);
    await Promise.all([
      supabase
        .from("waitlist_settings")
        .update({ value: { open: waitlistOpen } })
        .eq("key", "waitlist_open"),
      supabase
        .from("waitlist_settings")
        .update({ value: { spots_per_referral: spotsPerReferral } })
        .eq("key", "referral"),
      supabase
        .from("waitlist_settings")
        .update({
          value: { override: countOverride.trim() === "" ? null : parseInt(countOverride, 10) },
        })
        .eq("key", "displayed_count"),
    ]);
    await logActivity(supabase, "settings_updated", {
      waitlist_open: waitlistOpen,
      spots_per_referral: spotsPerReferral,
      displayed_count_override: countOverride.trim() === "" ? null : parseInt(countOverride, 10),
    });
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="p-8">
        <p className="font-body text-sm text-text-muted">Loading…</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-xl">
      <h1 className="font-display text-2xl font-bold text-text-primary">Settings</h1>
      <p className="mt-1 font-body text-sm text-text-secondary">
        Controls for the public waitlist page.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        <div className="rounded-card border border-border-subtle bg-bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-medium text-text-primary">
                Waitlist open
              </h2>
              <p className="mt-1 font-body text-xs text-text-secondary">
                Turn off to stop accepting new signups. Existing signups are unaffected.
              </p>
            </div>
            <button
              onClick={() => setWaitlistOpen(!waitlistOpen)}
              className={`h-6 w-11 shrink-0 rounded-pill transition-colors ${
                waitlistOpen ? "bg-accent-secondary" : "bg-border-subtle"
              }`}
            >
              <span
                className={`block h-5 w-5 translate-x-0.5 rounded-full bg-bg-base transition-transform ${
                  waitlistOpen ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="rounded-card border border-border-subtle bg-bg-surface p-5">
          <h2 className="font-display text-base font-medium text-text-primary">
            Referral reward
          </h2>
          <p className="mt-1 font-body text-xs text-text-secondary">
            Spots a person moves up the queue per successful referral.
          </p>
          <input
            type="number"
            min={0}
            value={spotsPerReferral}
            onChange={(e) => setSpotsPerReferral(parseInt(e.target.value || "0", 10))}
            className="mt-3 w-24 rounded-control border border-border-subtle bg-bg-base px-3 py-2 font-mono text-sm text-text-primary"
          />
        </div>

        <div className="rounded-card border border-border-subtle bg-bg-surface p-5">
          <h2 className="font-display text-base font-medium text-text-primary">
            Displayed count override
          </h2>
          <p className="mt-1 font-body text-xs text-text-secondary">
            Leave empty to show the real live count. Only set this if you have a specific,
            honest reason to show a different number.
          </p>
          <input
            type="number"
            min={0}
            placeholder="Real count"
            value={countOverride}
            onChange={(e) => setCountOverride(e.target.value)}
            className="mt-3 w-32 rounded-control border border-border-subtle bg-bg-base px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="self-start rounded-control bg-accent-primary px-5 py-2.5 font-display text-sm font-medium text-bg-base transition-colors hover:bg-accent-primary-pressed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </main>
  );
}
