# AGENTS.md

## Project Purpose

This workspace contains a personal metabolic health and fat-loss tracker in `outputs/metabolic-tracker/`.
The app helps the user record meals, body metrics, exercise, calorie budgets, and long-term trends.
The user plans to use it across devices and may deploy it online for personal use.

## Collaboration Contract

- Default to high autonomy. Make reasonable product, UI, code-structure, and validation decisions without asking about every small issue.
- Optimize for complete, polished outcomes over minimal prototypes when the extra work is directly useful.
- Ask the user only when a decision affects product direction, deployment provider, account/sync model, paid services, external APIs, destructive data changes, or medical-safety boundaries.
- Do not stop at proposals when implementation is feasible. Read the files, make the change, validate it, and report the result.
- Keep final reports short: what changed, what was verified, and what still needs a decision.

## Durable Product Rules

- Treat all health features as logging, estimation, and conservative self-management support. Do not present diagnosis, treatment, medication advice, or guaranteed weight-loss outcomes.
- The product is for the user's own use, not a public multi-user product. Do not add onboarding, marketing, admin, billing, or team features unless requested.
- Multi-device use and deployment are valid goals. Prefer static hosting and simple backup/restore first; ask before adding cloud sync, login, server storage, analytics, or third-party health APIs.
- Preserve existing user data in `localStorage`. When changing stored shape, add a backward-compatible migration or tolerant reader.
- Keep the app usable as a static site: `index.html`, `styles.css`, and `app.js` should continue to work without a build step.
- Use Chinese UI text by default. Keep labels short, direct, and practical for daily use.
- It is acceptable to provide proactive but conservative food, exercise, and trend suggestions when clearly framed as estimates and non-medical guidance.

## Development Workflow

- Read the relevant files before editing: `outputs/metabolic-tracker/index.html`, `outputs/metabolic-tracker/styles.css`, and `outputs/metabolic-tracker/app.js`.
- Prefer small, cohesive changes over broad rewrites. Match the existing vanilla HTML/CSS/JS style unless the user explicitly asks for a framework.
- Use structured data and helper functions for calculations instead of scattering formulas through UI rendering code.
- Name formula assumptions in code or UI when they affect user-facing numbers, such as BMR, TDEE, calorie deficit, MET exercise estimates, and exercise credit percentage.
- When adding a new metric or record type, update input forms, daily summaries, trend summaries, import/export, and deletion behavior together.
- For new features, build the expected complete flow when practical: input, persistence, feedback state, summary, deletion/editing, export/import impact, mobile layout, and validation.

## UI Standards

- Design for repeated daily entry, not a marketing landing page.
- Use stable dimensions for tabs, forms, charts, and summary blocks so values do not shift the layout.
- Avoid vague helper text. Prefer actionable labels such as `体重 kg`, `热量 /100g`, and `运动吃回比例 %`.
- Make save state visible for settings or other persistent forms.
- Keep mobile layouts free of horizontal overflow.
- Codex may improve UI layout, copy, save feedback, form order, empty states, and mobile ergonomics without asking first.

## Validation Checklist

- Run a JavaScript syntax check after changing `app.js`:
  `node -e "const fs=require('fs'); new Function(fs.readFileSync('outputs/metabolic-tracker/app.js','utf8')); console.log('parsed')"`
- When possible, verify in a browser through `localhost` rather than `file://`, because browser automation may block direct file URLs.
- For functional changes, verify at least one happy path:
  `settings save`, `food calorie total`, `exercise credit`, `body latest metrics`, and `trend chart render`.
- Check browser console errors after UI changes.
- For responsive changes, verify a narrow viewport around 390px width has no horizontal overflow.

## Ask vs. Act Rules

Act without asking for:

- UI polish, wording, layout, responsive fixes, accessibility improvements, and save-state feedback.
- Bug fixes, refactors that reduce duplication, and local validation setup.
- Conservative health reminders, provided they remain non-diagnostic and user-configurable.
- Completing adjacent parts of a feature that users naturally expect.

Ask before:

- Adding login, cloud database, sync, external APIs, telemetry, analytics, payment, or deployment accounts.
- Deleting or migrating user data in a way that cannot be reversed.
- Changing the technology stack or turning the static app into a server app.
- Giving advice that could sound like medical treatment, medication guidance, or diagnosis.
- Making a major product-direction tradeoff where multiple user experiences are plausible.

## AI/Agent Work Practices

- Keep persistent instructions concise and durable. Put repeated project rules here; put task-specific procedures in skills or references.
- If a task is complex, choose a sensible path and implement the smallest complete useful version first, then validate before expanding.
- Make uncertainty visible when calculations are estimates. Prefer safe defaults over aggressive recommendations.
- Do not claim medical accuracy beyond the formulas and assumptions implemented in the app.

## Source-Informed Guidance

- `AGENTS.md` is for durable project expectations and should stay concise enough to load reliably.
- Skills are for reusable workflows that should load only when relevant.
- Good agent prompts and instructions include context, success criteria, and validation steps.
