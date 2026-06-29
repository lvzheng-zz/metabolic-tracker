---
name: metabolic-health-app-dev
description: Build and maintain local-first metabolic health, obesity, calorie, body-metric, and exercise-tracking web apps. Use when Codex is asked to edit this tracker, add food logging, body metrics, exercise crediting, trend charts, health-safe suggestions, localStorage import/export, responsive UI, or project-specific AI/agent development instructions.
---

# Metabolic Health App Development

## Start Here

Use this skill for changes to the metabolic tracker or for creating AI instructions that guide future work on it. The user prefers high-autonomy development: solve small issues directly, build complete flows when practical, validate before reporting, and ask only for decisions that affect direction, deployment, data, cost, or medical-safety boundaries.

Before editing, read:

- `AGENTS.md`
- `outputs/metabolic-tracker/index.html`
- `outputs/metabolic-tracker/styles.css`
- `outputs/metabolic-tracker/app.js`

Read `references/best-practices.md` when updating agent instructions, prompts, skill structure, validation strategy, or health/safety boundaries.

## Product Boundaries

- The app is for the user's own multi-device personal use. It may be deployed online, but it is not currently a public multi-user product.
- Keep simple local-first behavior as the baseline. Ask before adding account sync, external APIs, server storage, analytics, or telemetry.
- Treat health outputs as estimates and tracking aids, not diagnosis, treatment, or medication guidance.
- Provide proactive but conservative reminders about intake, exercise, and trends when useful. Avoid aggressive weight-loss recommendations. Make calorie deficits configurable.
- Preserve user records across updates. Tolerate missing fields in imported or older `localStorage` data.

## Implementation Workflow

1. Identify the smallest complete user-visible behavior to change.
2. Trace related data flow: form input, state shape, totals, suggestions, charts, export/import, and deletion.
3. Edit only the files needed for that behavior.
4. Prefer helpers for formulas and date handling; avoid duplicating calculation logic inside render code.
5. Keep UI copy in Chinese unless the user asks otherwise.
6. Improve obvious UI, save feedback, mobile ergonomics, and empty states without asking first.
7. Validate with the checklist below before reporting completion.

## Ask vs. Act

Act without asking for:

- Bug fixes, small refactors, UI polish, form order, wording, responsive fixes, and accessibility improvements.
- Completing expected feature surfaces such as persistence, summaries, deletion/editing, export/import, and mobile layout.
- Conservative non-medical food, movement, and trend suggestions.

Ask before:

- Adding login, sync, cloud storage, external health/food APIs, analytics, telemetry, paid services, or deployment accounts.
- Destructive or irreversible data changes.
- Changing the static-site architecture or adopting a framework.
- Giving guidance that could be interpreted as diagnosis, treatment, medication advice, or personalized medical prescription.

## Calculation Rules

- Use explicit units in labels and summaries.
- For calories, show rounded `kcal` values in the UI.
- For body metrics, keep one decimal where useful: weight, waist, glucose, sleep.
- For exercise, store both recorded calories and the credited calories implied by `exerciseCredit`.
- When estimating exercise calories, require either a recent body weight or a fallback weight.
- When date math matters, use local calendar dates rather than UTC slicing.

## UI Rules

- Optimize for repeated logging across desktop and mobile. The first screen should remain the usable tracker, not a landing page.
- Keep compact controls scan-friendly on desktop and single-column on mobile.
- Make persistent-setting saves visible with a short status message.
- Avoid hiding safety boundaries in long paragraphs; place short warnings near affected controls.
- Treat deployment readiness as part of polish: avoid broken relative paths, hidden local assumptions, and browser-only behavior that would fail on static hosting.

## Validation

Run the syntax check after JavaScript changes:

```powershell
node -e "const fs=require('fs'); new Function(fs.readFileSync('outputs/metabolic-tracker/app.js','utf8')); console.log('parsed')"
```

When browser verification is available, serve the static app from `localhost` and check:

- Settings can be filled, saved, and survive reload.
- A food entry updates daily calories and macros.
- An exercise entry updates total burn and credited calories.
- A body record updates latest metrics and trend inputs.
- The trend view renders charts without console errors.
- A 390px-wide viewport has no horizontal overflow.

## Reporting

Summarize changed files, what was validated, and any remaining uncertainty. Keep the report short. For health-related behavior, mention that calculations are estimates when relevant.
