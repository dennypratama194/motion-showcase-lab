<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Motion Showcase Lab — production policy

This repository is a portfolio production system for distinct, editorial-quality website concepts. Preserve the working branch's brand; never silently replace its identity with another brand.

## Mandatory production sequence
1. **Brief:** Read `standards/README.md`; create a brand-specific brief using `brands/BRIEF_TEMPLATE.md`. Research or substantiate any competitive claims.
2. **Direction:** Define an image plan, typography, palette, composition concept and explicit differentiation from existing brands BEFORE implementation.
3. **Build:** Create responsive, accessible, semantic, fast UI. Reuse engineering patterns, NOT visual templates.
4. **Review:** Build/test, capture STATIC screenshots, and produce a concrete visual QA report. Correct issues and present screenshots for design approval.
5. **Showcase:** ONLY on the user's explicit request, render/export video or other final presentation deliverables.

**Hard video gate:** Never invoke `npm run capture`, `scripts/capture.mjs`, Remotion rendering, MP4 output, or any video recording as part of normal design, tests, screenshots, or approval. Do not infer video permission from a new brand request, the repository name, or the availability of capture tooling. Ask only when the user specifically requests a reel but requirements are essential and missing. Static screenshots are permitted.

## Required references
- `standards/design-system.md`: adaptable layout, responsive and accessibility foundation
- `standards/anti-ai-slop.md`: predictable patterns to avoid and creative differentiation
- `standards/imagery.md`: photography/art direction and licensing
- `standards/quality-gates.md`: acceptance checklist and visual QA reporting
- `standards/workflow.md`: branch, review and handoff process
- `.agents/skills/*/SKILL.md`: focused procedures; apply relevant skill rather than loading all at once

## Guardrails
- 1440 reference desktop: 12-column grid, 100px outer margins, 24px gutters; adapt at smaller widths, do not rigidly impose desktop margins on mobile.
- 4/8px spacing base; use even-numbered measurements and 2px adjustments when necessary. Avoid arbitrary one-off values.
- No default purple-gradient, generic SaaS bento layouts, stock-looking images, repeated alternating card sections, or interchangeable brand art direction.
- Luxury, editorial, and minimal are NOT synonyms for low contrast or hidden functionality.
- Do not invent client outcomes, awards, testimonials, customer logos, or present fictional concepts as commissioned work.
- Prefer correct interactions and imagery over decorative animation. Respect reduced motion.
- Never auto-deploy, publish to Dribbble, or modify main/serein-pilates unless explicitly requested. Work on a dedicated brand/feature branch.
- Before editing code, check package scripts and branch-local instructions; Playwright test names may be brand-specific.
- Clearly distinguish automated pass/fail results from subjective design judgment.
