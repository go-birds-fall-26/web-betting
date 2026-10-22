# CS375 Final Project Instructions (Fall 2026-27)

> Source: https://www.cs.drexel.edu/~nkl43/cs375/project/ (PDF print-out captured 10/22/26).
> Converted to Markdown as context for Claude Code. Linked sub-pages (proposal, progress report, contract review, individual reflection instructions) are NOT included here; the project demo instructions are on Canvas.

## Related instruction pages (not included)

- Proposal instructions
- Progress report instructions
- Project demo: see Canvas
- Contract review instructions
- Individual reflection instructions

## Overview

For your final project, you'll work in groups of 2-5 to develop a full-stack web application.

> Group members can only be from different sections if all members can pick a time slot where they're all available for their weekly in-person check-in.

### Requirements

Your project must:

- Be written in HTML, CSS, and JS
  - No front-end frameworks like React, Angular, or Vue are permitted, though libraries like jQuery are allowed
- Have a Node.js back-end
- Have some kind of interactive front-end with client-side JS
- Be deployed to the public internet; you may use the free tier of a platform-as-a-service site like Render to do so easily, or rent your own AWS server and domain name and deploy it manually

**Your project must have a large enough scope so that you'll need all remaining weeks of the term and all group members to complete it.** It should demonstrate that you've learned some of the key topics in this course, like how to use a database or 3rd party APIs; or, use a technology called WebSockets which allows real-time, bi-directional communication between clients and servers (useful for multiplayer games).

### Examples of past projects

- eCommerce site, sellers can post products, buyers can search for products, add products to a cart, and make "purchases" using Stripe's API
- GitHub pull request clone, can upload code to site, others can add comments inline, instant message room for live feedback
- "Guess that song" game site, plays snippet of songs drawn from user's Spotify history, must guess from multiple choice quiz
- skribbl.io clone
- Multiplayer Snake battle-royale, if game is already ongoing can spectate, otherwise get assigned a snake, as time goes on field of play shrinks until one snake left, then game restarts
- Recipes site, can search and favorite recipes drawn from API, can add your own recipes, can share with specific circle of friends
- Social media site, can make posts about artists or songs from Spotify's catalog, can like other people's posts and follow people, shows feed of newest posts from people you're following
- 2-player typing practice game, generates random words/sentences that users race to time, penalties for inaccuracy
- Stock market simulator where users could "purchase" stocks and see how much money they would've made or lost over time using data from a Stock API

### Caveats/restrictions

- If you choose a multiplayer game project, you must have no more than 3 people in your group. Experience has taught me that there's not enough work for more than 3 people, since the WebSockets server code tends to bottleneck the group for at least a few weeks.
  - Additionally, the game can't be too simple. Connect Four, checkers, and even chess won't give you enough to do. 2 player games with perfect information and simple rules are generally not a good fit. A better choice would be a more complicated two player game like Stratego (which has hidden information and more complicated game logic), or multiplayer games with rotating roles and more complex UI interactions like skribbl.io.
- No todo apps or calendar apps. They're boring and there's too much sample code for them on the internet.
- If you're using an API, make sure that API you choose has a free tier with enough data that isn't too rate-limited (unless you're willing to pay). Stock APIs in particular tend to be more expensive and have a more restrictive free tier, so research carefully before you commit.
- If your project uses API(s), you need to do something more than just display the API's information in a nice format and/or let the users search for specific information — your project can't just be a front-end for the API, as this won't be enough work.
  - A good example of an API project with enough work is a travel planner: you need to integrate multiple APIs (flights, hotels, local events/restaurants, etc.), present options to the user for comparison based on their search queries, and allow the user to save which options they'd like to make a complete trip plan. A project that only allowed the user to search a list of flights and/or hotels wouldn't be sufficiently complicated.
  - A *bad* example of an API project is a playlist creator that uses the Spotify API. Since you're only using one API, merely re-creating Spotify's basic UI features (which are already fairly simple), and you'd barely need to store any data of your own (since you'd be using Spotify's data stores), this isn't suitable for a final project.
- Recommendation engines are not a good core feature. To make a good recommendation engine, you typically need to train a machine learning model on a large dataset, which is both difficult to acquire and out of scope for this course.
- Synthetic text generation tools like ChatGPT are often not a good addition to a project. The problem is that it's difficult (and perhaps impossible) to make guarantees on the kind of text they output. For example, one past group tried to make a recipe site that used ChatGPT to generate recipes in a JSON format, but found that a) they couldn't get ChatGPT to reliably output valid JSON, and b) the recipes generated sometimes didn't use the ingredients they asked it to use, were nonsensical, or would be dangerous to consume. Of course, there are some circumstances where this might be acceptable (for example, using an LLM to generate text that's intended to be the beginning of a fictional story).

### Polish and contribution

This is not a course on visual design, but all projects should have at least a little polish in their look and feel; the site shouldn't look like a bare-bones browser-default Times New Roman text site. You can write CSS yourself or use UX libraries like Bootstrap or Tailwind CSS to achieve this.

**All group members are required to write JS (*not* just HTML/CSS) for the project.** A group member cannot only be in charge of visual design. Each week, you'll submit a progress report and we'll look over your commit history to verify you're on track and contributing equally.

## LLM usage

Each group will set their own LLM usage policy when they create their contracts. As one of the key goals of this course is developing a deeper understanding of web development, pure vibecoding without any sort of code review is discouraged. Other than that, groups are allowed to decide whether they use LLMs for code generation (and what kinds of code should or shouldn't be generated), test generation, code review, or not at all.

LLM tools, when used effectively, can greatly accelerate development. Thus, **if a group agrees to use LLMs heavily, our standards for the project will be higher.** We'll expect more features, more complexity, and better quality of code, UI, security, and performance.

When deciding whether and how to use LLMs, you should consider what your learning and outcome goals are for this project. Do you want to master a certain technology (e.g. WebSockets), learn how to approach "blank slate" projects from scratch, or get better at programming generally? Do you want to create a project that actually solves a problem you (or someone you know) cares about, or is impressive to potential employers in a specific way? Your group should consider what you want to get out of your project experience and how LLMs can help (or not help) you achieve that.

## Class structure

- At the end of week 4, you'll select your group mates and begin thinking of project ideas. We'll divide the groups into two halves — one half will come to the first class each week, and the other half will come to the second class each week.
- From week 5 onward, there will be no new readings, labs, or homeworks. Class time will be used exclusively for contract design (week 5)/check-ins (week 6+), and **groups only need to come to class during their assigned check-in day**. All group members are expected to attend their assigned day in person, and if someone can't make it to class, they should email their instructor in advance (or attend remotely, if possible).
- During your week 5 class meeting, your group and instructor will write your project contract together. The contract is the checklist of features you agree to implement by the end of term. Your instructor will email this contract to you, and you'll submit it to Canvas to confirm that you read and agreed to it.
- Week 6 onwards, you'll work on your project.
  - Each week, your entire group should come to your assigned weekly class to have an in-person check-in. This is to give us a chance to give you feedback and see how on track you are, and to give you a chance to ask us for advice and help.
  - At the end of each week, your group as a whole will submit a progress report briefly describing the work each group member did and what your plans are for next week. We'll review your commit history to see your contributions. This is to keep you on track so that you don't save everything for finals week.
- In finals week, your group will demo your project live to the class during our final exam timeslot. The class will vote on the best project, and the group who wins will receive some chocolate.
- After the demo day, your group as a whole will submit a contract review re-stating your original contract and marking which features you completed or didn't complete. If there are features you didn't complete, you'll briefly explain why you didn't get to them. If there's a significant number of planned features missing, your group may be penalized. This is to give your instructors a chance to grade your work/contributions as a whole.
- Additionally, each group member will individually submit a reflection to reflect on what went well and what could've been improved about the process of working on the project as a whole.

## Timeline/deliverables

Nothing will be due week 10 as that's when we have Thanksgiving break, and all of our class meetings will be cancelled that week. If you do any work over that week, include it in the next week's progress report.

- End of week 4: Group selection
- Week 5: Contract, project setup
- Weeks 6, 7, 8, 9, ~~10~~, 11: Progress report
- Weeks 6, 7, 8, 9, ~~10~~, 11: In-person check-in
- Finals week: Demo, contract review, individual reflection

(Week 10 is struck through on the original page because of Thanksgiving break.)

## Grading

All assignments will be submitted as a group except the individual reflection.

You'll receive full credit for the check-in as long as you come to class (or message me in advance if you have to miss that week).

Individual progress report grades will be penalized if you contributed significantly less that week. The lowest progress report grade will be dropped.

| Component | Points |
| --- | --- |
| Proposal | 5 points |
| Progress reports | 25 points (5 reports * 5 points each) |
| Check-ins | 25 points (5 check-ins * 5 points each) |
| Demo | 10 points |
| Contract review | 30 points |
| Individual reflection | 5 points |

## Advice

- The best groups have the best communication. Use class time to check in with all of your group members. Make sure you have some kind of way to see what everyone's currently working on so no one duplicates work.
- Try to coordinate work so multiple people aren't working on the same file, so you can avoid merge conflicts.
- Pair program to complete core features to minimize the amount of time others spend waiting for you to finish implementing so they can begin their work. Remove as many bottlenecks as possible.
- Prioritize working on core features first. Focus on styling last.
- Push and merge your code early and often. You don't want to put off dealing with merge conflicts. The sooner you
  <!-- The original page's text is cut off here in the PDF print-out. -->
- Set up your `package.json` and add helper scripts so you can get your project running using only a few commands.
