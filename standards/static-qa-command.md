# Static QA command

With the target site's development or production server already running:

```bash
npm run review:static
```

For an alternate port:

```bash
SHOWCASE_URL=http://localhost:3001 npm run review:static
```

PowerShell:

```powershell
$env:SHOWCASE_URL = 'http://localhost:3001'
npm run review:static
```

Generates full-page desktop (1440×900), tablet (768×1024), and mobile (390×844) **PNG screenshots** plus `artifacts/static-qa/report.json`. Checks overflow, broken images, image alt presence, h1 count, unlabeled links and browser exceptions. Exits nonzero on detected issues.

This is a basic technical smoke check, not an accessibility audit or a guarantee of premium aesthetics. Inspect the screenshots manually using `standards/quality-gates.md`. It deliberately never invokes `npm run capture`, Remotion, or video rendering. `CHROMIUM_PATH` is supported for a system browser. Override `STATIC_QA_OUTPUT` to move generated files.
