"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Trash2, Mail, AlertTriangle, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/admin/logActivity";

type SignupRow = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  platform_preference: string;
  referral_code: string;
  referred_by_code: string | null;
  referral_count: number;
  notified_bool: boolean;
  suspicious: boolean;
  created_at: string;
  queue_position: number;
};

type SortKey = "created_at" | "queue_position" | "referral_count" | "email";

export default function SignupsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<SignupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [notifiedFilter, setNotifiedFilter] = useState("all");
  const [suspiciousOnly, setSuspiciousOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("waitlist_positions")
      .select(
        "id, email, first_name, last_name, phone, platform_preference, referral_code, referred_by_code, referral_count, notified_bool, suspicious, created_at, queue_position"
      );
    if (error) {
      setLoadError(error.message);
    } else {
      setLoadError("");
    }
    setRows((data as SignupRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fullName(r: SignupRow) {
    return [r.first_name, r.last_name].filter(Boolean).join(" ").trim();
  }

  const filtered = useMemo(() => {
    let out = rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.email.toLowerCase().includes(q) ||
          fullName(r).toLowerCase().includes(q) ||
          (r.phone ?? "").toLowerCase().includes(q)
      );
    }
    if (platformFilter !== "all") {
      out = out.filter((r) => r.platform_preference === platformFilter);
    }
    if (notifiedFilter !== "all") {
      out = out.filter((r) => r.notified_bool === (notifiedFilter === "notified"));
    }
    if (suspiciousOnly) {
      out = out.filter((r) => r.suspicious);
    }
    out = [...out].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "email") return a.email.localeCompare(b.email) * dir;
      return ((a[sortKey] as number) - (b[sortKey] as number)) * dir;
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, search, platformFilter, notifiedFilter, suspiciousOnly, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  }

  async function bulkMarkNotified() {
    if (selected.size === 0) return;
    await supabase.from("waitlist_signups").update({ notified_bool: true }).in("id", [...selected]);
    await logActivity(supabase, "bulk_mark_notified", { count: selected.size, ids: [...selected] });
    setSelected(new Set());
    load();
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} signup(s)? This can't be undone.`)) return;
    await supabase.from("waitlist_signups").delete().in("id", [...selected]);
    await logActivity(supabase, "bulk_delete", { count: selected.size, ids: [...selected] });
    setSelected(new Set());
    load();
  }

  async function deleteOne(id: string, email: string) {
    if (!confirm("Delete this signup? This can't be undone.")) return;
    await supabase.from("waitlist_signups").delete().eq("id", id);
    await logActivity(supabase, "delete_signup", { email }, id);
    load();
  }

  function exportCSV(onlySelected: boolean) {
    const data = onlySelected ? filtered.filter((r) => selected.has(r.id)) : filtered;
    const header = [
      "email",
      "first_name",
      "last_name",
      "phone",
      "platform_preference",
      "referral_code",
      "referred_by_code",
      "referral_count",
      "queue_position",
      "notified_bool",
      "suspicious",
      "created_at",
    ];
    const csvRows = data.map((r) =>
      header.map((h) => JSON.stringify((r as unknown as Record<string, unknown>)[h] ?? "")).join(",")
    );
    const csv = [header.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `curb-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Signups</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">{filtered.length} shown of {rows.length} total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(false)}
            className="flex items-center gap-1.5 rounded-control border border-border-subtle bg-bg-surface px-3 py-2 font-body text-xs text-text-primary hover:bg-bg-raised"
          >
            <Download size={14} strokeWidth={1.5} /> Export filtered
          </button>
        </div>
      </div>

      {loadError && (
        <p className="mt-3 font-body text-xs text-state-danger">Couldn&apos;t load signups: {loadError}</p>
      )}

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-control border border-border-subtle bg-bg-surface px-3 py-2">
          <Search size={14} strokeWidth={1.5} className="text-text-muted" />
          <input
            placeholder="Search email, name, or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="rounded-control border border-border-subtle bg-bg-surface px-3 py-2 font-body text-sm text-text-primary"
        >
          <option value="all">All platforms</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
          <option value="both">Both</option>
        </select>
        <select
          value={notifiedFilter}
          onChange={(e) => setNotifiedFilter(e.target.value)}
          className="rounded-control border border-border-subtle bg-bg-surface px-3 py-2 font-body text-sm text-text-primary"
        >
          <option value="all">Notified: all</option>
          <option value="notified">Notified</option>
          <option value="not-notified">Not notified</option>
        </select>
        <label className="flex items-center gap-1.5 rounded-control border border-border-subtle bg-bg-surface px-3 py-2 font-body text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={suspiciousOnly}
            onChange={(e) => setSuspiciousOnly(e.target.checked)}
            className="accent-accent-secondary"
          />
          Suspicious only
        </label>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-control border border-accent-secondary/40 bg-bg-surface px-3 py-2">
          <span className="font-body text-xs text-text-secondary">{selected.size} selected</span>
          <button
            onClick={bulkMarkNotified}
            className="flex items-center gap-1 rounded-control bg-accent-secondary px-2.5 py-1 font-body text-xs text-bg-base"
          >
            <Mail size={12} strokeWidth={1.5} /> Mark notified
          </button>
          <button
            onClick={() => exportCSV(true)}
            className="flex items-center gap-1 rounded-control border border-border-subtle px-2.5 py-1 font-body text-xs text-text-primary"
          >
            <Download size={12} strokeWidth={1.5} /> Export selected
          </button>
          <button
            onClick={bulkDelete}
            className="flex items-center gap-1 rounded-control bg-state-danger px-2.5 py-1 font-body text-xs text-text-primary"
          >
            <Trash2 size={12} strokeWidth={1.5} /> Delete
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-card border border-border-subtle">
        <table className="w-full min-w-[980px] font-body text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-surface text-left text-text-muted">
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={toggleSelectAll}
                  className="accent-accent-secondary"
                />
              </th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort("email")}>
                Email
              </th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Platform</th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort("referral_count")}>
                Referrals
              </th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort("queue_position")}>
                Position
              </th>
              <th className="px-3 py-2">Notified</th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort("created_at")}>
                Joined
              </th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-text-muted">
                  No signups match these filters.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border-subtle text-text-secondary">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggleSelect(r.id)}
                    className="accent-accent-secondary"
                  />
                </td>
                <td className="px-3 py-2 text-text-primary">
                  <div className="flex items-center gap-1.5">
                    {r.email}
                    {r.suspicious && (
                      <AlertTriangle size={12} strokeWidth={1.5} className="text-state-warning" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">{fullName(r) || "—"}</td>
                <td className="px-3 py-2">{r.phone || "—"}</td>
                <td className="px-3 py-2 capitalize">{r.platform_preference}</td>
                <td className="px-3 py-2 font-mono">{r.referral_count}</td>
                <td className="px-3 py-2 font-mono">#{r.queue_position}</td>
                <td className="px-3 py-2">{r.notified_bool ? "Yes" : "No"}</td>
                <td className="px-3 py-2">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteOne(r.id, r.email)}
                    className="text-text-muted transition-colors hover:text-state-danger"
                    aria-label="Delete signup"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
