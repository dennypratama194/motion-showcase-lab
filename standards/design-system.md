# Responsive design and engineering foundation

## Reference canvas
- At a **1440px reference viewport**, use a 12-column grid, **100px outer margins**, and **24px gutters** as the default. Content area = 1240px; individual column width ≈ 81.33px.
- At tablet/mobile sizes, **recalculate** margins, columns and gutters. Suggested starting points: 768px / 8 columns / 32px margins / 16px gutters; 390px / 4 columns / 16px margins / 16px gutters. Adjust for content and test actual devices.
- Prefer CSS Grid/Flexbox and constraints over absolute positioning for content. Absolute placement can be intentional for art direction if resilient at tested sizes.
- A 4/8px spacing rhythm is default. 2px increments are allowed for necessary optical and typographic refinements; avoid random measurements and odd pixel sizes. Use responsive `clamp()` when justified.

## Typography
- Define roles: display, H1–H4, body, utility, caption, navigation. Use explicit font weights, line height and letter spacing, not a blanket font-size.
- Select type based on each brand's distinct personality, not a fixed Inter/serif combination. Check licensing and language coverage.
- Aim for legible measures (~45–75 characters for long body paragraphs) and contrast; intentional display overflows must not obscure meaning.
- Set optical size and wrapping for 1440, 768 and 390 screenshots.

## Tokens and components
- Define semantic colors, type roles, spacing, radii, borders, focus treatment and motion tokens per brand.
- Reuse technical primitives (navigation behavior, focus management, responsive image handling, accessible dialog) where useful.
- Do not reuse brand-specific hero composition, image rhythm or identical section sequencing without design justification.

## UX and accessibility
- Make the page purpose, navigation and primary next action understandable, without mandating a stereotypical CTA in every hero.
- Semantic landmarks, heading order, keyboard operations and visible focus states.
- Sufficient contrast for text and controls; inspect against WCAG AA where practicable.
- Honor `prefers-reduced-motion`. No autoplay audio, hover-only access or critical content hidden behind animation.
- Meaningful image alternative text; decorative images should use empty alt text.
- Optimized images with correct intrinsic dimensions and aspect ratios; avoid layout shifts.
- Every interactive-looking element must have a function or be visibly noninteractive.

## Responsive QA
- Test **1440 × 900**, **768 × 1024**, **390 × 844** as core screenshots; add 320px if navigation or dense composition is risky.
- Check no unwanted horizontal overflow; readable typography; safe image crops; tap targets; menu behavior; deliberate section rhythm.
- Passing automated tests does not certify aesthetic quality.
