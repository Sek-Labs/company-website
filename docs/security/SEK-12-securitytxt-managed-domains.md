# SEK-12 - Managed-domain security.txt

Date: 2026-06-03
Branch: `agent-team/sek-12-securitytxt-20260603`
Linear: `SEK-12`

Cloudflare Security Insights export from 2026-05-31 reported `Security.txt not configured` across
managed public domains. The canonical disclosure route is:

- `Contact: mailto:isaachsek@gmail.com`
- `Expires: 2027-05-31T00:00:00Z`
- `Preferred-Languages: en`
- `Canonical: https://<domain>/.well-known/security.txt`

Rationale: `isaachsek@gmail.com` is the only confirmed monitored mailbox currently used for
security-adjacent routing. Replace with `security@sek-labs.com` after the alias is created and
verified. The expiration is set one year from the original Cloudflare remediation date so stale
disclosure metadata is forced back into review.

## Implementation

Cloudflare Security Center managed `security.txt` is enabled for all seven zones through
`PUT /zones/{id}/security-center/securitytxt`.

The four active/proxied domains serve valid `security.txt` from Cloudflare edge:

| Domain | Verification |
| --- | --- |
| `tallyspending.com` | `GET https://tallyspending.com/.well-known/security.txt` -> `200`, canonical/contact/expires present |
| `tallyfinances.com` | `GET https://tallyfinances.com/.well-known/security.txt` -> `200`, canonical/contact/expires present |
| `sek-labs.com` | `GET https://sek-labs.com/.well-known/security.txt` -> `200`, canonical/contact/expires present |
| `brickreports.com` | `GET https://brickreports.com/.well-known/security.txt` -> `200`, canonical/contact/expires present |

`takatheshiba.com` was active but its apex CNAME was DNS-only, so Cloudflare could not serve the
managed `security.txt`. On 2026-06-03, the apex CNAME `takatheshiba.com -> connect.hostinger.com`
was changed to `proxied: true`. Post-change verification:

```text
GET https://takatheshiba.com/.well-known/security.txt -> 200 text/plain; charset=utf-8
Canonical: https://takatheshiba.com/.well-known/security.txt
Contact: mailto:isaachsek@gmail.com
Expires: 2027-05-31T00:00:00Z
Preferred-Languages: en
```

`HEAD https://takatheshiba.com/.well-known/security.txt` returned an origin-style `404` during the
same verification window, but `GET` is the relevant RFC 9116 retrieval path and returned valid
Cloudflare-managed content.

## Parked domains

`tallyspend.com` and `stoopscore.com` have Cloudflare managed `security.txt` enabled, but neither
domain currently resolves at the apex. There is no active public website to verify. Cloudflare-managed
configuration is sufficient for the parked state; if either domain is brought online, add a proxied
apex DNS record so Cloudflare can serve `/.well-known/security.txt`.

## Verification commands

```sh
for d in tallyspending.com tallyfinances.com takatheshiba.com sek-labs.com brickreports.com; do
  curl -fsS -D - "https://$d/.well-known/security.txt"
done

dig +short tallyspend.com A
dig +short stoopscore.com A
```
