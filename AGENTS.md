# AGENTS.md

Instructions for AI coding assistants and chatbots working in this repo. This file is shared by everyone on the team, whatever tool they use. Humans should read it too.

## Project context lives in the README

[README.md](README.md) is the single source of truth for the project: what the app does, terminology (game → market → bet), how bets pay out, scope, tech stack, **open questions**, and **deferred** ideas. Read it before answering any question about the project's design or status, and don't repeat or contradict it here. [instructions.md](instructions.md) has the course requirements.

- Build on the decisions in the README and don't reopen them.
- When a question depends on something in the README's open questions or deferred list, **don't pick an answer for the team.** Lay out the options and trade-offs, and say which question it touches.
- If the README looks out of date or contradicts the code or other docs, say so and suggest the fix rather than guessing which is right.

## Stack and constraints

- Front end is **vanilla HTML, CSS, and JavaScript**. The course forbids front-end frameworks (React, Angular, Vue). jQuery and CSS libraries (Bootstrap, Tailwind) are allowed. Don't suggest a framework.
- Money is fake: Stripe **test mode** only. Never use or ask for live Stripe keys.
- Secrets live in `.env`, which is git-ignored. Update `.env.example` (names only, no values) when adding a variable. Never put real keys in code, commits, or chat.

Layout: `server.js` (server entry, repo root), `src/` (`routes/`, `services/`, `db/`, `jobs/`, `errors/`, `utils/`), `views/` (EJS templates), `public/` (static files), `docs/` (feature docs such as `MARKETS.md` and `STRIPE.md`). Setup commands are in the README's Getting started section.

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

- Before suggesting what someone should work on, check [docs/ROADMAP.md](docs/ROADMAP.md) and the [Kanban board](https://github.com/orgs/go-birds-fall-26/projects/1). An issue assigned to someone else is theirs: don't suggest building it, and point the person to an unassigned issue instead.
- Prefer explaining over producing code. When code is needed, keep it short and explain the non-obvious parts.
- If a request would need more than a small snippet, say so and break it into steps the person can write.
- Don't edit files unless the person explicitly asks. Even then, keep edits small and tell them what changed.
- Don't make up facts about APIs, Stripe, or sports data. If unsure, say so and point to the official docs. ESPN's API is unofficial and undocumented, so treat its response shapes as unstable and verify them against a real response before relying on them.
- Cite sources when explaining prediction market mechanics or API behavior.
- Keep [README.md](README.md) accurate: when a question gets settled, say that the README's open questions or deferred list needs updating.

## Docs

- `README.md`: project summary and source of truth for design decisions. Keep it short and current.
- `docs/`: per-feature notes (e.g. `MARKETS.md`, `STRIPE.md`), plus `ROADMAP.md`, the weekly plan of who's doing what.
- `instructions.md`: course assignment text, converted from the course site. Treat it as reference, not as something to edit.
