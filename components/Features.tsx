import { VideoOff, ShieldCheck, Flame } from "lucide-react";

const features = [
  {
    icon: VideoOff,
    title: "Reels & Shorts Blocker",
    body: "Cut off the infinite scroll at the source, not just the app icon.",
  },
  {
    icon: ShieldCheck,
    title: "NSFW Shield",
    body: "On-device filtering that catches what app blockers miss.",
  },
  {
    icon: Flame,
    title: "Streaks that don't shame",
    body: "Miss a day and it resets — no guilt copy, just start today's.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-card border border-border-subtle bg-bg-surface p-5"
          >
            <Icon size={22} strokeWidth={1.5} className="text-accent-secondary" />
            <h3 className="mt-3 font-display text-base font-medium text-text-primary">
              {title}
            </h3>
            <p className="mt-1.5 font-body text-sm leading-relaxed text-text-secondary">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
