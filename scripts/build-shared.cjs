#!/usr/bin/env node
/**
 * Regenerate JSON sidecars in src/shared/taxonomy/ from their authoritative CSVs.
 * Run after editing any CSV under src/shared/taxonomy/.
 */
const fs   = require('fs');
const path = require('path');

const SHARED = path.resolve(__dirname, '..', 'src', 'shared');

function parseCsv(text) {
  const lines  = text.trim().split(/\r?\n/);
  const header = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Naive CSV splitter that respects quoted fields containing commas
    const cells = [];
    let cur = '', inside = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inside = !inside; continue; }
      if (ch === ',' && !inside) { cells.push(cur); cur = ''; continue; }
      cur += ch;
    }
    cells.push(cur);
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? '']));
  });
}

function buildArchetypes() {
  const csvPath  = path.join(SHARED, 'taxonomy', 'archetypes.csv');
  const jsonPath = path.join(SHARED, 'taxonomy', 'archetypes.json');
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const out  = {
    $comment:   'Generated from archetypes.csv by scripts/build-shared.cjs. Do not edit by hand.',
    version:    1,
    archetypes: rows.map(r => ({ id: r.id, name: r.name })),
  };
  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2) + '\n');
  console.log(`[build-shared] wrote ${rows.length} archetypes → ${path.relative(process.cwd(), jsonPath)}`);
}

buildArchetypes();
