import Link from "next/link";
import { LayoutDashboard, Users, Share2, Settings, ScrollText } from "lucide-react";
import SignOutButton from "./SignOutButton";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/signups", label: "Signups", icon: Users },
  { href: "/admin/referrals", label: "Referrals", icon: Share2 },
  { href: "/admin/activity", label: "Activity Log", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col justify-between border-r border-border-subtle bg-bg-surface p-4">
      <div>
        <div className="px-2 py-3">
          <span className="font-display text-lg font-bold text-text-primary">Curb</span>
          <span className="ml-1 font-body text-xs text-text-muted">Admin</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-control px-3 py-2 font-body text-sm text-text-secondary transition-colors hover:bg-bg-raised hover:text-text-primary"
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <SignOutButton />
    </aside>
  );
}
