CATEGORIES.find(c=>c.label==="Classic Games").games.push({
  "id": "quoridor",
  "title": "QUORIDOR",
  "title_he": "קוורידור",
  "title_es": "QUORIDOR",
  "icon": "🧱",
  "href": "quoridor.html",
  "accent": "#fb7a52",
  "shadow": "rgba(251,122,82,0.15)",
  "iconBg": "#2a1710",
  "gradient": "linear-gradient(135deg,#fb7a52,#93b4d9)",
  "btnBg": "#2a1710",
  "btnColor": "#fca589",
  "playLabel": "Play Quoridor",
  "tagline": "Race your pawn to the far side of the board — or slow your opponent down by dropping walls in their path. Just don't wall them in completely.",
  "tagline_he": "רוצו עם החייל שלכם לצד השני של הלוח — או האטו את היריב בעזרת קירות. רק אל תחסמו אותו לגמרי.",
  "tagline_es": "Corre con tu peón hasta el otro lado del tablero, o frena a tu rival colocando muros en su camino. Solo que no puedes encerrarlo por completo.",
  "rules": [
    "9×9 board — race your pawn to the opposite edge",
    "Move one step, or jump over your opponent",
    "10 walls each — block your opponent's path",
    "A wall can never fully seal off either player",
    "2-player mode or vs computer (Easy / Hard)"
  ],
  "rules_he": [
    "לוח 9×9 — רוצו עם החייל לצד הנגדי",
    "זוזו צעד אחד, או קפצו מעל היריב",
    "10 קירות לכל שחקן — חסמו את דרך היריב",
    "קיר לעולם לא יכול לחסום לגמרי אף שחקן",
    "שני שחקנים או נגד מחשב (קל / קשה)"
  ],
  "rules_es": [
    "Tablero 9×9 — lleva tu peón al lado opuesto",
    "Muévete un paso, o salta sobre tu rival",
    "10 muros cada uno — bloquea el camino del rival",
    "Un muro nunca puede sellar por completo a ningún jugador",
    "Modo 2 jugadores o contra la computadora (Fácil / Difícil)"
  ],
  "preview": "<div class=\"preview\" style=\"grid-template-columns:1fr;padding:10px 14px;background:#161b22\">\n          <svg viewBox=\"0 0 100 130\" style=\"width:100px;height:130px;display:block;margin:0 auto\">\n            <defs>\n              <radialGradient id=\"qcA\" cx=\"30%\" cy=\"25%\" r=\"75%\"><stop offset=\"0%\" stop-color=\"#ffd7c2\"/><stop offset=\"55%\" stop-color=\"#fb7a52\"/><stop offset=\"100%\" stop-color=\"#c2410c\"/></radialGradient>\n              <radialGradient id=\"qcB\" cx=\"30%\" cy=\"25%\" r=\"75%\"><stop offset=\"0%\" stop-color=\"#eaf4ff\"/><stop offset=\"55%\" stop-color=\"#93b4d9\"/><stop offset=\"100%\" stop-color=\"#3b5c85\"/></radialGradient>\n            </defs>\n            <rect x=\"6\" y=\"6\" width=\"88\" height=\"118\" rx=\"8\" fill=\"#0d1117\" stroke=\"#21262d\" stroke-width=\"2\"/>\n            <g stroke=\"#21262d\" stroke-width=\"1\">\n              <line x1=\"6\" y1=\"30\" x2=\"94\" y2=\"30\"/>\n              <line x1=\"6\" y1=\"54\" x2=\"94\" y2=\"54\"/>\n              <line x1=\"6\" y1=\"78\" x2=\"94\" y2=\"78\"/>\n              <line x1=\"6\" y1=\"102\" x2=\"94\" y2=\"102\"/>\n              <line x1=\"27\" y1=\"6\" x2=\"27\" y2=\"124\"/>\n              <line x1=\"50\" y1=\"6\" x2=\"50\" y2=\"124\"/>\n              <line x1=\"73\" y1=\"6\" x2=\"73\" y2=\"124\"/>\n            </g>\n            <rect x=\"27\" y=\"52\" width=\"46\" height=\"4\" rx=\"2\" fill=\"#c68a52\"/>\n            <rect x=\"71\" y=\"30\" width=\"4\" height=\"26\" rx=\"2\" fill=\"#c68a52\"/>\n            <circle cx=\"50\" cy=\"16\" r=\"8\" fill=\"url(#qcB)\"/>\n            <circle cx=\"50\" cy=\"114\" r=\"8\" fill=\"url(#qcA)\"/>\n          </svg>\n        </div>"
});
