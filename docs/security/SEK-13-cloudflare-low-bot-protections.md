# SEK-13 - Cloudflare low bot protections

Date: 2026-06-03
Branch: `agent-team/sek-13-cloudflare-low-bot-protections-20260603`
Linear: `SEK-13`

Cloudflare Security Insights export from 2026-05-31 still recommended two low-priority bot/crawler
items:

- AI Labyrinth on managed zones.
- Turnstile widget at account level.

All Cloudflare state below was verified directly through the Cloudflare API. No secrets are recorded
in this file.

## AI Labyrinth

Cloudflare documents AI Labyrinth as invisible nofollow links for AI crawlers that ignore crawl
guidance. Cloudflare states the links do not affect SEO or page appearance and are ignored by bots
that respect no-crawl instructions:

- https://developers.cloudflare.com/bots/additional-configurations/ai-labyrinth/
- https://developers.cloudflare.com/api/resources/bot_management/

That makes the setting acceptable for all current managed zones:

- It does not change normal browser traffic.
- It does not challenge users or add product friction.
- It should not interfere with Google/Bing-style legitimate crawling.
- For BrickReports, the existing AEO/product tradeoff was already decided at the stronger layer:
  `ai_bots_protection` is `block`, so enabling the weaker decoy layer does not newly reduce allowed
  AI crawler access.

On 2026-06-03, `crawler_protection` was enabled through `PUT /zones/{id}/bot_management` for every
managed Cloudflare zone.

## Verified final bot config

Evidence artifact:
`/Users/dex/.openclaw-dev/workspace/tmp/sek-13-bot-management-after-20260603T113728.json`

| Zone | `crawler_protection` | `ai_bots_protection` | `fight_mode` | Notes |
| --- | --- | --- | --- | --- |
| `brickreports.com` | `enabled` | `block` | `true` | Public product; no user or SEO break expected from labyrinth nofollow traps. |
| `isaacsek.com` | `enabled` | `block` | `false` | Personal/portfolio zone; AI bot blocking already active. |
| `sek-labs.com` | `enabled` | `block` | `true` | Company site; no forms that require Turnstile today. |
| `stoopscore.com` | `enabled` | `block` | `true` | Parked/unused. |
| `takatheshiba.com` | `enabled` | `block` | `true` | Static public site. |
| `tallyfinances.com` | `enabled` | `block` | `true` | Managed domain. |
| `tallyspend.com` | `enabled` | `block` | `true` | Parked/unused. |
| `tallyspending.com` | `enabled` | `block` | `true` | Managed domain. |
| `trustedpalates.com` | `enabled` | `disabled` | `false` | Alpha product domain; labyrinth enabled without turning on broader AI bot blocking. |

## Turnstile decision

Cloudflare Turnstile is not a passive account-level toggle. It requires a widget plus client-side
rendering and server-side `siteverify` validation for each form or auth endpoint:

- https://developers.cloudflare.com/api/resources/turnstile/subresources/widgets/methods/create/
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/

Current account API evidence shows no existing Turnstile widgets:
`/Users/dex/.openclaw-dev/workspace/tmp/sek-13-turnstile-widgets-20260603T113728.json`

Turnstile should not be globally introduced yet for the current public surfaces:

- BrickReports magic-link and purchase flows are conversion-sensitive; they already have app-level
  rate limiting, bot detection, and IP blocking. Adding Turnstile without a targeted abuse signal
  risks false friction in the highest-value flows.
- Trusted Palates is an alpha/mobile-oriented product. A web Turnstile widget is not currently a
  clean fit for native/mobile auth without a product-specific implementation plan.
- Sek Labs / Taka / parked domains do not currently expose meaningful public forms that need a
  CAPTCHA replacement.

No Turnstile widget was created as part of this Cloudflare config task. The recommendation is
intentionally left disabled until an app-specific issue has product acceptance criteria, a chosen form
surface, and server-side token validation.

## Follow-up created

Created Linear follow-up `SEK-54` for a targeted BrickReports Turnstile spike/implementation plan:

- Identify the exact high-abuse or low-conversion-risk surfaces, if any.
- Add a feature-flagged widget only where useful.
- Validate tokens server-side before accepting protected submissions.
- Verify that the magic-link and checkout conversion paths do not gain unnecessary friction.

## Verification commands

```sh
curl -fsS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/bot_management"

curl -fsS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/challenges/widgets"
```

## Summary

- AI Labyrinth (`crawler_protection`) is enabled on all 9 managed Cloudflare zones.
- No zones were left disabled for AI Labyrinth.
- Turnstile remains disabled because it is app code, not account hygiene. It should be added only
  through a targeted product issue with server-side verification and conversion checks.
