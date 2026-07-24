import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // never let Next.js treat this as a static/cacheable route
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.rpc("get_waitlist_count");

  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    Pragma: "no-cache",
  };

  if (error) {
    return NextResponse.json({ count: null }, { status: 500, headers });
  }

  return NextResponse.json({ count: data as number }, { headers });
}
