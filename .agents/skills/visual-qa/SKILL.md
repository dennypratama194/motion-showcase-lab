---
name: visual-qa
description: Audit static website screenshots and implementation for visual quality, UX clarity, responsiveness and generic AI patterns.
---
# Static visual QA
1. Read `standards/quality-gates.md` and `standards/anti-ai-slop.md`.
2. Run build and relevant branch-local tests, reporting actual outcomes.
3. Capture still screenshots at 1440×900, 768×1024, 390×844 via Playwright/browser screenshot only. Never use the video capture script.
4. Review hero, content hierarchy, imagery, typography, nav, footer, responsive crops, contrast and generic patterns.
5. Compare creative matrix and existing brands for similar compositions.
6. Report scored categories with evidence, actionable prioritized fixes and remaining limitations.
7. Iterate and request design approval; never infer approval from passing tests.
Output: screenshots, QA report, fix list; video NOT REQUESTED.
