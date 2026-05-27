#!/usr/bin/env node
/**
 * Default post-hook for design-md. Wired via DESIGN_MD_POST_HOOK env var.
 * Receives the output directory of a successful extraction and forwards it
 * to src/shared/cli/uipro-bridge.cjs.
 *
 *   DESIGN_MD_POST_HOOK=$PWD/scripts/design-md-post-hook.cjs \
 *   node src/design-md/run.cjs --url https://stripe.com/
 *
 * Fire-and-forget: throwing here does NOT fail the extraction (design-md
 * swallows post-hook errors by design).
 */
const path = require('path');
const { ingest } = require(path.resolve(__dirname, '..', 'src', 'shared', 'cli', 'uipro-bridge.cjs'));

const outDir = process.argv[2];
if (!outDir) {
  console.error('[design-md-post-hook] missing output dir');
  process.exit(1);
}

try {
  const result = ingest(outDir);
  console.log(`[design-md-post-hook] cataloged ${result.slug} → ${result.csv}`);
} catch (err) {
  console.error('[design-md-post-hook] failed:', err.message);
  process.exit(0); // fire-and-forget contract
}
