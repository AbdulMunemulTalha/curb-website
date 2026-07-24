# Curb Waitlist — Public Site + Admin Panel

## What's built and real (not mock anymore)
- Public landing page wired to a live Supabase backend (`Curb-website` project)
  - Real signup form → `submit_waitlist_signup` DB function (rate limiting,
    disposable-email flagging, referral crediting, dynamic queue position)
  - Real live signup counter → `get_waitlist_count` DB function
  - Honeypot field for bot rejection
  - Referral links: `?ref=<code>` on the URL is captured and credited on signup
- Admin panel at `/admin` (Supabase Auth, no public signup — accounts are
  seeded manually via SQL, see below)
  - `/admin` — dashboard: totals, 14-day growth chart, top referrers, source breakdown
  - `/admin/signups` — search/filter/sort table, bulk mark-notified/delete, CSV export
  - `/admin/referrals` — full leaderboard + manual position bonus adjustment
  - `/admin/activity` — log of admin actions (who did what, when)
  - `/admin/settings` — waitlist open/closed toggle, referral reward rule,
    displayed-count override

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000 for the public site, http://localhost:3000/admin for the admin panel.

`.env.local` already has the real Supabase URL + publishable key for the
`Curb-website` project — no setup needed to run this locally against real data.

## Deploy to Vercel manually
```bash
npm install -g vercel   # if you don't have it
vercel                  # first run: links/creates the project, follow prompts
vercel --prod           # when ready to go live
```
Or drag this folder into vercel.com/new. When deploying, add the same two
env vars from `.env.local` in the Vercel project settings
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

**Note:** I tried deploying this directly from here via the Vercel connector
and it's still blocked — the connected account doesn't have permission to
create projects on your "Talha" team (a role/permissions issue on Vercel's
side, not a code issue). Check Settings → Members on that team; once you're
an Owner/Admin (or ask whoever is), I can deploy directly next time.

## Admin login
Seeded directly via SQL (Supabase Auth doesn't have public signup enabled
for this app, by design). Credentials are in the chat response that produced
this build, not stored in this repo. **Change the password after first login**
— Settings aren't in the admin UI yet for that; do it from the Supabase
dashboard → Authentication → Users, or add a "change password" flow later.

## How the queue position actually works
`position` isn't a stored column — it's computed live in the
`waitlist_positions` SQL view from: signup order, minus
(referral_count × spots_per_referral), minus manual_bonus. That means
referral crediting and admin position adjustments take effect immediately,
with no batch job needed to keep it accurate.

## Next steps / not built yet
- Password reset flow for the admin login
- Email sending (Resend/SendGrid) for the actual launch announcement —
  the schema has `notified_bool` ready for this, but nothing sends yet
- Rate limiting is basic (3 signups/hour per IP hash via the DB function) —
  fine for now, revisit if this gets hit with real bot traffic
- `next` is pinned to `^14.2.35` — the patched line after the Dec 2025 RSC
  security advisories. Don't downgrade below that.
- Privacy policy at `/privacy` is a first draft — have it reviewed before
  this site goes live and starts collecting emails for real.

