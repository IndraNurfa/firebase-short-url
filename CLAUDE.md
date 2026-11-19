# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # next dev --turbopack (http://localhost:3000)
npm run build   # production build
npm run start   # serve production build
npm run lint    # next lint
```

No test framework is configured. Requires `MONGODB_URI` in `.env.local` (`src/lib/db.ts` throws at import time if it is missing).

Both `package-lock.json` and `pnpm-lock.yaml` exist; README documents `npm`.

## Architecture

Next.js 15 App Router + React 19 + Tailwind CSS v4 + Mongoose/MongoDB. Path alias `@/*` → `src/*`.

Request flow for the whole app:

- **Create:** `src/app/page.tsx` (client form) → `POST /api/shorten` ([route.ts](src/app/api/shorten/route.ts)). Body `{ longUrl, customUrl? }`. A custom slug must match `^[a-zA-Z0-9_-]{3,20}$` (lowercased, 409 if taken); otherwise a 7-char `nanoid` is generated. Note the route does not validate `longUrl` format and does not retry on a nanoid collision.
- **Resolve:** `src/app/[shortUrl]/page.tsx` (server component) looks up the slug in MongoDB and passes `destinationUrl`/`error` to `RedirectPage.tsx` (client component). The redirect is client-side: a 5-second countdown, then `window.location.href`. There is no HTTP 301/302 redirect.
- **Data:** `src/models/Url.ts` is a single Mongoose model (`longUrl`, `shortUrl` unique, `isCustom`, `created_at`, `versionKey: false`). `src/lib/db.ts` caches the connection on `global.mongoose` to survive dev hot reloads; call `dbConnect()` at the start of every route or server component that touches the DB.

- **Temporary links (stateless, no DB):** the form's "Temporary link" checkbox posts to `POST /api/temporary` ([route.ts](src/app/api/temporary/route.ts)). [tempLink.ts](src/lib/tempLink.ts) builds an HMAC-SHA256-signed token `base64url({u: longUrl, e: expiresAtMs}).signature` using `TEMP_LINK_SECRET` (required). `src/app/t/[token]/page.tsx` verifies it and reuses `RedirectPage`; expired or tampered tokens render its `error` state. TTL is 5 minutes, and links cannot be revoked early. Only http(s) URLs are signed.

Because `[shortUrl]` is a top-level dynamic segment, any custom slug can collide with a future static route (e.g. `/api` is already a real path).

UI is a single dark theme (no light mode). Design tokens (warm charcoal canvas, one orange accent, hairline borders, no shadows) live in `src/app/globals.css` and are used as Tailwind classes like `bg-canvas`, `text-ink`, `border-hairline`, `bg-primary`. Fonts are Inter and JetBrains Mono via `next/font`, icons are `@phosphor-icons/react`, and the shared header is in `layout.tsx`. The pages use plain elements and `cn` from `src/lib/utils.ts`. The shadcn files in `src/components/ui` (and `sonner`, `next-themes`) are no longer used by any page.

## Repo notes

- `GEMINI.md` and `blueprint.md` are leftover Firebase Studio / Gemini agent instructions. They say to maintain `blueprint.md` and not to run `next dev`. Those rules do not apply to Claude Code sessions, and `blueprint.md` is out of date (it predates the shadcn UI and custom slugs).
