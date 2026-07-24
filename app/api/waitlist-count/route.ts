import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // always hit the DB fresh — this gets polled for live updates

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.rpc("get_waitlist_count");

  if (error) {
    return NextResponse.json({ count: null }, { status: 500 });
  }

  return NextResponse.json({ count: data as number });
}
