# web-betting

CS 375 Group Project | Fall '26

A mock prediction market for NFL games, in the spirit of [Kalshi](https://kalshi.com). Users sign up, load their account with fake money, and buy Yes or No contracts on the outcomes of real NFL events (for example, "Player X scores a touchdown in Game Z"). When the real game finishes, the app checks the result against ESPN's data and settles every contract. No real money is ever involved.

> **Status:** early development. The repo is a scaffold. The core design is decided (see [Scope](#scope)); pricing and payoff are still being worked out (see [Open questions](#open-questions)).

## Getting started

```bash
npm install
cp .env.example .env   # then edit values as needed
npm run dev            # dev mode (live-reloads server using nodemon)
npm run start

createdb web_betting   # or whatever you set your db name to be
npm run seed           # seed db
npm run seed:reset     # reset & seed db
```

## What it does

- **Accounts:** sign up, log in, and keep a balance.
- **Fake money:** deposits go through the [Stripe](https://stripe.com/docs/testing) API in test mode, so users can add "paper money" without any real banking. Withdrawals are mocked: they only decrement the user's balance. Contracts are paid for from this balance, and winnings are paid back into it.
- **Events:** users select from a mix of hardcoded events and event templates, and can create events from those templates. Templates start simple (for example, "Team X wins" or "Player X scores") and may grow to more sophisticated events later (for example, a player scoring between 5 and 9 touchdowns). Every event must be verifiable automatically through ESPN's data.
- **Contracts:** on an event, a user bets **Yes** or **No** by buying a contract. If the user loses, the contract resolves to zero and the money they put in is gone.
- **The house:** the app is the counterparty to every contract. Users can cash out before the event ends by selling their contract back to the house. At the moment, selling contracts to other users is a nice-to-have, not part of the current plan.
- **Pricing:** the house does not set odds. A contract's price is determined by the volume of people buying contracts, so it moves as more users buy Yes or No. The exact formula is not worked out yet.
- **Search and history:** users can search for events and see every event they've created and every contract they've bought, won, and lost.
- **Settlement:** the server finds out when an event is over (a scheduled job, e.g. a cron job or `setInterval`, checking ESPN), decides the outcome, and pays the winners.
- **Synthetic activity:** a prediction market needs traffic to be interesting, so we plan to seed the database and simulate other users with generated data (e.g. Faker.js).

## Scope

- **Prediction market, not a sportsbook.** Yes/No contracts, with prices driven by user volume. We are not building a sportsbook that sets odds, and we dropped the earlier idea of comparing odds across real sportsbooks.
- **NFL only.** Football is the only sport, and the NFL is the only league users can bet on. Other sports or leagues may come later but aren't a current concern.
- **Verifiable events only.** Only events that can be settled with data from ESPN's API are allowed. The team has checked that this looks feasible. ESPN's API is unofficial, so it could change without notice.
- **Fake money only.** Stripe test mode for deposits, a mock for withdrawals.

## Tech stack

Current scaffold:

- Node.js and [Express](https://expressjs.com/) 5
- [EJS](https://ejs.co/) for server-rendered pages
- PostgreSQL through [`pg`](https://node-postgres.com/)
- Vanilla HTML, CSS, and client-side JavaScript. The course does not allow front-end frameworks like React, Angular, or Vue.
- Deployed to the public internet (host not chosen yet)

## Open questions

The team is still deciding the following. Treat them as unresolved, not as assumptions to build on. These will need to be addressed in future progress reports.

- **Price drops:** what happens when a contract's price goes down after someone buys it?
- **Payoff:** how is the payoff calculated? A worked example to answer: if I buy for 50¢, more people then agree and the price falls to 10¢, what do I get if I win?
- **Cash-out price:** what price does the house pay when a user sells a contract back before the event ends?
- **Feature list:** the course contract is still being refined. A formal feature list will be added when it exists.

## LLM usage

Our group uses LLMs minimally: brainstorming and research, and autofill for syntax in languages some of us are less familiar with (JavaScript is new for some members). We do not use LLMs to generate whole files. The full LLM policy for our group is in `AGENTS.md`.

## Course context

This is the final project for CS 375 (Web Development) at Drexel University, built by a group of six. The course requires a full-stack web app with a Node.js back-end, an interactive client-side JS front-end, and a deployment to the public internet. See `instructions.md` for the full assignment.
