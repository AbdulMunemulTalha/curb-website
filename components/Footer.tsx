import { Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-5 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <span className="font-body text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Curb
        </span>
        <div className="flex items-center gap-4 font-body text-xs text-text-muted">
          <a
            href="https://instagram.com/abdulmunemultalha"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-text-secondary"
          >
            <Instagram size={14} strokeWidth={1.5} /> Instagram
          </a>
          <a
            href="mailto:hello@curb.wofobe.com"
            className="flex items-center gap-1 transition-colors hover:text-text-secondary"
          >
            <Mail size={14} strokeWidth={1.5} /> Contact
          </a>
          <a href="/privacy" className="transition-colors hover:text-text-secondary">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
