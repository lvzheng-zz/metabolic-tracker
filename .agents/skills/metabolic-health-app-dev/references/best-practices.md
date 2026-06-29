# Best Practices Reference

Read this only when changing project instructions, skill design, validation strategy, or agent-oriented development workflow.

## Sources Consulted

- OpenAI Codex AGENTS.md guide: https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex Skills guide: https://developers.openai.com/codex/skills
- OpenAI Codex prompting guide: https://developers.openai.com/codex/prompting
- OpenAI prompt engineering guide: https://developers.openai.com/api/docs/guides/prompt-engineering
- Anthropic Claude Code memory guide: https://code.claude.com/docs/en/memory
- GitHub Copilot repository custom instructions: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions

## Instruction Design

- Keep durable instructions short, specific, and stable. Project-wide rules should cover build, validation, architecture, data handling, and safety boundaries.
- Avoid task-specific wishes in persistent instruction files. Put repeatable workflows in skills and put one-off goals in the user prompt.
- Prefer verifiable rules: "run this syntax check" is better than "make sure code is good".
- Split broad and narrow guidance. Root instructions should apply everywhere; skills should trigger for specialized workflows.
- Avoid conflicts. If a rule changes, remove or update the old rule rather than adding another competing rule.
- For new users, reduce conversational overhead by defining an ask-vs-act policy. Agents should handle small implementation decisions themselves and ask only for high-impact tradeoffs.

## Skill Design

- Front-load trigger words in the `description`, because Codex may shorten long skill lists.
- Keep `SKILL.md` focused on workflow. Put longer background notes in `references/`.
- Use progressive disclosure: read references only when the task needs them.
- Add scripts only for repeated or fragile operations that need deterministic behavior.
- Validate skill metadata: frontmatter needs only `name` and `description`; names should be lowercase hyphen-case.

## Agentic Development

- Give agents enough context to verify work: relevant files, reproduction steps, success criteria, and checks.
- Break complex changes into small, reviewable slices.
- Prefer local tests and browser checks over claims from inspection alone.
- For production AI behavior, maintain evals or repeatable examples that catch regressions.
- Pin assumptions that affect output stability, such as formulas, model choices, default thresholds, and data schemas.
- For high-autonomy collaboration, define the default delivery loop as: inspect, choose a reasonable path, implement, validate, summarize. Avoid stopping to ask about routine UI, naming, or local refactor choices.
- Build complete user flows when practical. A feature is usually not complete until it includes persistence, feedback, summaries, error handling, deletion/editing where relevant, and mobile behavior.

## Health-App Safety

- State that calorie, MET, BMR, and TDEE numbers are estimates.
- Avoid medical diagnosis or treatment instructions.
- Keep blood glucose, blood pressure, medication, and severe calorie restriction guidance conservative and user-configurable.
- Do not transmit personal health data without explicit user direction, even when the app is for personal use.
- Conservative behavioral suggestions are acceptable when framed as non-medical guidance and kept configurable.
