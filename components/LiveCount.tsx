import { createClient } from "@supabase/supabase-js";
import SignalRing from "./SignalRing";

async function getCount(): Promise<number> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.rpc("get_waitlist_count");
  if (error || typeof data !== "number") return 0;
  return data;
}

export default async function LiveCount() {
  const count = await getCount();

  return (
    <section className="mx-auto max-w-2xl px-5 pb-12">
      <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
        <SignalRing size={224} progress={0.62} variant="teal" />
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-4xl text-text-primary">
            {count.toLocaleString()}
          </span>
          <span className="mt-1 font-body text-xs uppercase tracking-wide text-text-muted">
            already on the list
          </span>
        </div>
      </div>
    </section>
  );
}
