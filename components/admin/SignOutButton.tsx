"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 rounded-control px-3 py-2 font-body text-sm text-text-secondary transition-colors hover:bg-bg-raised hover:text-text-primary"
    >
      <LogOut size={16} strokeWidth={1.5} />
      Sign out
    </button>
  );
}
