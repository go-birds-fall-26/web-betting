## Markets Page (Bet Selection)

The Markets page is where a user picks what to bet on: a game, then a team, then a bet type (and a player or a number, depending on the bet), then an amount. This doc tracks what's built, how the pieces fit, and what's left.

**Status:** in progress. The route and seed data exist; the page itself isn't written yet, so `/markets` returns a 500 for now.

### User Flow

The current idea, not a fixed design. Change it as we build, and update this list when you do.

1. **Pick a game** from a dropdown of games open for betting, shown away team first ("Commanders vs. Giants").
2. **Pick one of its two teams.**
3. **Pick a bet type:** the team wins, the team's points, or a player's stat.
4. **Fill in what that bet type needs.** A win bet needs nothing more. A points bet needs a number and over/under. A player bet needs a player (from that team's leaders), a stat, a number, and over/under.
5. **See the price per contract** (from the server), enter how many contracts, see the total cost including the fee, and **Buy**.

### 1. What's Built

| File | What it does |
|---|---|
| `src/db/sql/seed.sql` | Seeds five week 10 games into `events`, using real ESPN IDs. |
| `src/services/events.js` | `getUpcomingEvents()` reads every row from `events`, ordered by `start_time`. |
| `src/routes/markets.js` | `GET /markets` loads events and renders the `markets` view. |
| `src/routes/index.js` | Mounts the route at `/markets`. |
| `views/partials/nav.ejs` | Markets link in the nav. |

To load the seed games:

```bash
npm run seed:reset
```

### 2. How It Fits Together

```
ESPN ──(sync job, not built)──► events table ──► GET /markets ──► EJS page ──► browser JS
                     │                                                           │
                     └──► markets table (default "home team wins" market)        │
                                                                                 │
                     GET /markets/teams/:teamId/roster  ◄──────── fetch() ───────┘
```

- **The database is the contract.** The page only reads `events`. Right now the rows come from `seed.sql`; later a sync job will fill the same table from ESPN, and the page won't need to change.
- **Every game gets one default market** when it enters `events`: "home team wins," where Yes means `home_team_id` wins. The sync job creates it (step 3b below).
- **Games and teams are sent with the page.** Each game `<option>` carries its team IDs and names in `data-` attributes, so picking a game fills the team dropdown without a request.
- **Players are fetched.** Picking a team calls a JSON route for that team's players. Starting with each team's passing, rushing, and receiving leaders, with room to grow to full rosters.
- **Option values use `events.id`**, our own ID, not the ESPN one, because `markets.event_id` references `events.id`. Team IDs in `events` are ESPN IDs, which is what the roster route needs.
- **Display order is away team first** ("Commanders vs. Giants" means WSH @ NYG). So the default market's Yes side is the **second** team named.

### 3. Next Steps

In rough order. "Depends on" means it needs that step done first.

| # | Task | Depends on | Notes |
|---|---|---|---|
| 1 | `views/markets.ejs` and `views/partials/event-select.ejs` | — | Placeholder option, then one option per event with `data-home-id`, `data-home-name`, `data-away-id`, `data-away-name`. Empty, disabled team `<select>`. Load `/js/markets.js` with `defer`. |
| 2 | `public/js/markets.js`: event → team dropdown | 1 | On `change`: clear the team select; disable it if the placeholder is picked; otherwise add the two teams from `dataset`. |
| 3 | ESPN sync job | — | Add a scoreboard function to `src/services/espn.js` (next to `getGameResult`, follow its style) and a job in `src/jobs/` that upserts into `events` with `ON CONFLICT (espn_game_id) DO UPDATE`. Load the current NFL week plus the next two (see the README's [When markets open](../README.md#how-a-bet-pays-out)). Run once at startup and on its own cron variable (add the name to `.env.example`). Map ESPN statuses to `events.status`. |
| 3b | Default market creation | — (3 to wire it in) | A function that makes sure a game has its "home team wins" market, and does nothing if it already exists (needs a uniqueness rule in the schema so a game can't get two). Build and test it against the seeded games, so it doesn't wait on step 3. Whichever of 3 and 3b merges second adds the one call from the sync job. |
| 4 | Store team leaders | 3, plus a decision on where players live | Read from the scoreboard (see ESPN notes). Never delete players because a list came back empty. |
| 5 | Roster JSON route + `fetch()` | 2, 4 | `GET /markets/teams/:teamId/roster` returns `res.json(...)`. Ignore a response if the team dropdown changed while it was loading. Show a message if the request fails. |
| 6 | Bet type dropdown, show/hide fields | 2 | Describe each bet type's needed fields (player, number, over/under) as data in one object, not separate `if`s. Number bets are over/under on a single number, not ranges. These choices will become `markets.template` and `markets.params`. |
| 7 | Price display and Buy | 3b, 6 | Price comes from the server, using the formula and fees in the README's [How prices work](../README.md#how-prices-work) and [How a bet pays out](../README.md#how-a-bet-pays-out). For a win bet, picking the home team buys Yes on the default market and picking the away team buys No. The Buy route must re-check everything server-side, including that the game isn't final (live games stay open). |

### 4. ESPN Notes

Checked against real responses on 2026-11-06. The API is unofficial and undocumented, so verify again before relying on a field.

Base URL: `https://site.api.espn.com/apis/site/v2/sports/football/nfl`

| Endpoint | Use |
|---|---|
| `/scoreboard` | Current week's games |
| `/scoreboard?seasontype=2&week=10&dates=2026` | A specific regular-season week |
| `/teams` | All 32 teams, under `sports[0].leagues[0].teams[].team` |
| `/teams/:id/roster` | A roster, grouped into `offense`, `defense`, `specialTeam`, `injuredReserveOrOut`, `suspended`, `practiceSquad` |
| `/summary?event=:id` | Used by `getGameResult` for settlement |

Things that will trip you up:

- **IDs are strings** (`"401873037"`). Don't `parseInt` them.
- **Times are UTC.** Thursday night games show up as Friday (`2026-11-13T01:15Z` is Nov 12, 8:15 PM ET). Convert only when displaying.
- **Read teams from `competitions[0].competitors[]`** and its `homeAway` field. Don't parse `name` or `shortName`: neutral-site games use `"VS"` instead of `"@"`.
- **Neutral-site games still have a home team.** `competitions[0].neutralSite` is `true` for international games, but one competitor is still `"home"` (checked 2026-11-10 against all eight in weeks 1–10, e.g. Madrid: CIN @ ATL, home = ATL).
- **Scores are strings** (`"10"`).
- **Per-team leaders** are at `competitions[0].competitors[].leaders[]` (`passingLeader`, `rushingLeader`, `receivingLeader`), with the player at `.leaders[0].athlete`. Ignore `competitions[0].leaders`, which is one leader across both teams.
- **Leaders are empty once a game is final**, and one player can lead two categories.

### 5. Open Questions for the Team

- **Team names:** short ("Commanders") or full ("Washington Commanders") in `events`? The seed uses short names.
- **Where do players live?** Separate `teams` and `players` tables, or the player ID inside `markets.params`? Decided by whoever takes step 4.

Settled: games open at least two NFL weeks ahead and stay open until final; each game has one "home team wins" default market; the win bet ships first, then over/under team-points and player bets. `events` has no `week` column, so the sync job decides which weeks to load.

### 6. Status Values (Work Still To Do)

Five places describe where a game or bet stands, each with its own words. The settlement job will need to translate between them; nobody has written that mapping yet.

| Where | Values |
|---|---|
| `events.status` | `scheduled`, `in_progress`, `final`, `cancelled` |
| `getGameResult()` | `final`, `not_final`, `tie` |
| `markets.status` | `open`, `closed`, `settled` |
| `markets_outcomes.result` | `yes`, `no`, `tie`, `cancelled` |
| `bets.status` | `open`, `cashed_out`, `won`, `lost`, `refunded` |

Gaps to close:

- `getGameResult()` has no value for a cancelled or postponed game, so those games could stay open forever. Check how ESPN reports them (a saved response in the fake ESPN API would help).
- `not_final` doesn't tell `scheduled` apart from `in_progress`. The sync job reads that from the scoreboard instead.
- A tie sets the game to `final`, the outcome to `tie`, and pays $0.50 per contract.

[Back to Main README](../README.md)
