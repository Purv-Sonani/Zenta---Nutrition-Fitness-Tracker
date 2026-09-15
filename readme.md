# Zenta

A nutrition and fitness tracker that turns logged meals and workouts into goal-aware daily guidance, weekly adherence metrics, and AI meal suggestions.

**[Live demo → zenta-fnt.vercel.app](https://zenta-fnt.vercel.app)**

No signup needed — the login page has an **"Explore with Test Data"** button that loads the app with mock meals, workouts, goals, and progress data for the session.

![Dashboard](docs/screenshots/dashboard.png)

## Features

**Accounts & goals**
- Email/password registration and login, with the session held in an httpOnly JWT cookie.
- Goal setup is required before the dashboard unlocks: daily calorie target, daily protein target, and weekly workout days. Editable any time from `/dashboard/goals/edit`.

**Logging**
- Meals with name, calories, protein, carbs, fat, and date.
- Workouts with activity, duration, calories burned, and date.
- Each has a list view and a create form.

**Dashboard**
- Today's calories in, calories out, and net balance, with an on-track / at-risk / off-track status derived from how many of the three signals (calories, protein, activity) are met — thresholds tighten after 6 PM.
- **Today's Focus** — a single prioritized action (protein, calories, or movement) that goes quiet late in the day when there's no time left to act on it.
- **Weekly Progress** — calorie adherence, protein consistency days, and workout adherence over a rolling 7-day window.
- **Trends** — calorie, protein, and workout direction (improving / declining / stable / not enough data).
- **Insights** — pattern warnings for inconsistent protein intake or dropping workout consistency.

**AI**
- **Meal Balancer** (`/dashboard/balancer`) — describe a meal in plain text and Gemini suggests 2–3 culturally appropriate additions to fill protein, fiber, or healthy-fat gaps. Suggests additions only, never removals.

**Demo mode**
- Session-scoped (`sessionStorage`), swaps every store over to fixture data and suppresses the 401 redirect, so the app is fully browsable without an account. It's read-only — logging new entries requires a real account.

## Tech stack

**Frontend**
| | |
|---|---|
| Next.js `16.0.10` | App Router, route groups, `"use client"` pages |
| React `19.2.1` | |
| Tailwind CSS `v4` | CSS-variable theming (`bg-(--surface)`) |
| Zustand `5.0.9` | Client state, cache-once fetching |
| Axios `1.13.2` | `withCredentials`, 401 interceptor |
| Zod `4.1.13` | Form validation |
| lucide-react / react-icons | Icons |

**Backend**
| | |
|---|---|
| Express `5.1.0` | ESM, `.js` import extensions |
| TypeScript `5.9.3` | `strict`, `NodeNext` |
| Prisma `7.1.0` | With the `@prisma/adapter-pg` driver adapter |
| PostgreSQL `16` | |
| Zod `4.1.13` | Request validation |
| jsonwebtoken + bcryptjs | Auth |
| helmet + cors | Security headers, credentialed CORS allowlist |
| `@google/generative-ai` `0.24.1` | `gemini-2.5-flash-lite` |
| date-fns | Day bucketing for progress math |

**Infrastructure**
| | |
|---|---|
| Jest `30` + supertest `7` | Integration tests |
| Docker Compose | Postgres locally and in CI |
| GitHub Actions | Build → migrate → test on every push |
| Vercel / Render | Frontend / backend hosting |

## Architecture

```
   Browser
      │
      ▼
┌──────────────────┐   axios, withCredentials    ┌──────────────────┐
│  Next.js 16      │  ─────────────────────────► │  Express 5 API   │
│  (Vercel)        │   httpOnly JWT cookie       │  (Render)        │
│                  │ ◄─────────────────────────  │                  │
│  app/   pages    │      { success, data }      │  api/      routes│
│  store/ zustand  │                             │  controllers/    │
│  services/ axios │                             │  domain/   logic │
└──────────────────┘                             └────────┬─────────┘
                                                          │
                                    ┌─────────────────────┴──────────┐
                                    │                                │
                                    ▼                                ▼
                          ┌──────────────────┐            ┌──────────────────┐
                          │  Prisma 7 + pg   │            │  Gemini API      │
                          │  PostgreSQL 16   │            │  2.5-flash-lite  │
                          └──────────────────┘            └──────────────────┘

Gemini path:  aggregate user's 7-day history → derive signals → build prompt
              → call Gemini → strip fences → normalize keys → Zod validate → respond
```

The browser never talks to Gemini directly; the API key stays server-side and every AI response is validated before it reaches the client.

## Local setup

**Prerequisites** — Node.js 20+, Docker (for Postgres), and a [Google AI Studio](https://aistudio.google.com/) key for the AI features.

```bash
git clone https://github.com/Purv-Sonani/Zenta---Nutrition-Fitness-Tracker.git
cd Zenta---Nutrition-Fitness-Tracker
```

**1. Environment** — copy both templates and fill them in. `backend/.env.example` documents `PORT`, `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `GEMINI_API_KEY`, and `NODE_ENV`; `frontend/.env.example` documents `NEXT_PUBLIC_API_URL`.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**2. Database** — starts Postgres 16 on `localhost:5432`:

```bash
docker compose up -d
```

**3. Backend** — installs, applies migrations, and starts on `http://localhost:5001`:

```bash
cd backend
npm install
npm run migrate:dev
npm run dev
```

**4. Frontend** — in a second terminal, starts on `http://localhost:3000`:

```bash
cd frontend
npm install
npm run dev
```

Register an account, set your goals, and the dashboard unlocks.

## Testing

**21 integration tests across 5 suites** (`auth`, `goals`, `meal`, `workout`, `progress`) covering the full HTTP path — real routing, real middleware, real cookie auth, real Prisma queries against a real PostgreSQL instance. Every push runs them in GitHub Actions.

```bash
docker compose -f docker-compose.ci.yml build
docker compose -f docker-compose.ci.yml run --rm backend npm run migrate:ci
docker compose -f docker-compose.ci.yml run --rm backend npm run test:integration
docker compose -f docker-compose.ci.yml down -v
```

There is no frontend test suite yet — the pure scoring functions in `frontend/src/domain/dashboard/` are the obvious first target.

## Engineering decisions

### JWT in an httpOnly cookie, not localStorage

The token is set server-side with `httpOnly`, `secure`, and `sameSite: "none"` so that page JavaScript — including any injected script — cannot read it, which removes the most common way session tokens leak through XSS. The cost is real: the frontend can't inspect its own session, so `useAuthStore` persists a separate `isAuthenticated` flag in localStorage that can disagree with the actual cookie, and the axios 401 interceptor is what reconciles the two by bouncing to `/login`. Cross-site cookies also mean CORS must run with `credentials: true` against an explicit origin allowlist, and CSRF becomes a live concern that a token in `localStorage` wouldn't have had — there's no CSRF token in place yet.

### A separate Express API instead of Next.js route handlers

Keeping the API out of Next lets the Prisma client hold a long-lived `pg` connection pool in a single always-on process, rather than fighting connection churn across serverless invocations, and it lets the two halves deploy and scale independently on Render and Vercel. It also makes the whole API testable: supertest imports `app.ts` directly and exercises real routes and middleware with no Next runtime and no running server. The tradeoff is two deployments, the CORS and cookie configuration above, and duplicated types across the boundary — the `NutritionInsight` interface exists in both trees today and nothing stops the two copies from drifting.

### AI output is normalized, then validated — never trusted

Gemini is treated as an untrusted external input, not a function that returns the requested shape. The controller strips markdown fences, `normalizeNutritionInsight` maps the synonyms the model actually produces onto canonical keys and supplies a system-set confidence default rather than letting the model score its own certainty, and only then does Zod validate; a malformed response returns 502 or 422 instead of shipping a broken object to the UI. The downside is that the normalizer is a second hand-maintained description of the same shape, and it can drift from the schema — which is exactly what happened: `domain/ai/nutritionSchema.ts` still expects `prediction.if_continue` while the normalizer emits `prediction.risk`, so `/api/ai/nutrition-insight` currently fails validation on every call and the Nutrition Intelligence panel is commented out of the dashboard.

### Integration tests against real Postgres, not a mocked Prisma

Mocking Prisma would mostly assert that the mock was called, and would pass straight through the failures that actually break this app: migration drift, unique-constraint violations on registration, and the date-bucketing arithmetic behind every progress metric. Running against a real database in Docker means the tests catch those, and supertest carries a real login cookie through `protect` so authorization is covered end to end. The price is speed and setup — the suites need Docker, run with `--runInBand`, and share one database, so cleanup discipline matters; the auth suite's fixed fixture email currently makes it order-dependent, which a per-test reset would fix.

## License

MIT — see [LICENSE](LICENSE).
