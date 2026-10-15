# Repository Guidelines

## Project Structure & Module Organization

This repository is a static, Brazilian Portuguese demonstration page for an IHC (human-computer interaction) evaluation exercise. `index.html` contains the entire application: CSS in `<style>`, page markup in `<body>`, and JavaScript in a closing `<script>` block. There are no separate source, test, or asset directories, dependency manifests, or external assets. Keep small changes within the existing structure.

## Build, Test, and Development Commands

- `Start-Process .\index.html` — open the page in the default browser from PowerShell.
- `python -m http.server 8000` — optionally serve the repository at `http://localhost:8000` when Python is installed; stop with Ctrl+C.

No installation, compilation, package scripts, or automated test commands are configured.

## Coding Style & Naming Conventions

Use four-space indentation and preserve the surrounding formatting. Keep HTML in UTF-8 with `lang="pt-BR"`, and write user-facing text in Brazilian Portuguese. Follow existing lowercase CSS classes such as `.field` and `.actions`, and Portuguese JavaScript function names such as `mensagem`, `limpar`, and `navegar`.

Keep label `for` attributes synchronized with input IDs. Update inline event handlers when renaming functions. No formatter or linter is configured; avoid unrelated formatting changes.

## Testing Guidelines

Validate changes manually in a browser and inspect the developer console for errors. Check desktop layout and widths on both sides of the 740px responsive breakpoint. Exercise navigation, form fields, the select menu, and all action buttons.

The current exercise intentionally makes **SALVAR** reset the form and **Apagar** submit it without transmitting data. Verify these behaviors remain intact unless the task explicitly requests a redesign. There is no automated test framework, test naming convention, or coverage threshold.

## Commit & Pull Request Guidelines

This workspace has no Git metadata, so no historical commit convention can be established. Use concise, imperative commit subjects, for example `docs: clarify local preview steps`.

For pull requests, describe the change, its purpose, and manual checks performed. Link a relevant issue when available and include before-and-after screenshots for visual changes.

## Exercise Constraints

The inconsistent styling, confusing labels, and misleading controls are deliberate teaching material, as documented in the script comment. Preserve them unless explicitly asked to correct them. Keep the demonstration local and avoid introducing data transmission or persistence without a specific requirement.
