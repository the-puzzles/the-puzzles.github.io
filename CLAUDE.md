# Puzzle Games — CLAUDE.md

## Project structure

Single-page HTML games, each self-contained in one file. No build step, no dependencies beyond Vue 3 CDN.

```
index.html        — game gallery / landing page
<game>.html       — one file per game
manifest.json     — PWA manifest
sw.js             — service worker
icon.svg          — app icon
```

## Stack

- **Vue 3** (CDN, `vue.global.js`) — `createApp`, `ref`, `computed`, `setup()` only. No SFCs, no Vite.
- **SVG** for game boards where needed (Sprouts, Morris).
- **Vanilla JS** for game logic — no extra libraries.
- `localStorage` for score/settings persistence per game.

## Adding a new game

1. Create `<game>.html` — copy the shell from an existing game (xo.html is the simplest template).
2. Add a card in `index.html` — follow the exact card pattern: `.card.<game>` class, hover/icon/title/rule-dot/play-btn styles in the `<style>` block.
3. Each game needs: back link → `index.html`, lang toggle (en/he minimum), score bar, status line, mode bar (2p / easy / hard as applicable), new-game + reset-scores buttons.

## Visual conventions

- Dark theme: `background: #0d1117`, text `#c9d1d9`, borders `#30363d / #21262d`.
- Each game picks a unique accent color pair for its two players / brand. Don't reuse another game's colors.
- `--board` or `--cell` CSS custom property controls responsive sizing.
- Fireworks on win — copy `launchFireworks()` from xo.html or morris.html, pass a color palette.
- Status bar height is fixed (`height: 2.2rem`) so layout doesn't shift.
- RTL support via `:dir` attribute — `isRTL = lang === 'he'`. Flip turn/win label order in template.

## AI pattern (minimax games)

- AI plays as player 2 / 'O'. Human is always player 1.
- `mode`: `'2p'` | `'easy'` (random) | `'hard'` (minimax).
- AI move is delayed `~380ms` with `aiThink` flag to block user input during thinking.
- Minimax uses alpha-beta pruning. Cap depth (6–8) for games with large state spaces.
- Evaluation function: win/loss = ±1000; positional heuristics for non-terminal states.

## Sprouts specifics

- SVG board with pan/zoom via `viewBox` manipulation.
- Crossing detection: `curvesProperlyIntersect(pts1, pts2, sharedDots)` — no skip for unrelated curves; 9% parametric skip + DOT_R=30 exclusion near shared dots for shared-endpoint curves.
- Route finding (`findRoute`) tries perpendicular offsets, then absolute corner control points, then large offsets. Prefers midpoints inside the viewport.
- `ensureVisible()` auto-expands viewBox when new dots land off-screen.
- Dead dots: `pointer-events: none`, `dotNear` skips them — so nearby live dots remain tappable on mobile.
- Degree guard in `makeMove`: self-loop costs 2 connections, regular edge costs 1 each end.

## localStorage keys

| Game       | Key           |
|------------|---------------|
| X O        | `xo-save`     |
| Sprouts    | `sprouts-save`|
| Morris     | `morris-save` |

New games: use `<gamename>-save`.

## What NOT to do

- Don't add a build system or package.json.
- Don't split a game across multiple files.
- Don't add TypeScript.
- Don't add comments explaining what code does — only add comments for non-obvious *why*.
