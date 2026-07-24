import SignupForm from "./SignupForm";

// Bottom CTA — same email-only form as the top, opens the same modal.
export default function SocialProof({
  referredByCode,
}: {
  referredByCode?: string | null;
}) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Ready when you are.
        </h2>
        <p className="mt-2 font-body text-sm text-text-secondary">
          Get an email the day Curb launches — nothing before that.
        </p>
        <div className="mt-6">
          <SignupForm referredByCode={referredByCode} />
        </div>
      </div>
    </section>
  );
}
