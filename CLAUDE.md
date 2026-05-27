# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Antigravity Kit is an AI-powered design intelligence toolkit providing searchable databases of UI styles, color palettes, font pairings, chart types, and UX guidelines. It works as a skill/workflow for AI coding assistants (Claude Code, Windsurf, Cursor, etc.).

## Search Command

```bash
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max_results>]
```

**Domain search:**
- `product` - Product type recommendations (SaaS, e-commerce, portfolio)
- `style` - UI styles (glassmorphism, minimalism, brutalism) + AI prompts and CSS keywords
- `typography` - Font pairings with Google Fonts imports
- `color` - Color palettes by product type
- `landing` - Page structure and CTA strategies
- `chart` - Chart types and library recommendations
- `ux` - Best practices and anti-patterns

**Stack search:**
```bash
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
```
Available stacks: `html-tailwind` (default), `react`, `nextjs`, `astro`, `vue`, `nuxtjs`, `nuxt-ui`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

## Architecture

```
src/ui-ux-pro-max/                # Source of Truth (Python)
├── data/                         # Canonical CSV databases
│   ├── products.csv, styles.csv, colors.csv, typography.csv, ...
│   ├── extracted-references.csv  # Appended by design-md → uipro-bridge
│   └── stacks/                   # Stack-specific guidelines
├── scripts/
│   ├── search.py                 # CLI entry point
│   ├── core.py                   # BM25 + regex hybrid search engine
│   └── design_system.py          # Design system generation
└── templates/
    ├── base/                     # Base templates (skill-content.md, quick-reference.md)
    └── platforms/                # Platform configs (claude.json, cursor.json, ...)

src/design-md/                    # Companion skill (Node) — URL → DESIGN.md
├── run.cjs, lib/, scripts/, data/, package.json
├── SKILL.md
└── INTEGRATION.md                # Bridge to ui-ux-pro-max

src/shared/                       # Cross-skill canonical artifacts
├── taxonomy/archetypes.csv|.json # Single source for visual archetypes (Node + Python)
├── schema/*.schema.json          # tokens / fingerprint / quality-score
└── cli/uipro-bridge.cjs          # design-md output → ui-ux-pro-max CSV

content/destemidos-pioneiros/     # Editorial kit for the Legendários TOP 1270 site
├── copy/, brand/, media/, sources/, manifest.json

web/                              # React + Vite + Tailwind editor + microsites
└── src/sites/destemidos-pioneiros/  # Microsite at /destemidos-pioneiros

cli/                              # CLI installer (uipro-cli on npm)
├── src/commands/init.ts
└── assets/

.claude/skills/ui-ux-pro-max/     # Claude Code skill (symlinks to src/)
.claude/skills/design-md/         # → ../../src/design-md (symlink)
.factory/skills/ui-ux-pro-max/    # Droid (Factory) skill
.factory/skills/design-md/        # → ../../src/design-md (symlink)
.shared/ui-ux-pro-max/            # → ../src/ui-ux-pro-max (symlink)
.shared/design-md/                # → ../src/design-md (symlink)
.claude-plugin/                   # Claude Marketplace publishing

scripts/
├── build-shared.cjs              # Regen src/shared/taxonomy/*.json from CSVs
├── design-md-post-hook.cjs       # Wire design-md → uipro-bridge (set DESIGN_MD_POST_HOOK)
└── collect-instagram.cjs         # Pulls IG media to content/destemidos-pioneiros/media/
```

The search engine uses BM25 ranking combined with regex matching. Domain auto-detection is available when `--domain` is omitted.

## Sync Rules

**Sources of Truth:** `src/ui-ux-pro-max/` (Python skill), `src/design-md/` (Node skill), `src/shared/` (cross-skill artifacts).

When modifying files:

1. **Data & Scripts (ui-ux-pro-max)** - Edit in `src/ui-ux-pro-max/`:
   - `data/*.csv` and `data/stacks/*.csv`
   - `scripts/*.py`
   - Changes automatically available via symlinks in `.claude/`, `.factory/`, `.shared/`

2. **Templates** - Edit in `src/ui-ux-pro-max/templates/`:
   - `base/skill-content.md` - Common SKILL.md content
   - `base/quick-reference.md` - Quick reference section (Claude only)
   - `platforms/*.json` - Platform-specific configs

3. **design-md skill** - Edit in `src/design-md/`:
   - `lib/*.cjs`, `scripts/*.cjs`, `data/*`, `SKILL.md`
   - Available via symlinks at `.claude/skills/design-md/`, `.factory/skills/design-md/`, `.shared/design-md/`
   - Run `npm test --workspace src/design-md` after edits

4. **Shared taxonomy/schemas** - Edit in `src/shared/`:
   - Authoritative format is `taxonomy/*.csv`; regenerate sidecar JSON with `node scripts/build-shared.cjs`
   - When adding/removing an archetype in `src/design-md/lib/extractors.cjs`, update `src/shared/taxonomy/archetypes.csv` in the same change

5. **CLI Assets** - Run sync before publishing:
   ```bash
   cp -r src/ui-ux-pro-max/data/* cli/assets/data/
   cp -r src/ui-ux-pro-max/scripts/* cli/assets/scripts/
   cp -r src/ui-ux-pro-max/templates/* cli/assets/templates/
   mkdir -p cli/assets/skills/design-md
   cp -r src/design-md/* cli/assets/skills/design-md/
   ```

6. **Reference Folders** - No manual sync needed. The CLI generates these from templates during `uipro init`.

## Node tooling

A root `package.json` defines workspaces (`cli`, `web`, `src/design-md`). Useful commands:

```bash
npm run build-shared          # Regen src/shared/taxonomy/*.json from CSV
npm run test:shared           # Unit tests for uipro-bridge
npm run test:design-md        # design-md test suite (~211 tests)
npm run test:node             # Both Node test suites
```

## Companion skill: design-md

`src/design-md/` is a self-contained Node skill that extracts a Google-spec
`DESIGN.md` from any URL via static HTML/CSS analysis. When `DESIGN_MD_POST_HOOK`
points to `scripts/design-md-post-hook.cjs`, every successful extraction is
catalogued in `src/ui-ux-pro-max/data/extracted-references.csv` so the BM25
search can recommend real-world references.

See `src/design-md/INTEGRATION.md` for the bridge wiring details.

## Prerequisites

Python 3.x (no external dependencies required)

## Git Workflow

Never push directly to `main`. Always:

1. Create a new branch: `git checkout -b feat/...` or `fix/...`
2. Commit changes
3. Push branch: `git push -u origin <branch>`
4. Create PR: `gh pr create`
