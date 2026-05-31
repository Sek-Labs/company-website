# SEK-14 — Cloudflare low-priority security hygiene

Date: 2026-05-31
Branch: `agent-team/sek-14-cloudflare-low-hygiene-20260531`
Evidence source (untrusted, verified independently): `Cloudflare ... SecurityInsights_20260424_1040.csv` (scan performed 2026-04-18).

All Cloudflare/DNS state below was verified directly via the Cloudflare API and authoritative DNS
(`dig @dora.ns.cloudflare.com`) before and after each change. No secrets are recorded in this file.

## Zones in scope (8 total; isaacsek.com out of scope)

| Zone | Mail posture | Apex proxied |
|------|--------------|--------------|
| sek-labs.com | Google Workspace (sends real mail), SPF `~all`, DKIM published | yes |
| tallyfinances.com | Cloudflare Email Routing (inbound-only forward) | yes |
| tallyspending.com | no MX / no SPF (non-mail) | yes |
| brickreports.com | Cloudflare Email Routing | yes |
| takatheshiba.com | no MX / no SPF | no (apex CNAME, DNS-only) |
| tallyspend.com | parked, no apex DNS record | n/a |
| stoopscore.com | parked, no apex DNS record | n/a |

## 1. security.txt (Low) — FIXED via Cloudflare edge

Enabled Cloudflare Security Center managed `security.txt` (PUT
`/zones/{id}/security-center/securitytxt`) on all 7 in-scope zones. No application repo changes were
required — Cloudflare serves `/.well-known/security.txt` at the edge for proxied hostnames.

Record content (per zone):
- `Contact: mailto:isaachsek@gmail.com`  (only confirmed-monitored mailbox; also the established
  brickreports.com DMARC `rua`. Swap to `security@sek-labs.com` once that Workspace alias is confirmed.)
- `Expires: 2027-05-31T00:00:00Z`
- `Preferred-Languages: en`
- `Canonical: https://<zone>/.well-known/security.txt`

Post-change verification (`curl -L https://<zone>/.well-known/security.txt`):

| Zone | Result |
|------|--------|
| sek-labs.com | **200 text/plain — SERVING** |
| tallyfinances.com | **200 text/plain — SERVING** |
| tallyspending.com | **200 text/plain — SERVING** |
| brickreports.com | **200 text/plain — SERVING** |
| takatheshiba.com | config enabled, **NOT served** (404) — apex CNAME is DNS-only (proxied=false) |
| tallyspend.com | config enabled, **NOT served** — parked, no apex DNS record |
| stoopscore.com | config enabled, **NOT served** — parked, no apex DNS record |

Blocker / next action for the 3 non-serving zones: the edge can only serve security.txt for a
**proxied** hostname. Enable Cloudflare proxy (orange-cloud) on `takatheshiba.com` once confirmed safe
for its origin, and add a proxied apex record to `tallyspend.com` / `stoopscore.com` if/when they are
brought online. Until then the config is in place and will begin serving automatically.

## 2. DMARC (Low) — FIXED for tallyfinances.com; sek-labs.com left to owner

Note: the April scan reported "missing or incorrectly formed DMARC record." Both flagged zones already
had syntactically valid records by 2026-05-31, so the *malformed/missing* condition was already cleared.
Remaining value was enforcement strength.

### tallyfinances.com — CHANGED (safe)
- Before: `v=DMARC1; p=none;`
- After:  `v=DMARC1; p=reject; rua=mailto:isaachsek@gmail.com; fo=1`
- Verified authoritative: `dig TXT _dmarc.tallyfinances.com @dora.ns.cloudflare.com`.
- Rationale: the domain uses Cloudflare Email Routing (inbound forwarding only) and sends no outbound
  mail as `@tallyfinances.com`, so `p=reject` carries no deliverability risk. This matches the sibling
  zone `brickreports.com`, which is already `p=reject` on the same setup.

### sek-labs.com — UNCHANGED (needs owner sign-off)
- Current: `v=DMARC1; p=none; rua=mailto:dmarc@sek-labs.com; fo=1` (valid, same-domain reporting works).
- Left at `p=none` deliberately: this domain sends production mail via Google Workspace. SPF + DKIM are
  aligned for Google, but raising to `p=quarantine`/`p=reject` could reject any *other* legitimate
  sender (SaaS/transactional) that has not yet surfaced in `rua` reports.
- Next action (owner): review aggregate `rua` reports, confirm all senders, then step
  `p=none -> p=quarantine -> p=reject`.

### Optional hardening (out of stated finding scope)
`tallyspending.com`, `tallyspend.com`, `takatheshiba.com`, `stoopscore.com` send no mail and have no
DMARC. Adding `v=DMARC1; p=reject;` (+ SPF `v=spf1 -all`) would block spoofing of these non-sending
domains. Not applied (outside the named DMARC scope and unconfirmed); recommended as follow-up.

## 3. AI Labyrinth / AI-bot protection (Low) — ALREADY REMEDIATED + dashboard residue

Verified `GET /zones/{id}/bot_management` for all 7 zones: every zone already has
`fight_mode: true` and `ai_bots_protection: "block"`. Bot Fight Mode and Block-AI-bots (the April
"Moderate" findings) are therefore already enabled account-wide.

The bot_management API exposes no discrete `ai_labyrinth` field (keys: `enable_js, fight_mode,
ai_bots_protection, content_bots_protection, crawler_protection, is_robots_txt_managed,
cf_robots_variant, using_latest_model`). The "AI Labyrinth" decoy toggle is dashboard-managed only.

Blocker / next action: no public API lever. To enable the decoy layer, toggle it in the dashboard per
zone: **Security -> Settings -> Bots -> AI Labyrinth -> On**. Practical AI-crawler protection is already
in place via `ai_bots_protection: "block"`, so this is a low-value enhancement.

## 4. Account-level Turnstile (recommendation) — NOT CONFIG-APPLICABLE

Turnstile is a CAPTCHA-replacement widget, not a passive zone/account toggle. Enabling it requires
creating a widget and integrating its client + server-side verification into each application's forms
(login/signup/contact). It cannot be "turned on" for a domain without app code changes.

Blocker / next action: per-application work, tracked outside this Cloudflare-config task. Create a
widget in the Cloudflare dashboard (Turnstile) and integrate into the relevant Tally / Brick / Stoop /
sek-labs forms in their respective repos.

## Out of scope (noted, not actioned)
- Moderate findings: "Always Use HTTPS", HSTS, "Full (strict) TLS" — not low-priority; many are
  edge-cert/SSL settings to confirm per zone.
- Critical "Exposed RDP (3389)" findings are tracked separately under SEK-10 (see
  `docs/security/SEK-10-fly-origin-tcp-ingress.md`).

## Summary
- security.txt: enabled on 7/7 zones; serving on 4/4 proxied zones; 3 pending DNS/proxy prerequisites.
- DMARC: tallyfinances.com hardened to `p=reject` (verified); sek-labs.com intentionally deferred to
  owner due to production-mail risk.
- AI bot protection: already enabled on all zones; AI Labyrinth decoy is dashboard-only.
- Turnstile: requires per-app integration; documented, not actionable as config.
