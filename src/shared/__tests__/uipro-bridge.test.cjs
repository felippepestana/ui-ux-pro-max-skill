const test    = require('node:test');
const assert  = require('node:assert');
const fs      = require('fs');
const path    = require('path');
const os      = require('os');

const bridge  = require('../cli/uipro-bridge.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const CSV_PATH  = path.join(REPO_ROOT, 'src', 'ui-ux-pro-max', 'data', 'extracted-references.csv');

function makeFakeRun(rootDir, slug, overrides = {}) {
  const dir = path.join(rootDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'style-fingerprint.json'), JSON.stringify({
    classification: {
      primary_archetype:   overrides.primary   ?? 'apple-glass',
      secondary_archetype: overrides.secondary ?? null,
      confidence_score:    overrides.confidence ?? 82,
    },
  }));
  fs.writeFileSync(path.join(dir, 'quality-score.json'), JSON.stringify({
    overall_grade: overrides.grade ?? 'A',
  }));
  fs.writeFileSync(path.join(dir, 'telemetry.json'), JSON.stringify({
    url: overrides.url ?? `https://example.test/${slug}`,
  }));
  return dir;
}

function snapshotCsv() {
  return fs.existsSync(CSV_PATH) ? fs.readFileSync(CSV_PATH, 'utf8') : null;
}

function restoreCsv(snap) {
  if (snap === null) {
    if (fs.existsSync(CSV_PATH)) fs.unlinkSync(CSV_PATH);
  } else {
    fs.writeFileSync(CSV_PATH, snap);
  }
}

test('uipro-bridge appends a row with header', () => {
  const original = snapshotCsv();
  try {
    if (fs.existsSync(CSV_PATH)) fs.unlinkSync(CSV_PATH);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'uipro-bridge-'));
    const dir = makeFakeRun(tmp, 'acme-co');
    bridge.ingest(dir);
    const csv = fs.readFileSync(CSV_PATH, 'utf8');
    assert.ok(csv.startsWith('slug,url,primary_archetype'), 'has header');
    assert.ok(csv.includes('acme-co,https://example.test/acme-co,apple-glass'), 'has row');
  } finally {
    restoreCsv(original);
  }
});

test('uipro-bridge is idempotent (replaces row for same slug)', () => {
  const original = snapshotCsv();
  try {
    if (fs.existsSync(CSV_PATH)) fs.unlinkSync(CSV_PATH);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'uipro-bridge-'));
    const dir1 = makeFakeRun(tmp, 'acme-co', { confidence: 50, grade: 'C' });
    bridge.ingest(dir1);
    const dir2 = makeFakeRun(tmp, 'acme-co', { confidence: 90, grade: 'A' });
    bridge.ingest(dir2);

    const csv  = fs.readFileSync(CSV_PATH, 'utf8');
    const rows = csv.trim().split('\n').filter(r => r.startsWith('acme-co'));
    assert.strictEqual(rows.length, 1, 'exactly one acme-co row');
    assert.ok(rows[0].includes(',90,A,'), 'row reflects the second run');
  } finally {
    restoreCsv(original);
  }
});

test('uipro-bridge handles missing optional files', () => {
  const original = snapshotCsv();
  try {
    if (fs.existsSync(CSV_PATH)) fs.unlinkSync(CSV_PATH);
    const tmp  = fs.mkdtempSync(path.join(os.tmpdir(), 'uipro-bridge-'));
    const slug = 'bare-co';
    const dir  = path.join(tmp, slug);
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'style-fingerprint.json'), JSON.stringify({
      classification: { primary_archetype: 'shadcn-neutral' },
    }));
    bridge.ingest(dir);
    const csv = fs.readFileSync(CSV_PATH, 'utf8');
    assert.ok(csv.includes('bare-co'), 'still cataloged');
  } finally {
    restoreCsv(original);
  }
});
