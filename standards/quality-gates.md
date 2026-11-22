# Quality gates: objective checks and human judgment

## Gate A — Creative brief
- [ ] Audience, business type and intended action specified
- [ ] Differentiated concept, tone and visual reference articulated
- [ ] Asset plan with rights/provenance
- [ ] Explicit comparison with existing brand directions
- [ ] Fictional work and unverified claims labeled honestly

## Gate B — Implementation
- [ ] Existing scripts inspected; dependencies installed only as needed
- [ ] Production build actually completes
- [ ] Applicable Playwright tests actually run
- [ ] Links/actions, keyboard and mobile navigation checked
- [ ] Reduced motion, semantic structure and image alt handling reviewed
- [ ] No obvious broken assets or uncontrolled overflow

## Gate C — Static visual review
- [ ] Capture 1440×900, 768×1024, 390×844 screenshots
- [ ] Check hero, navigation, signature section, footer, mobile imagery/crops
- [ ] Check typographic wrapping, contrast, alignment, image art direction
- [ ] Check editorial rhythm and repetitive component patterns
- [ ] Compare with existing showcased brands for obvious cloning
- [ ] Run anti-generic scoring per `anti-ai-slop.md`, with evidence
- [ ] Record concrete fix items, owner and outcome

## Gate D — Approval
- [ ] Present static screenshots and known limitations
- [ ] No claim that a visual design has been approved unless user approves
- [ ] Refine until explicit design approval

## Gate E — Optional showcase export
**Not part of Gate A–D.** Only on explicit user request:
- [ ] Confirm requested assets and target dimensions
- [ ] Run capture/render with known working local URL and correct branch
- [ ] Verify output actually exists and playback/frame quality
- [ ] Do not fabricate recognitions or client results

## QA report template
```markdown
# <brand> — QA review
Branch / commit:
Build: PASS|FAIL|NOT RUN (command/evidence)
Tests: PASS|FAIL|NOT RUN (command/evidence)
Screenshots: desktop / tablet / mobile (paths or links)
A11y/responsive findings:
Visual review (1–5 per category, with screenshot evidence):
- Identity:
- Imagery:
- Typography:
- Composition:
- UX:
- Responsive craft:
Top fixes: [priority, location, observation, action]
Creative differentiation from existing brands:
Approval: awaiting user | approved
Video: NOT REQUESTED (default)
```

Do not mark a gate PASS based solely on writing a checklist. If tools are unavailable, report NOT RUN and how to verify.
