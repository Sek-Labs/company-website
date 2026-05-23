# AGENTS.md - company-website

## Scope

Sek Labs public company website. This is a Vite static site for `https://sek-labs.com`.

## Source of Truth

- Package scripts live in `package.json`.
- Fly.io config lives in `fly.toml`.
- Canonical production app: Fly app `sek-labs-company`.
- GitHub Pages and Cloudflare Pages are not deploy targets for this repo.

## Commands

```sh
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment

Do not deploy unless explicitly asked. If deployment is requested, use Fly.io for app `sek-labs-company`; do not add or restore GitHub Pages deployment.

## Agent Notes

- Keep changes small and website-specific.
- Do not commit generated `dist/` churn unless the task explicitly requires it.
- Verify deployment-related edits against `fly.toml` and the README before changing docs.
