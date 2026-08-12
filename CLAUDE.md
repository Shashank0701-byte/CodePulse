# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CodePulse is a real-time developer presence platform — "Spotify Now Playing" for coding activity. A VS Code extension emits heartbeats over WebSocket, a WS server persists them and publishes live presence via Redis pub/sub, and a Next.js app renders a private dashboard and public per-user profile pages (`/[username]`) with live status via SSE.

pnpm workspace with four packages:
- `apps/web` — Next.js 16 (App Router, React 19, Turbopack) frontend + API routes + Prisma schema owner
- `apps/ws-server` — Express + `ws` WebSocket server that ingests heartbeats
- `packages/shared` — `@codepulse/shared`, a single Zod schema (`HeartbeatSchema`) shared between the extension and ws-server
- `extension` — the VS Code extension that sends heartbeats

## Commands

Run from repo root unless noted. Package manager is pnpm (`pnpm@10.32.1`, declared via `packageManager`).

```bash
pnpm install                          # install all workspace deps

# apps/web (Next.js)
pnpm --filter web dev                 # dev server, http://localhost:3000
pnpm --filter web build
pnpm --filter web lint                # eslint
cd apps/web && pnpm exec prisma migrate dev   # run/create a migration
cd apps/web && pnpm exec prisma generate      # regenerate client (see Prisma note below)

# apps/ws-server (WebSocket server)
pnpm --filter ws-server dev           # tsx watch, http://localhost:3001
pnpm --filter ws-server build         # tsc -> dist/
cd apps/ws-server && npx tsx test_ws.ts   # ad-hoc integration script (needs a real user+apiKey in the DB, DB reachable)

# extension (VS Code extension)
cd extension && pnpm run compile      # tsc -> out/
cd extension && pnpm run watch
# Debug via VS Code: "Run Extension" launch config in .vscode/launch.json (F5)

# Infra (Postgres + Redis, plus a containerized ws-server + nginx)
docker-compose up -d postgres redis   # just the datastores, for local `dev` against apps/web & ws-server
docker-compose up                     # full stack incl. ws-server container + nginx reverse proxy
```

There is no test runner configured anywhere in the repo (no jest/vitest, root `package.json` `test` script is a stub). The only test artifact is `apps/ws-server/test_ws.ts`, a manual script that opens real WebSocket connections against a running server and a live Postgres — not part of any CI/`pnpm test` flow.

## Architecture

### Data flow
1. **Extension** (`extension/src/extension.ts`) listens to VS Code editor events, debounces to 1 heartbeat/30s (`DEBOUNCE_MS`), builds a payload (`extension/src/heartbeat.ts`, includes git branch from `git.ts`), validates it against `HeartbeatSchema`, and sends it over a persistent WebSocket (`extension/src/client.ts`) authenticated via `x-api-key` header. Offline heartbeats queue in VS Code `globalState` (`extension/src/queue.ts`, capped at 500) and flush on reconnect.
2. **ws-server** (`apps/ws-server/src/index.ts`) accepts the HTTP upgrade, validates `x-api-key` against `User.apiKey` in Postgres (`auth.ts`) *before* completing the WS handshake (401 otherwise), then routes messages to `handlers/heartbeat.ts`, which: (a) re-validates against `HeartbeatSchema`, (b) writes a raw `Heartbeat` row, (c) upserts a `CodingSession` (open session = same user+project with `endTime: null`, closed/reopened on a 2-minute gap — see `SESSION_TIMEOUT_MS`), (d) calls `handlers/presence.ts` to `SETEX` the latest state in Redis (90s TTL, key `user:presence:<userId>`) and `PUBLISH` it on the `presence:updates` channel.
3. **apps/web** exposes `GET /api/presence` (`src/app/api/presence/route.ts`) as an SSE endpoint that subscribes to `presence:updates` and filters by `userId`, and the `usePresence` hook (`src/hooks/usePresence.ts`) consumes it client-side with auto-reconnect. `DynamicLiveStatus`/`LiveStatus` components wrap this as a `next/dynamic`, `ssr: false` component since `EventSource` is browser-only.
4. Aggregate stats (daily coding time, per-language/per-project breakdowns, recent sessions) are computed on-demand in `apps/web/src/lib/stats.ts` by combining `DailyStat` rollups with same-day `Heartbeat`/`CodingSession` rows — there is no background aggregation job; `DailyStat` rows are read but nothing currently writes them.

### Auth
NextAuth v5 (beta) with a GitHub-only provider and the Prisma adapter (`apps/web/src/lib/auth.ts`). On first sign-in (`events.createUser`) it generates a `username`, `displayName`, and an API key (`cp_<64 hex chars>`, `lib/api-key.ts`) — this API key is what the extension uses to authenticate to ws-server, decoupling app-session auth (NextAuth cookies) from device auth (the `x-api-key` header ws-server checks).

### Prisma / database — cross-package sharing quirk
`schema.prisma` lives only in `apps/web/prisma/schema.prisma` and generates its client into `apps/web/src/generated/prisma` (not `node_modules`, not a workspace package). `apps/web/src/lib/db.ts` imports it via `@/generated/prisma/client`. **`apps/ws-server/src/db.ts` imports the same generated client via a relative path (`../../web/src/generated/prisma/client`)** rather than a workspace dependency — ws-server has no `prisma` package/schema of its own. This means:
- Schema changes only ever happen in `apps/web`; running `prisma generate`/`migrate` there is what keeps both apps in sync.
- ws-server cannot build/run standalone until `apps/web`'s Prisma client has been generated at least once.
- Both apps independently construct a `PrismaClient` over a `pg.Pool` via `@prisma/adapter-pg` (driver adapter mode), each reading `DATABASE_URL` from its own env.

Key models (`apps/web/prisma/schema.prisma`): `User` (NextAuth fields + `username`/`apiKey`), `Heartbeat` (raw events), `CodingSession` (derived, has an open-ended `endTime`), `DailyStat` (daily rollup per user with `languages`/`projects` JSON — not currently populated by any code path in this repo). Standard NextAuth `Account`/`Session`/`VerificationToken` models are also present.

### Shared validation
`packages/shared` exports one thing: `HeartbeatSchema` (Zod). It's the single source of truth for the heartbeat payload shape and is imported identically by the extension (to validate before sending) and ws-server (to validate on receipt). When changing the heartbeat shape, edit it there — both consumers pick it up via `workspace:*`.

### Frontend structure
- `src/app/[username]/page.tsx` — public profile (server component, fetches `User` + recent `CodingSession`/`DailyStat` directly via Prisma)
- `src/app/dashboard/page.tsx` — private dashboard (server component, gated by `auth()`, pulls from `lib/stats.ts`)
- `src/app/dashboard/settings/` — API key display/regeneration
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `src/app/api/presence/route.ts` — SSE stream (see Data flow above)
- Styling: Tailwind v4, custom tokens in `tailwind.config.ts` (`pulse-green`, `pulse-bg`, `pulse-surface`, `pulse-border`, `pulse-muted`), dark mode via class strategy, React Compiler enabled (`next.config.ts` `reactCompiler: true`).

### Deployment topology
`nginx/nginx.conf` proxies `/ws` to the `ws-server` container and everything else to the web app (`host.docker.internal:3000`), implying web and ws-server are meant to sit behind one nginx entrypoint in production even though they're developed/run independently. `docker-compose.yml` only fully containerizes `postgres`, `redis`, `ws-server`, and `nginx` — the web app is expected to run separately (e.g. `host.docker.internal:3000`) rather than as a compose service.

## Notes
- `docs/` contains point-in-time PRDs and a sprint plan; `docs/CodePulse-CurrentState-PRD.md` describes an earlier, mostly-unimplemented snapshot of this repo and is stale relative to current code — treat it as historical context, not a current spec.
- Several UI values (commit/PR counts on the profile page, the contribution heatmap, "Good" activity labels on the dashboard) are hardcoded/mocked placeholders, not derived from real data yet.
