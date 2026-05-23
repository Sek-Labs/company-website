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

Canonical production target: Fly.io app `sek-labs-company`, served at `https://sek-labs.com`.

GitHub Pages and Cloudflare Pages are intentionally not deploy targets for this repo. The old GitHub Pages workflow was removed to avoid duplicate production paths.

This is a Vite static site. Build output is `dist/`.

```sh
npm run build
fly deploy
```

Before changing deployment config, verify production with:

```sh
curl -sSI https://sek-labs.com | sed -n '1,20p'
fly status -a sek-labs-company
```
