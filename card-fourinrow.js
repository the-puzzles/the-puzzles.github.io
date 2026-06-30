CATEGORIES.find(c=>c.label==="Classic Games").games.push({
  "id": "fourinrow",
  "title": "FOUR IN A ROW",
  "icon": "🔴",
  "href": "fourinrow.html",
  "accent": "#ef4444",
  "shadow": "rgba(239,68,68,0.15)",
  "iconBg": "#450a0a",
  "gradient": "linear-gradient(135deg,#ef4444,#eab308)",
  "btnBg": "#450a0a",
  "btnColor": "#fca5a5",
  "playLabel": "Play Four in a Row",
  "tagline": "Drop pieces into the grid. First to connect four in a row — horizontal, vertical, or diagonal — wins.",
  "rules": [
    "7 columns × 6 rows — pieces fall by gravity",
    "Red vs Yellow — 2 player or vs AI",
    "Hard AI uses minimax with alpha-beta pruning"
  ],
  "preview": "<div class=\"preview\" style=\"grid-template-columns:1fr;padding:8px\">\n          <svg viewBox=\"0 0 124 124\" style=\"width:124px;height:124px;display:block\">\n            <rect width=\"124\" height=\"124\" rx=\"10\" fill=\"#1d3461\"/>\n            <circle cx=\"17\"  cy=\"17\"  r=\"13\" fill=\"#0d1117\"/>\n            <circle cx=\"45\"  cy=\"17\"  r=\"13\" fill=\"#0d1117\"/>\n            <circle cx=\"73\"  cy=\"17\"  r=\"13\" fill=\"#0d1117\"/>\n            <circle cx=\"101\" cy=\"17\"  r=\"13\" fill=\"#eab308\"/>\n            <circle cx=\"17\"  cy=\"45\"  r=\"13\" fill=\"#0d1117\"/>\n            <circle cx=\"45\"  cy=\"45\"  r=\"13\" fill=\"#0d1117\"/>\n            <circle cx=\"73\"  cy=\"45\"  r=\"13\" fill=\"#ef4444\"/>\n            <circle cx=\"101\" cy=\"45\"  r=\"13\" fill=\"#eab308\"/>\n            <circle cx=\"17\"  cy=\"73\"  r=\"13\" fill=\"#0d1117\"/>\n            <circle cx=\"45\"  cy=\"73\"  r=\"13\" fill=\"#ef4444\"/>\n            <circle cx=\"73\"  cy=\"73\"  r=\"13\" fill=\"#eab308\"/>\n            <circle cx=\"101\" cy=\"73\"  r=\"13\" fill=\"#eab308\"/>\n            <circle cx=\"17\"  cy=\"101\" r=\"13\" fill=\"#ef4444\"/>\n            <circle cx=\"45\"  cy=\"101\" r=\"13\" fill=\"#eab308\"/>\n            <circle cx=\"73\"  cy=\"101\" r=\"13\" fill=\"#ef4444\"/>\n            <circle cx=\"101\" cy=\"101\" r=\"13\" fill=\"#ef4444\"/>\n            <circle cx=\"17\"  cy=\"101\" r=\"13\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\" opacity=\".8\"/>\n            <circle cx=\"45\"  cy=\"73\"  r=\"13\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\" opacity=\".8\"/>\n            <circle cx=\"73\"  cy=\"45\"  r=\"13\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\" opacity=\".8\"/>\n            <circle cx=\"101\" cy=\"17\"  r=\"13\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\" opacity=\".8\"/>\n          </svg>\n        </div>"
});
