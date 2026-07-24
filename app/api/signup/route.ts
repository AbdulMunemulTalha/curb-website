import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, reason: "invalid_request" }, { status: 400 });
  }

  const { email, firstName, lastName, phone, platform, referredByCode, website } = body;

  // Honeypot: real users never fill this hidden field. Pretend success so
  // bots don't learn their submission was rejected.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({
      ok: true,
      referralCode: "curb-" + Math.random().toString(36).slice(2, 10),
      queuePosition: Math.floor(Math.random() * 500) + 50,
    });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Consent is implicit in submitting the form (no checkbox in the UI) —
  // captured server-side as consent_given=true at insert time in the DB
  // function, not taken from client input.
  const { data, error } = await supabase.rpc("submit_waitlist_signup", {
    p_email: email,
    p_first_name: firstName ?? null,
    p_last_name: lastName ?? null,
    p_phone: phone ?? null,
    p_platform: platform ?? "both",
    p_referred_by_code: referredByCode ?? null,
    p_ip_hash: ipHash,
  });

  if (error) {
    return NextResponse.json({ ok: false, reason: "server_error" }, { status: 500 });
  }

  const result = data?.[0];
  if (!result?.ok) {
    return NextResponse.json({ ok: false, reason: result?.reason ?? "unknown" }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    referralCode: result.referral_code,
    queuePosition: result.queue_position,
  });
}
