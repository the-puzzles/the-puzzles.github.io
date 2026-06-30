CATEGORIES.find(c=>c.label==="Classic Games").games.push({
  "id": "sprouts",
  "title": "SPROUTS",
  "icon": "🌱",
  "href": "sprouts.html",
  "accent": "#10b981",
  "shadow": "rgba(16,185,129,0.15)",
  "iconBg": "#091c14",
  "gradient": "linear-gradient(135deg,#10b981,#6ee7b7)",
  "btnBg": "#091c14",
  "btnColor": "#34d399",
  "playLabel": "Play Sprouts",
  "tagline": "A pen-and-paper classic by John Conway. Connect dots with curves, sprouting a new dot on each line — until no move is possible.",
  "rules": [
    "Draw a curve between any two live dots (or a loop)",
    "Place a new dot on every curve you draw",
    "A dot dies when it has 3 connections",
    "Last player to move wins · 2, 3, or 4 starting dots"
  ],
  "preview": "<div class=\"preview\" style=\"grid-template-columns:1fr;padding:14px 20px\">\n          <svg viewBox=\"0 0 180 90\" style=\"width:180px;height:90px;display:block;margin:0 auto\">\n            <path d=\"M 30 45 Q 90 10 150 45\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-opacity=\".8\"/>\n            <path d=\"M 30 45 Q 90 80 150 45\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2\" stroke-opacity=\".6\"/>\n            <circle cx=\"30\"  cy=\"45\" r=\"6\" fill=\"#34d399\"/>\n            <circle cx=\"150\" cy=\"45\" r=\"6\" fill=\"#34d399\"/>\n            <circle cx=\"90\"  cy=\"23\" r=\"5\" fill=\"#6ee7b7\" opacity=\".9\"/>\n            <circle cx=\"90\"  cy=\"67\" r=\"5\" fill=\"#a7f3d0\" opacity=\".7\"/>\n          </svg>\n        </div>"
});
