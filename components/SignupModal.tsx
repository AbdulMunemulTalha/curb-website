"use client";

import { useState, FormEvent, useEffect } from "react";
import { X, Check, Copy } from "lucide-react";

type Platform = "android" | "ios" | "both";

type SignupModalProps = {
  email: string;
  referredByCode?: string | null;
  onClose: () => void;
};

const errorMessages: Record<string, string> = {
  duplicate_email: "That email's already on the list.",
  waitlist_closed: "The waitlist is closed right now — check back soon.",
  rate_limited: "Too many signups from this connection. Try again in a bit.",
  invalid_email: "That doesn't look like a valid email.",
  missing_first_name: "Enter your first name.",
  missing_last_name: "Enter your last name.",
  missing_phone: "Enter your phone number.",
};

export default function SignupModal({ email, referredByCode = null, onClose }: SignupModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState<Platform>("both");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<{ position: number; referralCode: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError("Fill in your first name, last name, and phone to join.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          phone,
          platform,
          referredByCode,
          website,
        }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(errorMessages[data.reason] ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted({ position: data.queuePosition, referralCode: data.referralCode });
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopy() {
    if (!submitted) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://curb.wofobe.com";
    navigator.clipboard.writeText(`${origin}/?ref=${submitted.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 px-5"
      onClick={(e) => e.target === e.currentTarget && !submitting && onClose()}
    >
      <div className="w-full max-w-sm rounded-card border border-border-subtle bg-bg-surface p-6">
        {submitted ? (
          <div className="text-center">
            <p className="font-body text-sm text-text-secondary">You&apos;re on the list</p>
            <p className="mt-1 font-mono text-4xl text-accent-primary">#{submitted.position}</p>
            <p className="mt-3 font-body text-sm text-text-secondary">
              Share your link — every signup through it moves you closer to the front.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-control border border-border-subtle bg-bg-base px-3 py-2">
              <span className="flex-1 truncate font-mono text-xs text-text-secondary">
                curb.wofobe.com/?ref={submitted.referralCode}
              </span>
              <button
                onClick={handleCopy}
                type="button"
                className="flex shrink-0 items-center gap-1 rounded-control bg-accent-secondary px-3 py-1.5 font-body text-xs font-medium text-bg-base transition-colors hover:bg-accent-secondary/90"
              >
                {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-control border border-border-subtle px-4 py-2.5 font-display text-sm font-medium text-text-primary transition-colors hover:bg-bg-raised"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-text-primary">
                  Almost there
                </h2>
                <p className="mt-1 font-body text-xs text-text-secondary">{email}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-text-muted transition-colors hover:text-text-primary"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-control border border-border-subtle bg-bg-base px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-accent-secondary"
                />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-control border border-border-subtle bg-bg-base px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-accent-secondary"
                />
              </div>

              <input
                type="tel"
                required
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-control border border-border-subtle bg-bg-base px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-accent-secondary"
              />

              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full rounded-control border border-border-subtle bg-bg-base px-4 py-3 font-body text-sm text-text-primary focus:border-accent-secondary"
              >
                <option value="both">Android &amp; iOS</option>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
              </select>

              {/* Honeypot — hidden from real users, catches bots */}
              <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="modal-website">Leave this field empty</label>
                <input
                  id="modal-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {error && <p className="font-body text-xs text-state-danger">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 rounded-control bg-accent-primary px-4 py-3 font-display text-sm font-medium text-bg-base transition-colors hover:bg-accent-primary-pressed disabled:opacity-60"
              >
                {submitting ? "Joining…" : "Join the waitlist"}
              </button>
              <p className="text-center font-body text-[11px] leading-snug text-text-muted">
                By joining, you agree to receive an email when Curb launches.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
