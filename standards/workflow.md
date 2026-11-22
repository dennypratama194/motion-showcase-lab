# Brand production workflow

## Branching
Existing brand branches are intentional: `main` is ATELIER and `serein-pilates` is Serein. New concepts belong on distinct `brand/<slug>` branches or in a user-approved multi-brand architecture. Never silently replace these projects, cherry-pick unrelated implementation or merge a brand into another.
The standards can be incorporated through a separately reviewed PR; once merged into main, merge/cherry-pick standards into any brand branch as explicitly requested.

## Sequence
1. Create `brands/<slug>/brief.md` by copying the template. Mark concept fictional as appropriate.
2. Review `brands/creative-matrix.md`. Specify at least three differentiating creative traits.
3. Build in a new branch. Preserve technical functionality. Favor deliberate page flows over quantity of sections.
4. Run build/test. Capture only still screenshots for QA, then create report.
5. Present screenshots and targeted iteration plan. Wait for user's design approval before describing a project as approved.
6. Only when the user expressly requests animation/video, use the showcase-export skill and existing capture tools.

## Commands (current main branch)
- `npm ci`: install dependencies (Node 24 per existing README)
- `npm run dev`: development server
- `npm run build`: production build
- `npm test`: Playwright tests
- `npm run capture`: **video capture/export; forbidden without explicit video request**

Always inspect the active branch's scripts and tests before running: ATELIER test naming does not necessarily match Serein. For static screenshots use the browser / Playwright screenshot API, not `npm run capture`.

## Handoff
Report branch, commit, screenshots, tests actually run, visual issues, approvals outstanding. Never deploy, publish, or auto-export reels. 
