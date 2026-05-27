# Integration with `ui-ux-pro-max`

`design-md` is a self-contained skill (it runs alone in any `.claude/skills/` folder), but when shipped inside this repo it auto-feeds the `ui-ux-pro-max` catalog.

## How it works

```
design-md extract  →  outputs/design-md/{slug}/
                       ├── tokens.json
                       ├── style-fingerprint.json
                       └── quality-score.json
                              │
                              ▼  (DESIGN_MD_POST_HOOK)
                       scripts/design-md-post-hook.cjs
                              │
                              ▼
                       src/shared/cli/uipro-bridge.cjs
                              │
                              ▼  (append, idempotent)
                       src/ui-ux-pro-max/data/extracted-references.csv
                              │
                              ▼
                       BM25 search recommends real-world refs
```

## Enable the post-hook

Add to your shell env (or `.env`):

```bash
export DESIGN_MD_POST_HOOK="$PWD/scripts/design-md-post-hook.cjs"
```

Then every successful extraction is cataloged automatically:

```bash
node src/design-md/run.cjs --url https://stripe.com/
# → outputs/design-md/stripe/ produced
# → src/ui-ux-pro-max/data/extracted-references.csv ← appended
```

Set `DESIGN_MD_SKIP_HOOK=1` to bypass for a one-off run.

## Shared taxonomy

`design-md/lib/extractors.cjs` defines 11 visual archetypes. Their canonical IDs live in `src/shared/taxonomy/archetypes.csv` (Python-friendly) and `archetypes.json` (Node-friendly, regenerated via `scripts/build-shared.cjs`). Keep the CSV in sync if you add an archetype to `extractors.cjs`.
