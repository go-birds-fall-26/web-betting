# AGENTS.md

Instructions for AI coding assistants and chatbots working in this repo. This file is shared by everyone on the team, whatever tool they use. Humans should read it too.

## Project

`web-betting` is a mock prediction market for NFL games, built by a group of six for CS 375 (Web Development, Drexel, Fall '26). Read [README.md](README.md) for what the app does, its scope, and the list of **open questions**. Read [instructions.md](instructions.md) for the course requirements.

The core design is decided: Yes/No contracts, the app as the house, ESPN as the data source, Stripe for deposits and a mocked withdrawal. Build on those decisions and don't reopen them. Some questions are still open (pricing, payoff, cash-out price, the feature list). See the README's open questions section. When a user's question depends on one of them, **don't pick an answer for the team.** Lay out the options and trade-offs, and say which open question it touches.

## Stack and constraints

- Node.js with Express 5, EJS views, PostgreSQL through `pg`.
- Front end is **vanilla HTML, CSS, and JavaScript**. The course forbids front-end frameworks (React, Angular, Vue). jQuery and CSS libraries (Bootstrap, Tailwind) are allowed. Don't suggest a framework.
- Money is fake: Stripe **test mode** only, for deposits. Withdrawals are mocked and just decrement the balance. Never use or ask for live Stripe keys.
- Secrets live in `.env`, which is git-ignored. Update `.env.example` (names only, no values) when adding a variable. Never put real keys in code, commits, or chat.

Layout: `src/server.js` (server entry), `views/` (EJS templates), `public/` (static files, `public/css/`).

```bash
npm install
npm run dev     # nodemon, live reload
npm run start
```

## LLM usage policy

Our group agreed to **minimal LLM usage**. The course allows heavier use but raises its expectations accordingly, and we chose to stay light because the point is to learn web development, and JavaScript is new for some of us. Every member must write JavaScript for the project, and contributions are checked through commit history.

### Fine to do

- **Ideation and research.** Explain how prediction markets work, compare designs, weigh sports APIs, help plan features.
- **Debugging help.** Explain error messages, find likely causes, suggest what to check.
- **Syntax help.** Answer "how do I write X in JavaScript/SQL/EJS" and similar, especially for languages the person is less familiar with.
- **Small code assists.** Line-by-line completions and short snippets (a single function or a few lines) that the person then reads, understands, and adapts.
- **Test case ideation.** Suggest which cases and edge cases to test.
- **Test data.** Seed data, fixtures, and sample records, e.g. with Faker.js. A human reviews it before it's committed.

### Not okay

- **Generating whole files, whole features, or large chunks of the app.** If asked to, don't. Offer an outline, pseudocode, or the first small step instead, and let the person write the rest.
- **Writing a teammate's assigned work for them.** The goal is that each person understands and owns the code they commit.
- **Code nobody will review.** Never present code as ready to paste without explaining what it does.

### How assistants should behave

- Prefer explaining over producing code. When code is needed, keep it short and explain the non-obvious parts.
- If a request would need more than a small snippet, say so and break it into steps the person can write.
- Don't edit files unless the person explicitly asks. Even then, keep edits small and tell them what changed.
- Don't make up facts about APIs, Stripe, or sports data. If unsure, say so and point to the official docs. The team has checked that ESPN's API can settle our events, but it is unofficial and undocumented, so treat its response shapes as unstable and verify them against a real response before relying on them.
- Cite sources when explaining prediction market mechanics or API behavior.
- Keep [README.md](README.md) accurate: when a question gets settled, say that the README's open questions section needs updating.

## Docs

- `README.md`: high-level project summary. Keep it short and current.
- `instructions.md`: course assignment text, converted from the course site. Treat it as reference, not as something to edit.
