## Roadmap

How we get from here to a finished, deployed project by **Sat Dec 5**, with every member doing JS work they own each week and no two people working in the same place.

**Status:** proposal. Owners are suggestions based on who has done similar work; swap freely. Nothing is yours until you assign yourself the issue.

### 1. How We Work

**Weekly rhythm:** we meet Monday in class for the check-in with our instructor (everyone attends; if you can't, email the instructor beforehand). Day-to-day chat happens in Discord, and who's doing what lives on the board. The progress report is due **Saturday 11:59 PM**.

1. **Pick a task.** Find an unassigned issue in your week's milestone on the [Kanban board](https://github.com/orgs/go-birds-fall-26/projects/1). Assign yourself and move it to **In progress**. If it's assigned to someone else, it's theirs: ask before touching it.
2. **One issue, one branch, one PR.** Put `Closes #N` in the PR description so the issue closes when the PR merges.
3. **Check the "Touches" column** before you start. If a file you need is listed under someone else's task the same week, message them first (see [Shared Files](#4-shared-files)).
4. **Any one teammate can approve a PR.** If someone asks you for a review, try to do it within a day.
5. **Merge before Saturday 11:59 PM.** Each progress report counts commits from Sunday 12:00 AM to Saturday 11:59 PM. Branch commits count too, but merging early avoids conflicts.
6. **Blocked?** Say so on the issue and in Discord, then pick up something unblocked. Every week has more than one way to make progress.
7. **Done early?** Take an item from the next milestone. Only pick up [stretch goals](../README.md#stretch-goals) once every contract item is done.

Your issues for the week are most of your progress report. LLM use follows [AGENTS.md](../AGENTS.md).

**Progress report tips** (from the course's report instructions):

- Everyone is expected to commit **JavaScript** regularly, not just HTML/CSS or design docs.
- **Pair programming?** List the commit hashes you worked on but didn't author, so you aren't penalized for fewer commits.
- **Non-code work** (research, design notes): include evidence of it in the report.
- `npm install` doesn't count as a contribution. Only commits made that Sunday through Saturday count.

### 2. Milestones

| Milestone | Dates | Done when |
|---|---|---|
| Week 08 | Sun Nov 8 – **Sat Nov 14** | Real NFL games show up in the Markets dropdowns. Pricing, the fake ESPN API, and default markets are merged. Login works. |
| Week 09 | Sun Nov 15 – **Sat Nov 21** | A logged-in user bets on "team X wins" for a real game, the bet settles against the fake ESPN API, and the winner gets paid. They can see the bet in their history. |
| Week 10 | Nov 22 – 28 | Thanksgiving. No planned work; catch up or get ahead. Counts toward the week 11 report. |
| Week 11 | Sun Nov 29 – **Sat Dec 5** | Every [contract](../README.md#contract) item is done: over/under team-points and player bets, search, and a deployed site. |
| Finals | Sun Dec 6 – **Thu Dec 10** | Buffer only: bug fixes, polish, demo rehearsal, contract review PDF. Demo is **Fri Dec 11** (morning). |

### 3. Work by Week

Sizes assume about 5 hours a week per person (from our proposal): **S** is a few hours, **M** is about a week's worth. "Touches" lists the main files, so overlaps are visible up front. File names for new code are suggestions.

#### Week 08: Real games and building blocks

Short week: the plan is going out on Tuesday, and Abdul is away from Thursday.

| Work item | Issue | Suggested owner | Size | Depends on | Touches |
|---|---|---|---|---|---|
| Markets page: game → team dropdowns ([MARKETS](MARKETS.md) steps 1–2), using seed games until the sync job lands | #18 | Nicolas | M | — | `views/markets.ejs`, `public/js/markets.js` |
| Fake ESPN API with saved responses, for tests and demos | #15 | Abdul | M | — | `src/routes/` (test-only route), saved JSON |
| ESPN sync job: load this NFL week plus the next two into `events`, map ESPN statuses (MARKETS step 3) | #19 | Ryan | M | — | `src/services/espn.js`, `src/jobs/`, `.env.example` |
| Pricing and fee functions: Yes/No price from counts (clamped to 1–99¢), and the fee formula | #8 | Alex | M | — | new `src/services/pricing.js` |
| Default market creation: make sure each game has its "home team wins" market (MARKETS step 3b) | #20 | Evan | S | — | new `src/services/markets.js`, `src/db/sql/seed.sql` (uniqueness rule) |
| Merge the home page UI (rebase on main first) | PR #10 | Evan | S | — | `views/home.ejs`, `views/layout.ejs`, `views/partials/nav.ejs`, `public/css/styles.css` |
| Get registration and login reviewed and merged, then start sessions | #4 / PR #13, #16 | Kennan | M | — | `src/routes/auth.js`, `src/services/users.js`, auth views |

#### Week 09: First bet, start to finish

| Work item | Issue | Suggested owner | Size | Depends on | Touches |
|---|---|---|---|---|---|
| Buy route: re-check everything server-side (game not final, enough balance), charge the wallet, record the bet, update Yes/No counts, all in one transaction | #21 | Abdul | M | pricing, default market | new `src/routes/` buy route, `src/routes/index.js` |
| Markets page: show the live price and cost (with fee), quantity input, Buy button that calls the Buy route, show the result | #22 | Nicolas | M | Buy route (can start against a stub) | `views/markets.ejs`, `public/js/markets.js` |
| Settlement job: every 5 minutes, check games with open markets, decide each outcome with `getGameResult`, update `events` and `markets_outcomes`. Write down the status mapping ([MARKETS §6](MARKETS.md)) | #23 | Ryan | M | fake ESPN API (for testing) | `src/jobs/`, new `src/services/settlement.js` |
| Payouts: given a market and its outcome, pay each bet ($1 win, $0.50 tie, refund if cancelled), mark bets won/lost/refunded, record transactions | #24 | Evan | M | — (settlement calls it) | new `src/services/payouts.js`; reads `src/services/wallet.js` |
| Use the logged-in user everywhere: replace `DEV_USER_ID`, require login to buy, show login/logout in the nav | #25 | Kennan | M | sessions (#16) | `src/routes/account.js`, `views/partials/nav.ejs`, middleware |
| My bets page: every bet the user placed, with status (open, won, lost) and payout | #26 | Alex | M | — (seed some bets to build against) | new route + view; nav link via Kennan (see Shared Files) |

#### Week 11: Contract complete

| Work item | Issue | Suggested owner | Size | Depends on | Touches |
|---|---|---|---|---|---|
| Bet type dropdown and show/hide fields for over/under bets (MARKETS step 6) | #27 | Nicolas | M | — | `views/markets.ejs`, `public/js/markets.js` |
| Creating over/under markets: find or create the market for a template + params, so the Buy route works for every bet type | #28 | Abdul | M | Buy route | `src/services/markets.js`, buy route |
| Players: decide where they live, store team leaders from the scoreboard, roster JSON route (MARKETS steps 4–5) | #29 | Alex | M | sync job | `src/db/sql/seed.sql`, sync job (coordinate with Ryan), new route |
| Settling over/under bets: check team points and player stats from ESPN; add matching saved responses to the fake ESPN API | #30 | Ryan | M | settlement job | `src/services/espn.js`, `src/services/settlement.js` |
| Search games and markets; show markets the user created in their history | #31 | Kennan | M | My bets page | new route + view |
| Deploy: pick a host, set up `NODE_ENV`, add `npm run setup` (creates tables and dummy data) as the contract review's fallback | #32 | Evan | M | — | `package.json`, `server.js`, `src/db/` |

#### Finals buffer (Dec 6 – 10)

Bug fixes, styling, demo rehearsal, and the contract review PDF (deployed URL plus the checked-off contract). Stretch goals only if everything above is done.

### 4. Shared Files

These files get edited by several tasks. If your task touches one in the same week as someone else's, agree on who goes first.

| File | Who touches it | Plan |
|---|---|---|
| `views/partials/nav.ejs` | Evan (wk 8), Kennan (wk 9), Alex (wk 9) | Evan's PR #10 merges first. In week 9 Kennan owns it; Alex asks Kennan to add the My bets link. |
| `src/db/sql/seed.sql` | Evan (wk 8), Alex (wk 11) | Keep schema changes small and in their own commit. |
| `src/routes/index.js` | Abdul (wk 9), Alex (wk 9), Kennan (wk 11) | One-line additions; rebase before merging. |
| `src/services/espn.js` | Ryan (all weeks), Alex (wk 11) | Ryan owns it; Alex reads leaders through Ryan's sync job. |
| `src/jobs/` | Ryan (wk 8, 9), Alex (wk 11) | Ryan owns it. |
| `src/services/wallet.js` | Abdul (wk 9), Evan (wk 9) | Use the existing helpers; changes go through Abdul. |
| `views/markets.ejs`, `public/js/markets.js` | Nicolas (all weeks) | Nicolas owns them. |

### 5. Contract Coverage

Where each [contract](../README.md#contract) item gets done.

| Contract item | Week | Work |
|---|---|---|
| Deployment | 11 | Deploy |
| User accounts | 8–9 | Login, sessions, logged-in user everywhere |
| Users can create bets from hardcoded events | 8–9 | Dropdowns, sync job, default market, Buy route and page |
| Verifiable automatically via a sports API | 9, 11 | Settlement job, over/under settlement |
| More sophisticated events | 11 | Over/under team-points and player bets |
| Calculating price | 8–9 | Pricing functions, price display |
| Knowing when a bet is over and awarding winners | 9 | Settlement job, payouts |
| Add $ with Stripe | done | — |
| Search, and see bets created/placed/won/lost | 9, 11 | My bets page, search |

[Back to Main README](../README.md)
