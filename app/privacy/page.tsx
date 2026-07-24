export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 font-body text-text-secondary">
      <a href="/" className="font-body text-sm text-accent-secondary hover:underline">
        &larr; Back
      </a>
      <h1 className="mt-6 font-display text-2xl font-bold text-text-primary">
        Privacy Policy
      </h1>
      <p className="mt-2 font-body text-xs text-text-muted">
        Draft — replace with reviewed copy before this goes live.
      </p>

      <div className="mt-6 space-y-5 font-body text-sm leading-relaxed">
        <p>
          This page describes what Curb collects when you join the waitlist, and how
          we use it. It applies only to this waitlist site, not the Curb app itself.
        </p>

        <section>
          <h2 className="font-display text-base font-medium text-text-primary">
            What we collect
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Your email address, required to notify you at launch.</li>
            <li>Your first and last name.</li>
            <li>Your phone number.</li>
            <li>Your device preference (Android, iOS, or both).</li>
            <li>
              A hashed version of your IP address, used only to prevent duplicate or
              automated signups.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-base font-medium text-text-primary">
            How we use it
          </h2>
          <p className="mt-2">
            We use your email to send exactly one thing: a message when Curb
            launches. By submitting the waitlist form you agree to that one email —
            there&apos;s no separate box to check. Your phone number is stored but not
            used to contact you unless we say otherwise first. We don&apos;t sell this
            data, and we don&apos;t use it for anything beyond running the waitlist and
            understanding our early audience in aggregate.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-medium text-text-primary">
            Your rights
          </h2>
          <p className="mt-2">
            You can ask us to delete your data at any time by emailing{" "}
            <a href="mailto:hello@curb.wofobe.com" className="text-accent-secondary hover:underline">
              hello@curb.wofobe.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
