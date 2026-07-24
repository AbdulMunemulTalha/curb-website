import SignupForm from "./SignupForm";

export default function Hero({ referredByCode }: { referredByCode?: string | null }) {
  return (
    <section className="mx-auto max-w-2xl px-5 pb-16 pt-8 text-center sm:pt-14">
      <h1 className="font-display text-4xl font-bold leading-[1.1] text-text-primary sm:text-5xl">
        Block the scroll.
        <br />
        Build the habit.
      </h1>
      <p className="mx-auto mt-5 max-w-md font-body text-base leading-relaxed text-text-secondary">
        Curb stands between you and the apps that steal your focus — Reels, Shorts,
        and the rest — so discipline stops depending on willpower alone.
      </p>
      <div className="mx-auto mt-8 max-w-md">
        <SignupForm referredByCode={referredByCode} />
      </div>
    </section>
  );
}
