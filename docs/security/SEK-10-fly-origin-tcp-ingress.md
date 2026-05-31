# SEK-10 — Fly origin TCP ingress behavior (RDP finding close-out)

Date: 2026-05-31
Linear: SEK-10
Branch of record: `agent-team/sek-10-fly-origin-hardening-20260531`
Scope: Fly app `sek-labs-company` serving `https://sek-labs.com` and `https://www.sek-labs.com`.

## Summary

Cloudflare scan flagged the Fly origin IPv4 `66.241.124.204` as accepting TCP `3389`
("exposed RDP"). Investigation shows this is **Fly edge / shared anycast ingress
behavior**, not an app-level service. There is no RDP server, no Windows host, and
no per-app configuration that exposes 3389. No remediation is possible inside this
app's Fly config because Fly's edge proxy accepts TCP handshakes on arbitrary ports
on both shared and dedicated Fly IPs. The public attack surface
(`sek-labs.com`, `www.sek-labs.com`) is already protected by Cloudflare's proxied
DNS, which correctly filters port 3389.

## App configuration (read directly from Fly)

`fly.toml` (and `flyctl config show -a sek-labs-company`) defines only:

- `http_service.internal_port = 8080`
- `force_https = true`
- no `[[services]]` block
- no other ports

Container (`Dockerfile` + `nginx.conf`) only listens on TCP `8080` inside the VM
(nginx serving the Vite static build). No process binds 3389 anywhere in the image
or runtime.

Machines (`flyctl m list -a sek-labs-company`):

- `d8d2e09ce26478` (sjc) — STATE: `stopped`
- `d8d2e26ce16268` (sjc) — STATE: `stopped`

Both machines were `stopped` (auto-stop / start) during the initial investigation,
so there cannot have been an app-level listener on 3389. Re-verification after
waking a machine (`flyctl ssh console`, machine `d8d2e09ce26478` in state
`started`):

```
$ netstat -tlnp
Proto Local Address          PID/Program name
tcp   0.0.0.0:8080           634/nginx: master
tcp   [internal-v6]:22       635/hallpass        (Fly internal SSH agent)
```

Only `nginx` on `8080` and Fly's `hallpass` on the internal IPv6 management
interface. No process binds 3389 — and TCP 3389 on the external Fly IP still
accepts handshakes and still returns 0 bytes to a valid RDP X.224 Connection
Request. This is conclusive evidence that the 3389 accept is the Fly edge,
not the app.

## Evidence — Fly shared IPv4 `66.241.124.204` accepts TCP on arbitrary ports

```
nc -vz -w 5 66.241.124.204 22    -> Connection succeeded   (no SSH service in app)
nc -vz -w 5 66.241.124.204 23    -> Connection succeeded   (no Telnet service)
nc -vz -w 5 66.241.124.204 80    -> Connection succeeded   (expected; HTTP)
nc -vz -w 5 66.241.124.204 443   -> Connection succeeded   (expected; HTTPS)
nc -vz -w 5 66.241.124.204 3389  -> Connection succeeded   (claimed "RDP")
nc -vz -w 5 66.241.124.204 12345 -> Connection succeeded   (random high port)
```

Sending a valid RDP X.224 Connection Request to port 3389:

```
printf '\x03\x00\x00\x13\x0e\xe0\x00\x00\x00\x00\x00\x01\x00\x08\x00\x03\x00\x00\x00' \
  | nc -w 5 66.241.124.204 3389
# 0 bytes returned
```

Same probe to 12345 (control): 0 bytes returned. A real RDP server would respond
with a TPKT/X.224 Connection Confirm. Nothing speaks RDP.

## Evidence — dedicated IPv6 shows identical behavior

```
nc -vz -w 5 2a09:8280:1::112:3695:0 3389  -> Connection succeeded
nc -vz -w 5 2a09:8280:1::112:3695:0 443   -> Connection succeeded
nc -vz -w 5 2a09:8280:1::112:3695:0 12345 -> Connection succeeded
```

Allocating a dedicated Fly IPv4 would not change this — the accept-on-any-port
behavior is the Fly edge proxy, not the IP type.

## Evidence — public Cloudflare-fronted hostnames correctly filter 3389

```
nc -vz -w 5 sek-labs.com     3389  -> Operation timed out
nc -vz -w 5 www.sek-labs.com 3389  -> Operation timed out

curl -sI https://sek-labs.com       -> HTTP 200
curl -sI https://www.sek-labs.com   -> HTTP 200
```

DNS confirms public hostnames resolve to Cloudflare (104.21.x / 172.67.x), Fly
hostname resolves to the bare Fly IPs.

## Conclusion

The Cloudflare "exposed RDP" finding against `66.241.124.204` is a scanner
false-positive caused by Fly's edge proxy accepting TCP handshakes on arbitrary
ports. There is no app-level RDP service, no app-level config that exposes 3389,
and no per-app Fly knob that closes arbitrary TCP ports. The public attack surface
(`sek-labs.com`, `www.sek-labs.com`) is already correctly protected by Cloudflare's
proxied DNS.

## Recommendation (architectural follow-up)

1. **Scope security scans to public hostnames only** (`sek-labs.com`,
   `www.sek-labs.com`), not the Fly origin IP or `sek-labs-company.fly.dev`.
   Cloudflare's perimeter is the real public boundary.
2. **Keep Cloudflare DNS proxied** for both public hostnames (already done).
3. **Do not advertise** `sek-labs-company.fly.dev` as a public endpoint.
4. **If a future requirement is "the bare Fly IP must not accept TCP 3389"** —
   that requires changing hosting, not Fly config. Document this trade-off when
   evaluating any future host. Fly.io's edge proxy will accept TCP on arbitrary
   ports for both shared and dedicated IPs by design.

## Status

Closed out. No code or Fly config change required. SEK-10 may be marked Done with
this evidence file as the artifact of record.
