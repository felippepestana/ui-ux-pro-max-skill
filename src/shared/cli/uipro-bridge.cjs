#!/usr/bin/env node
/**
 * uipro-bridge — append a successful design-md extraction to the ui-ux-pro-max
 * catalog so the BM25 search can recommend real-world references next time.
 *
 * Usage:
 *   node src/shared/cli/uipro-bridge.cjs <design-md-output-dir>
 *
 * Reads from <dir>:
 *   - tokens.json
 *   - style-fingerprint.json
 *   - quality-score.json (optional)
 *   - telemetry.json     (optional, for url)
 *
 * Appends one row to src/ui-ux-pro-max/data/extracted-references.csv (creating
 * the file with header if absent). Idempotent: if a row with the same slug
 * already exists, it is replaced rather than duplicated.
 */
const fs   = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const CSV_PATH  = path.join(REPO_ROOT, 'src', 'ui-ux-pro-max', 'data', 'extracted-references.csv');
const HEADER    = 'slug,url,primary_archetype,secondary_archetype,confidence,overall_grade,extracted_at\n';

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return null; }
}

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function ingest(outDir) {
  const dir  = path.resolve(outDir);
  const slug = path.basename(dir);

  const fp        = readJsonSafe(path.join(dir, 'style-fingerprint.json'));
  const quality   = readJsonSafe(path.join(dir, 'quality-score.json'));
  const telemetry = readJsonSafe(path.join(dir, 'telemetry.json'));

  const primary    = fp?.classification?.primary_archetype   || '';
  const secondary  = fp?.classification?.secondary_archetype || '';
  const confidence = fp?.classification?.confidence_score    ?? '';
  const grade      = quality?.overall_grade                  || '';
  const url        = telemetry?.url || telemetry?.input?.url || '';
  const when       = new Date().toISOString();

  const row = [slug, url, primary, secondary, confidence, grade, when]
    .map(csvEscape)
    .join(',') + '\n';

  fs.mkdirSync(path.dirname(CSV_PATH), { recursive: true });

  let existing = '';
  if (fs.existsSync(CSV_PATH)) existing = fs.readFileSync(CSV_PATH, 'utf8');
  if (!existing.startsWith('slug,')) existing = HEADER + existing;

  // Idempotent replace: drop any prior row with the same slug
  const lines = existing.split('\n').filter(line => {
    if (!line) return false;
    if (line.startsWith('slug,')) return true;
    const firstCol = line.split(',')[0].replace(/^"|"$/g, '');
    return firstCol !== slug;
  });
  lines.push(row.trimEnd());
  fs.writeFileSync(CSV_PATH, lines.join('\n') + '\n');

  return { slug, primary, grade, csv: CSV_PATH };
}

if (require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error('usage: uipro-bridge <design-md-output-dir>');
    process.exit(1);
  }
  const result = ingest(target);
  console.log(`[uipro-bridge] cataloged ${result.slug} (${result.primary || 'unclassified'}, ${result.grade || 'n/a'}) → ${result.csv}`);
}

module.exports = { ingest };
