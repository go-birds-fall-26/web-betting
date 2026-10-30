# web-betting

CS 375 Group Project | Fall '26

A mock prediction market for NFL games, in the spirit of [Kalshi](https://kalshi.com). Users sign up, load their account with fake money, and bet on the outcomes of real NFL events (for example, "Player X scores Y touchdowns in Game Z"). When the real game finishes, the app checks the result against a sports API and pays out the winners. No real money is ever involved.

> **Status:** early development. The repo is a scaffold and the design is still being worked out. See [Open questions](#open-questions) for what hasn't been decided yet.

## What it does

- **Accounts:** sign up, log in, and keep a balance.
- **Fake money:** deposits and withdrawals go through [Stripe](https://stripe.com/docs/testing) in test mode, so users can add and remove "paper money" without any real banking. Bets are paid for from this balance, and winnings are paid back into it.
- **Events:** users pick from a hardcoded set of NFL events. Events must be verifiable automatically through a sports API. They can be simple (a player scores 2 touchdowns) or more sophisticated (a player scores between 5 and 9 touchdowns).
- **Betting:** users can create and place bets on events. The price or odds of a bet come either from what other users have bet (as in a prediction market) or from a formula. Which one is undecided.
- **Search and history:** users can search for bets and see every bet they've created, placed, won, and lost.
- **Settlement:** the server finds out when an event is over (a scheduled job, e.g. a cron job or `setInterval`, checking a sports API), decides the outcome, and pays the winners.
- **Synthetic activity:** a prediction market needs traffic to be interesting, so we plan to seed the database and simulate other users with generated data (e.g. Faker.js).

## Scope

- **NFL only.** Football is the only sport, and the NFL is the only league users can bet on. Other sports or leagues may come later but aren't a current concern.
- **Fake money only.** Stripe test mode is used for "paper money".
- **Event data:** ESPN's unofficial API is a candidate for game and player data, but nobody has confirmed it covers what we need to settle bets.

## Tech stack

Current scaffold:

- Node.js and [Express](https://expressjs.com/) 5
- [EJS](https://ejs.co/) for server-rendered pages
- PostgreSQL through [`pg`](https://node-postgres.com/)
- Vanilla HTML, CSS, and client-side JavaScript. The course does not allow front-end frameworks like React, Angular, or Vue.
- Deployed to the public internet (host not chosen yet)

## Getting started

```bash
npm install
cp .env.example .env   # then edit values as needed
npm run dev            # dev mode (live-reloads server using nodemon)
npm run start

createdb web_betting   # or whatever you set your db name to be
npm run seed           # seed db
```

## Open questions

The team is still deciding the following. Treat them as unresolved, not as assumptions to build on.

- **Market type:** Kalshi-style contracts (users buy Yes/No shares priced between 1¢ and 99¢, each paying $1 if it resolves true), traditional sportsbook odds calculated by the backend, or some mix of both.
- **Counterparty:** who takes the other side of a bet. It could be other users (an order book), an automated pricing formula with the app as the house, or simulated user traffic.
- **Market creation:** whether the team hardcodes every event and users only take positions, or users can compose their own bets from templates (player, stat, threshold).
- **Sportsbook price comparison:** an earlier idea was to compare odds across real sportsbooks. It's unclear whether that is still in scope.
- **Event data source:** whether ESPN's unofficial API (or another free one) gives enough detail, such as player stats, to settle bets automatically.
- **Stripe withdrawals:** test-mode deposits are straightforward, but how to simulate withdrawals is not worked out yet.
- **Feature list:** the course contract is still being refined. A formal feature list will be added when it exists.

## LLM usage

Our group uses LLMs minimally: brainstorming and research, and autofill for syntax in languages some of us are less familiar with (JavaScript is new for some members). We do not use LLMs to generate whole files. The full LLM policy for our group is in `AGENTS.md`.

## Course context

This is the final project for CS 375 (Web Development) at Drexel University, built by a group of six. The course requires a full-stack web app with a Node.js back-end, an interactive client-side JS front-end, and a deployment to the public internet. See `instructions.md` for the full assignment.
