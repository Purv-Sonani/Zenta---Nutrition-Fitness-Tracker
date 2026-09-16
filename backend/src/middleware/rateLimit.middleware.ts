import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

/**
 * Auth limiter — slows down credential stuffing and password brute force.
 *
 * Applied to POST /api/auth/login and POST /api/auth/register.
 *
 * Numbers and the reasoning behind them:
 *
 * - 10 attempts / 15 minutes / IP. A real person mistypes a password two or
 *   three times before they get it right or reach for a reset, so 10 leaves
 *   generous headroom for honest failure while still being a hard ceiling.
 *
 * - `skipSuccessfulRequests` means only 4xx/5xx responses consume budget. A
 *   user who logs in correctly never spends any of their allowance, so the
 *   limit is effectively invisible to legitimate traffic — it is a *failure*
 *   budget, not a request budget.
 *
 * - The attacker math: 10 failures per 15 minutes is 40/hour, ~960/day from
 *   one IP. Against our 6-character minimum password policy, even a small
 *   10k-entry credential list takes ~10 days per IP. That does not make
 *   guessing impossible, but it removes the cheap single-host attack and
 *   forces an attacker onto distributed infrastructure, where the volume is
 *   visible in logs.
 *
 * - A 15 minute window rather than an hour: long enough to destroy throughput,
 *   short enough that a genuine user who locked themselves out is waiting
 *   minutes rather than being shut out for the rest of the afternoon.
 *
 * Keyed on IP because at this point in the request there is no authenticated
 * identity to key on — the whole purpose of the endpoint is to establish one.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts from this address. Please try again in 15 minutes.",
  },
});

/**
 * AI limiter — protects the Gemini spend and the upstream quota.
 *
 * Applied to every /api/ai route, mounted *after* `protect` so that
 * `req.user` is populated and the key below is a real account id.
 *
 * Numbers and the reasoning behind them:
 *
 * - 20 requests / hour / user. Unlike a page load, every one of these calls
 *   is a billable model invocation, so this is a cost control first and an
 *   abuse control second.
 *
 * - Normal use is deliberate: a user balances a meal while deciding what to
 *   eat and checks their nutrition insight once or twice a day. Even a heavy
 *   user logging five meals in an evening makes ~5 calls in their busiest
 *   hour. 20 is roughly 4x that peak, so the ceiling sits well clear of real
 *   behaviour while still bounding a runaway client or a stuck retry loop.
 *
 * - Worst case for one compromised account is 480 calls/day instead of
 *   unbounded — a predictable, survivable bill rather than an open tap.
 *
 * Keyed on user id rather than IP, deliberately:
 *
 * - IP keying over-blocks. Offices, universities, and mobile carriers put
 *   many users behind one address, so one enthusiastic user would throttle
 *   everyone sharing their NAT.
 *
 * - IP keying also under-blocks, which matters more here. The thing being
 *   spent is *our* Gemini budget, and it is spent per account. An attacker
 *   with one set of stolen credentials and a pool of proxies gets an
 *   unlimited budget under IP keying; under account keying they get 20/hour
 *   no matter how many addresses they rotate through.
 *
 * The IP fallback only applies if this limiter is ever mounted somewhere
 * `protect` has not already run. `ipKeyGenerator` (rather than a bare
 * `req.ip`) normalizes IPv6 addresses to a /64 subnet, so a single client
 * cannot trivially sidestep the limit by moving within its own prefix.
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.user?.id ?? ipKeyGenerator(req.ip ?? ""),
  message: {
    success: false,
    message: "You've reached the AI request limit for this hour. Please try again later.",
  },
});
