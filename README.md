# web-betting

CS 375 Group Project | Fall '26

A mock prediction market for NFL games, in the spirit of [Kalshi](https://kalshi.com). Users sign up, load their account with fake money, and buy Yes or No contracts on questions about real NFL games (for example, "Team X wins game Y"). When the real game finishes, the app checks the result against ESPN's data and settles every bet. No real money is ever involved.

> **Status:** in development. Wallet balances, Stripe test deposits, the ESPN settlement check, and the games/markets/bets data model are in. The Markets page's game and team dropdowns are in. Bet placement, pricing, and login are in progress. See [docs/MARKETS.md](docs/MARKETS.md) for the Markets page plan.
>
> **Deadlines:** every [contract](#contract) feature done by **Sat Dec 5, 11:59 PM**. Finals week is buffer only: polish done by **Thu Dec 10**, demo in our final exam slot on **Fri Dec 11** (morning). See the [roadmap](docs/ROADMAP.md) for who's doing what each week.

## Getting started

```bash
npm install
cp .env.example .env   # then edit values as needed
createdb web_betting   # once; use whatever DB_NAME you set in .env
npm run seed           # seed db
npm run seed:reset     # reset & seed db
npm run dev            # dev mode (live-reloads server using nodemon)
npm run dev:stripe     # dev mode plus the Stripe CLI webhook listener
npm run start          # run without nodemon
```

Stripe deposits are optional. See the [Stripe Setup Guide](docs/STRIPE.md) for setup and the test card to use.

## Terminology

- **Game:** a real NFL game. (The database table is still named `events`.)
- **Market:** a Yes/No question about a game, e.g. "Will the Giants beat the Commanders?" A game can have many markets.
- **Default market:** every game has one "home team wins" market, created automatically when the game enters our system. Yes means the home team (`home_team_id`) wins. ESPN designates a home team even for neutral-site games (e.g. the Madrid and Munich games), so every game has one.
- **Bet:** a purchase of contracts in a market, e.g. 50 Yes contracts at 35¢, or 10 No contracts at 80¢. A market can have many bets.

## What it does

- **Accounts:** sign up, log in, and keep a balance. Until login exists, `DEV_USER_ID` in `.env` acts as the logged-in user.
- **Fake money:** deposits go through the [Stripe](https://stripe.com/docs/testing) API in test mode, so users can add "paper money" without any real banking. Withdrawals are mocked: they only decrement the user's balance. Bets are paid for from this balance, and winnings are paid back into it.
- **Markets:** users pick a game and a bet template ("I want to bet on game X for outcome Y"). The default bet, "Team X wins game Y," is built first. Users can pick either team: the app maps that choice onto the game's one [default market](#terminology) (picking the home team buys Yes, picking the away team buys No). Bets fall into three kinds:
  - **Match:** stats across both teams, e.g. total points scored in the game.
  - **Team:** one team's stats, e.g. this team scores N points.
  - **Player:** one player's stats, e.g. this player scores N touchdowns. For now, users can only bet on each team's passing, rushing, and receiving leaders as listed in ESPN's response.

  Number bets (team points, player stats) are **over/under on a single number**, e.g. "Commanders score over 14 points," not ranges. They're part of the contract and come after the default bet. Every market must be settleable automatically from ESPN's data.
- **The house:** the app is the counterparty to every contract. Users can cash out before the game ends by selling their contracts back to the house (a [stretch goal](#stretch-goals)).
- **Pricing:** the house does not set odds. Prices are driven by how many Yes and No contracts users have bought (see [How prices work](#how-prices-work)).
- **Search and history:** users can search for games and see every bet they've placed, won, and lost.
- **Settlement:** a scheduled check (`node-cron`, every 5 minutes by default via `DEFAULT_CRON`) asks ESPN whether each game is still active. If it is, nothing happens. If it's over, the app closes its markets and pays the winners. The same check also runs whenever someone tries to place a bet, so no one can bet on a game that has ended.

## How prices work

A market's price comes from how many Yes and No contracts have been bought in it:

```
Yes price = (Y + k) / (Y + N + 2k)
No price  = 1 − Yes price
```

- `Y` = Yes contracts bought so far
- `N` = No contracts bought so far
- `k` = a constant that acts as virtual starting demand on each side, so a few early purchases can't push the price to $0 or $1. We're using `k = 10` for now; the value is subject to change, but this formula is what we're building.

With `k = 10`:

| Yes bought | No bought | Yes price | No price |
| ---------: | --------: | --------: | -------: |
| 0 | 0 | $0.50 | $0.50 |
| 30 | 10 | $0.67 | $0.33 |
| 10 | 30 | $0.33 | $0.67 |
| 80 | 20 | $0.75 | $0.25 |
| 50 | 50 | $0.50 | $0.50 |

- Buying Yes pushes the price of Yes up; buying No pushes it down.
- Prices are kept between $0.01 and $0.99, even at very lopsided volume.
- An order fills entirely at the current price, and the price is recalculated once after the order.

## How a bet pays out

- Every contract resolves to **$1.00** if it wins and **$0** if it loses. If you lose, the money you put in is gone.
- Your payout depends on the price you paid when you bought, not on where the price goes afterward. Example: you buy 2 Yes contracts at 50¢ ($1.00 total). If Yes wins, you get $2.00 back, a $1.00 profit. If more people buy Yes after you, the price of Yes rises, so your contracts are worth more if you cash out early.
- After you buy, the market price can go up, go down, or stay the same. If it goes down, you can either cash out now at the current price (taking a loss) or hold until the market resolves to $0 or $1.
- **Cash-out price** ([stretch goal](#stretch-goals)): the house pays the current market price, minus a fee.
- **Fees:** a fee is charged when buying and when cashing out. No fee is taken when a contract is held until it resolves. The formula is modeled on Kalshi's trading fee:

  `fee = ceil(0.07 × C × P × (1 − P))`

  - `ceil` rounds up to the nearest cent (e.g. $0.0175 → $0.02)
  - `C` = number of contracts being bought or sold
  - `P` = contract price in dollars
  - `0.07` = fee rate (subject to change)

  So buying does `balance -= C × P + fee(C, P)`, and cashing out does `balance += C × P − fee(C, P)`. Example: buy 10 Yes at $0.50 and pay $5.18 ($5.00 + $0.18 fee). If the price rises to $0.70 and you cash out, you get $6.85 ($7.00 − $0.15 fee), a $1.67 profit. If you hold and Yes wins, you get $10.00 with no fee, a $4.82 profit.
- **Ties:** if a game ends in a tie, the market resolves at $0.50 for both Yes and No.
- **Cancelled games:** all contracts are voided and users get their purchase price back. Fees already paid are kept.
- **When markets open:** games are available at least two NFL weeks ahead. Once NFL week 10 starts, weeks 11 and 12 are open; once week 11 starts, week 13 is pulled in.
- **When markets close:** betting stays open while a game is live and closes once the game is final.

## Scope

- **Prediction market, not a sportsbook.** Yes/No contracts, with prices driven by user volume. We are not building a sportsbook that sets odds, and we dropped the earlier idea of comparing odds across real sportsbooks.
- **NFL only.** Football is the only sport, and the NFL is the only league users can bet on. Other sports or leagues may come later but aren't a current concern.
- **Verifiable markets only.** Only markets that can be settled with data from ESPN's API are allowed. ESPN's API is unofficial and undocumented, so it could change without notice.
- **Fake money only.** Stripe test mode for deposits, a mock for withdrawals.

## Tech stack

- Node.js and [Express](https://expressjs.com/) 5
- [EJS](https://ejs.co/) for server-rendered pages
- PostgreSQL through [`pg`](https://node-postgres.com/)
- [`node-cron`](https://www.npmjs.com/package/node-cron) for the settlement check
- [Stripe](https://docs.stripe.com/testing) in test mode for deposits
- Money is stored and calculated in **integer cents** (the `*_cents` columns, `src/utils/money.js`), never floating-point dollars. Prices are whole cents from 1 to 99.
- Vanilla HTML, CSS, and client-side JavaScript. The course does not allow front-end frameworks like React, Angular, or Vue.
- Deployed to the public internet (host chosen in week 11)

Planned:

- **Login:** the login form POSTs a JSON body; the server responds 200 on a match and 403 otherwise. Passwords are hashed with [argon2](https://www.npmjs.com/package/argon2) and never stored in plaintext. A logged-in user gets a cookie holding a token, and the server keeps issued tokens in a `token_store` table linked to `users`.
- **Testing:** the real ESPN API is awkward to test against, so we'll save sample responses and serve them from a fake version of the API.
- **Environments:** branch on `process.env.NODE_ENV === "production"`, with a `package.json` script that sets `NODE_ENV` before starting.

## Contract

The feature checklist we agreed on with our instructor. It's what the project is graded against, and it can still change.

- [ ] Deployment
- [ ] User accounts
- [ ] Users can create bets, select from hardcoded set of events (e.g. player X gets Y touchdowns in game Z)
  - [ ] Events should be verifiable automatically via some sports API
  - [ ] Can create more sophisticated events (e.g. between 5-9 touchdowns)
  - [ ] Some way of calculating price (ala prediction markets, based on other peoples' bets) or calculating odds (ala some formula)
  - [ ] Some way of knowing when bet is over and awarding winners
- [x] Users can add $ to account which is spent when they place bets and deposited into when they win, uses Stripe API
- [ ] Users can search for bets, and see all bets they've created/placed/won/lost
- [x] LLM: Minimal LLM usage, mainly on planning/debugging, line-by-line codegen/autocomplete but not generating a whole file, test generation

We plan to meet "more sophisticated events" with over/under bets on team points and player stats (see [What it does](#what-it-does)).

## Open questions

The team is still deciding the following. Treat them as unresolved, not as assumptions to build on.

- **Player storage:** where player data lives in the database (see [docs/MARKETS.md](docs/MARKETS.md)). Settled as part of the work that stores team leaders.
- **Hosting:** which provider we deploy to. Decided in week 11 (Nov 29 – Dec 5).
- **Landing exactly on the number:** what happens to an over/under bet when the result equals the number (e.g. "Commanders over 14 points" and they score exactly 14)? Options include half numbers like 14.5 so it can't happen, or a rule for that case. Needed before over/under bets settle ([#30](https://github.com/go-birds-fall-26/web-betting/issues/30)).

## Stretch goals

Not in the contract. Build these only once the contract features work:

- **Cash-out:** selling contracts back to the house before the game ends, with the fee described in [How a bet pays out](#how-a-bet-pays-out).
- **Synthetic activity:** seeding the database and simulating other users with generated data (e.g. Faker.js) so the market has traffic and prices move.

## Deferred

Ideas we've agreed to come back to after basic functionality works:

- **Injury deadlines:** what's the latest point at which teams must declare injuries? This would tell us which players are confirmed to play, and so which players users can bet on. For now, player bets are limited to the passing, rushing, and receiving leaders in ESPN's response.
- **Price movement during a fill:** in a real market, a large order consumes the cheapest contracts first, so the price rises as it fills. Our orders fill at one price for now.
- **User-to-user trading:** letting users sell contracts to each other instead of only to the house.
- **Prices during live games:** prices only move when users buy, so late in a lopsided game a market can still sit near 50¢ even though the result is nearly certain. Known limitation, not a bug.

## LLM usage

Our group uses LLMs minimally: brainstorming and research, and autofill for syntax in languages some of us are less familiar with (JavaScript is new for some members). We do not use LLMs to generate whole files. The full LLM policy for our group is in [AGENTS.md](AGENTS.md).

## Team

| Name | GitHub | Git author names |
|---|---|---|
| Abdul Chaudhry | [@Abdulc123](https://github.com/Abdulc123) | Abdul Chaudhry |
| Alex Sparks-Bakota | [@alexsparksbakota](https://github.com/alexsparksbakota) | Alex Sparks-Bakota |
| Evan Trinh | [@evantrinh](https://github.com/evantrinh) | Evan T., Evan Trinh |
| Kennan Lu | [@kennanLu](https://github.com/kennanLu) | kennanLu |
| Nicolas Plaia | [@nicolasplaia](https://github.com/nicolasplaia) | Nicolas Plaia |
| Ryan Fitzpatrick | [@rfitzpatrick517](https://github.com/rfitzpatrick517) | Ryan Fitzpatrick, rfitzpatrick517 |

Each progress report lists who's behind every git author name. To see them all: `git log --all --format='%an' | sort -u`.

## Course context

This is the final project for CS 375 (Web Development) at Drexel University, built by a group of six. The course requires a full-stack web app with a Node.js back-end, an interactive client-side JS front-end, and a deployment to the public internet. See [instructions.md](instructions.md) for the full assignment.
