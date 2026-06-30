#!/usr/bin/env node
// filter-he-words.js — find Hebrew words traceable on Splice grids
//
// Usage:
//   node filter-he-words.js wordlist.txt
//   cat wordlist.txt | node filter-he-words.js
//
// Input: one Hebrew word per line (bare consonants, no nikud needed).
// Output: which words are traceable on each grid, plus letters
//         not covered by any current grid (to guide new grid design).

'use strict';
const fs = require('fs');

const HE_FINALS = { 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ך': 'כ', 'ץ': 'צ' };
const normLetter = c => HE_FINALS[c] || c;
const normWord   = w => [...w].map(normLetter).join('');

function adj(a, b, cols) {
  return a !== b
    && Math.abs((a % cols) - (b % cols)) <= 1
    && Math.abs(Math.floor(a / cols) - Math.floor(b / cols)) <= 1;
}

// Bitmask DFS — works for grids up to 30 nodes
function isTraceable(norm, normLetters, cols) {
  const chars = [...norm];
  const n = normLetters.length;
  function dfs(pos, depth, used) {
    if (depth === chars.length) return true;
    for (let nx = 0; nx < n; nx++) {
      if (used & (1 << nx)) continue;
      if (!adj(pos, nx, cols)) continue;
      if (normLetters[nx] !== chars[depth]) continue;
      if (dfs(nx, depth + 1, used | (1 << nx))) return true;
    }
    return false;
  }
  for (let s = 0; s < n; s++) {
    if (normLetters[s] !== chars[0]) continue;
    if (dfs(s, 1, 1 << s)) return true;
  }
  return false;
}

// ── Current grids ──────────────────────────────────────────────────────────
const GRIDS = [
  { name: 'HE1', letters: ['ח','מ','ש','ה','ו','ל','נ','ת','ב'], cols: 3 },
  { name: 'HE2', letters: ['ב','ר','ה','י','ת','כ','ש','ד','ו'], cols: 3 },
  { name: 'HE3', letters: ['נ','י','מ','ה','ד','ל','ת','ו','ב'], cols: 3 },
];
for (const g of GRIDS) {
  g.normLetters = g.letters.map(normLetter);
  g.letterSet   = new Set(g.normLetters);
}

// ── Read input ─────────────────────────────────────────────────────────────
const src  = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf-8')
                              : fs.readFileSync('/dev/stdin', 'utf-8');
const all  = src.split('\n').map(w => w.trim()).filter(Boolean);

// Strip nikud (vowel marks U+05B0–U+05C7) so bare-consonant grids match
const strip = w => w.replace(/[ְ-ׇ]/g, '');

const words = [...new Set(all.map(strip))];         // deduplicate
console.log(`Input: ${all.length} lines → ${words.length} unique words\n`);

// ── Filter & trace ─────────────────────────────────────────────────────────
let skippedShort    = 0;
let skippedRepeated = 0;
const results = Object.fromEntries(GRIDS.map(g => [g.name, []]));
const letterFreq = {};   // which letters appear in traceable words

for (const word of words) {
  const norm = normWord(word);
  if (norm.length < 4) { skippedShort++;    continue; }
  const chars = [...norm];
  if (new Set(chars).size < chars.length) { skippedRepeated++; continue; }

  for (const g of GRIDS) {
    if (!chars.every(c => g.letterSet.has(c))) continue;
    if (!isTraceable(norm, g.normLetters, g.cols)) continue;
    results[g.name].push(word);
    for (const c of chars) letterFreq[c] = (letterFreq[c] || 0) + 1;
  }
}

console.log(`Skipped: ${skippedShort} too short (<4 letters), ${skippedRepeated} with repeated letters\n`);

// ── Results per grid ───────────────────────────────────────────────────────
for (const g of GRIDS) {
  const found = results[g.name];
  console.log(`── ${g.name}  (${g.letters.join(' ')})  —  ${found.length} words ──`);
  if (found.length === 0) { console.log('  (none)\n'); continue; }
  // print in columns of 4
  for (let i = 0; i < found.length; i += 4)
    console.log('  ' + found.slice(i, i + 4).join('   '));
  console.log();
}

// ── Letters not covered by any grid ───────────────────────────────────────
const allGridLetters = new Set(GRIDS.flatMap(g => g.normLetters));
const inputLetters   = new Set(words.flatMap(w => [...normWord(w)]));
const uncovered      = [...inputLetters]
  .filter(c => !allGridLetters.has(c))
  .sort((a, b) => (letterFreq[b] || 0) - (letterFreq[a] || 0));  // most useful first

console.log('── Letters not in any current grid (most common first) ──');
console.log('  ' + (uncovered.length ? uncovered.join('  ') : '(all covered)'));
console.log();
console.log('Hint: design a new grid around the top 9–12 uncovered letters');
console.log('      to unlock the most new words from your list.');
