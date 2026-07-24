import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 30; // seconds — cheap freshness without hammering the DB

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
