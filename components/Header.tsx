import { Instagram } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-6">
        <span className="font-display text-xl font-bold tracking-tight text-text-primary">
          Curb
        </span>
        <a
          href="https://instagram.com/abdulmunemultalha"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Curb on Instagram"
          className="text-text-secondary transition-colors hover:text-accent-primary"
        >
          <Instagram size={20} strokeWidth={1.5} />
        </a>
      </div>
    </header>
  );
}
