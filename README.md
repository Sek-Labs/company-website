# Sek Labs LLC Company Website

Professional one-page website for Sek Labs LLC at `https://sek-labs.com`, intended to support public company verification such as Apple Developer organization enrollment.

## Local development

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment

This is a Vite static site. Build output is `dist/`.

Recommended hosting options:

1. GitHub Pages: publish `dist/` from the GitHub Actions workflow below or configure Pages to deploy from Actions.
2. Cloudflare Pages: connect this repo, set build command `npm run build`, output directory `dist`.

`public/CNAME` sets the apex custom domain to `sek-labs.com`. Configure `www.sek-labs.com` as a redirect to the apex domain in Cloudflare or your hosting provider.

## DNS / SSL note

As of 2026-05-06, `https://sek-labs.com` returns Cloudflare `526 Invalid SSL certificate`. That usually means Cloudflare is set to Full/Strict but the origin certificate is invalid/mismatched, or the origin is misconfigured. Fix outside this repo by either:

- Using Cloudflare Pages for this repo and attaching `sek-labs.com` there, or
- Setting the current origin to a valid certificate for `sek-labs.com`, or
- Temporarily switching Cloudflare SSL mode from Full (strict) to Full only while correcting the origin certificate.

Do not use Flexible SSL for production.
