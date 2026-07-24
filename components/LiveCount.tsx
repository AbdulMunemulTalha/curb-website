"use client";

import { useEffect, useState } from "react";
import SignalRing from "./SignalRing";

const POLL_INTERVAL_MS = 10000;

// Client component so this can actually update while someone is on the page:
// polls the count periodically, and bumps instantly the moment a signup
// succeeds anywhere on this page (see SignupModal's "curb:signup-success" event).
export default function LiveCount() {
  const [count, setCount] = useState<number | null>(null);

  async function fetchCount() {
    try {
      const res = await fetch("/api/waitlist-count", { cache: "no-store" });
      const data = await res.json();
      if (typeof data.count === "number") {
        setCount(data.count);
      }
    } catch {
      // transient failure — keep showing the last known value
    }
  }

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);

    function handleLocalSignup() {
      // instant optimistic bump for the person who just signed up
      setCount((prev) => (prev === null ? prev : prev + 1));
      // then reconcile with the real server count shortly after
      setTimeout(fetchCount, 1500);
    }
    window.addEventListener("curb:signup-success", handleLocalSignup);

    return () => {
      clearInterval(interval);
      window.removeEventListener("curb:signup-success", handleLocalSignup);
    };
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-5 pb-12">
      <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
        <SignalRing size={224} progress={0.62} variant="teal" />
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-4xl text-text-primary">
            {count === null ? "—" : count.toLocaleString()}
          </span>
          <span className="mt-1 font-body text-xs uppercase tracking-wide text-text-muted">
            already on the list
          </span>
        </div>
      </div>
    </section>
  );
}
