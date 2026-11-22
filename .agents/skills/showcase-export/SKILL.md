---
name: showcase-export
description: Produce Dribbble-ready stills or Remotion video only when the user explicitly requests final showcase assets.
---
# Explicit-request showcase export
**Entry gate:** Only run when the user explicitly asks for final assets, animation or video. For a still-only request, DO NOT render video.
1. Confirm design is approved or clarify if user knowingly wants an in-progress presentation.
2. Inspect active branch, render scripts and available outputs. The existing `npm run capture` is a video export, NOT the static screenshot workflow.
3. Use real site capture, not invented screens. Do not make fake awards, client claims or recognition.
4. For requested Dribbble stills, compose from verified static screenshots with proper dimensions, quality and licensing.
5. For explicitly requested reel, plan shots/timing, reduced-motion handling, execute Remotion capture/render and verify real MP4 playback, frames and corresponding cover.
6. Report exactly what generated, files and outstanding issues.
Never run video on a new-brand or revision request without direct authorization.
