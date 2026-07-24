"use client";

import { useState, FormEvent } from "react";
import SignupModal from "./SignupModal";

type SignupFormProps = {
  referredByCode?: string | null;
};

// Visible form is deliberately just email + button everywhere on the page.
// Clicking "Join" opens SignupModal to collect the rest (first/last name,
// phone, device) and does the actual submission from inside the modal.
export default function SignupForm({ referredByCode = null }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter a valid email to join the list.");
      return;
    }
    setError("");
    setModalOpen(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full flex-1 rounded-control border border-border-subtle bg-bg-surface px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-accent-secondary"
          />
          <button
            type="submit"
            className="shrink-0 rounded-control bg-accent-primary px-6 py-3 font-display text-sm font-medium text-bg-base transition-colors hover:bg-accent-primary-pressed"
          >
            Join the waitlist
          </button>
        </div>
        {error && <p className="mt-2 font-body text-xs text-state-danger">{error}</p>}
      </form>

      {modalOpen && (
        <SignupModal
          email={email}
          referredByCode={referredByCode}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
