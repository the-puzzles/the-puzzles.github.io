CATEGORIES.find(c=>c.label==="Classic Games").games.push({
  "id": "mancala",
  "title": "MANCALA",
  "title_he": "מנקלה",
  "icon": "🌰",
  "href": "mancala.html",
  "accent": "#d97706",
  "shadow": "rgba(217,119,6,0.15)",
  "iconBg": "#2a1705",
  "gradient": "linear-gradient(135deg,#d97706,#0d9488)",
  "btnBg": "#2a1705",
  "btnColor": "#fbbf24",
  "playLabel": "Play Mancala",
  "tagline": "Sow seeds pit by pit around the board. Land your last seed in your store for an extra turn, or in an empty pit to capture your opponent's seeds.",
  "tagline_he": "זרעו גרעינים מבור לבור סביב הלוח. אם הגרעין האחרון נוחת באוצר שלכם תזכו בתור נוסף, ואם הוא נוחת בבור ריק שלכם — תתפסו את גרעיני היריב שממול.",
  "rules": [
    "6 pits and a store per side, 4 seeds per pit",
    "Last seed in your own store earns another turn",
    "Last seed in an empty pit of yours captures the opposite pit",
    "Most seeds in your store when a side empties out wins",
    "2-player mode or vs computer (Easy / Medium / Hard)"
  ],
  "rules_he": [
    "6 בורות ואוצר לכל צד, 4 גרעינים בכל בור",
    "אם הגרעין האחרון נוחת באוצר שלכם, מקבלים תור נוסף",
    "אם הגרעין האחרון נוחת בבור ריק שלכם, תופסים גם אותו וגם את הבור שממול",
    "מי שיש לו הכי הרבה גרעינים באוצר כשצד מתרוקן מנצח",
    "שני שחקנים או נגד מחשב (קל / בינוני / קשה)"
  ],
  "preview": "<div class=\"preview\" style=\"grid-template-columns:1fr;padding:10px 14px;background:linear-gradient(170deg,#5c3c22,#3d2716 55%,#4c3119)\">\n          <svg viewBox=\"0 0 100 200\" style=\"width:80px;height:160px;display:block;margin:0 auto\">\n            <defs>\n              <radialGradient id=\"mcA\" cx=\"30%\" cy=\"25%\" r=\"75%\"><stop offset=\"0%\" stop-color=\"#ffe4b5\"/><stop offset=\"55%\" stop-color=\"#f59e0b\"/><stop offset=\"100%\" stop-color=\"#92400e\"/></radialGradient>\n              <radialGradient id=\"mcT\" cx=\"30%\" cy=\"25%\" r=\"75%\"><stop offset=\"0%\" stop-color=\"#cffafe\"/><stop offset=\"55%\" stop-color=\"#2dd4bf\"/><stop offset=\"100%\" stop-color=\"#0f5c52\"/></radialGradient>\n            </defs>\n            <rect x=\"6\" y=\"2\" width=\"88\" height=\"22\" rx=\"11\" fill=\"#1a0d04\" stroke=\"#0f5c52\" stroke-width=\"2\"/>\n            <circle cx=\"16\" cy=\"13\" r=\"3\" fill=\"url(#mcT)\"/>\n            <rect x=\"6\" y=\"176\" width=\"88\" height=\"22\" rx=\"11\" fill=\"#1a0d04\" stroke=\"#7c4a10\" stroke-width=\"2\"/>\n            <circle cx=\"16\" cy=\"187\" r=\"3\" fill=\"url(#mcA)\"/>\n            <circle cx=\"32\" cy=\"52\" r=\"13\" fill=\"#150c04\" stroke=\"#7c4a10\" stroke-width=\"2\"/>\n            <circle cx=\"27\" cy=\"47\" r=\"2.6\" fill=\"url(#mcA)\"/><circle cx=\"37\" cy=\"47\" r=\"2.6\" fill=\"url(#mcA)\"/>\n            <rect x=\"24\" y=\"53\" width=\"16\" height=\"9\" rx=\"4.5\" fill=\"rgba(8,5,2,0.75)\"/>\n            <circle cx=\"68\" cy=\"52\" r=\"13\" fill=\"#150c04\" stroke=\"#0f5c52\" stroke-width=\"2\"/>\n            <circle cx=\"63\" cy=\"47\" r=\"2.6\" fill=\"url(#mcT)\"/><circle cx=\"73\" cy=\"47\" r=\"2.6\" fill=\"url(#mcT)\"/>\n            <rect x=\"60\" y=\"53\" width=\"16\" height=\"9\" rx=\"4.5\" fill=\"rgba(8,5,2,0.75)\"/>\n            <circle cx=\"32\" cy=\"92\" r=\"13\" fill=\"#150c04\" stroke=\"#7c4a10\" stroke-width=\"2\"/>\n            <circle cx=\"27\" cy=\"87\" r=\"2.6\" fill=\"url(#mcA)\"/><circle cx=\"37\" cy=\"87\" r=\"2.6\" fill=\"url(#mcA)\"/>\n            <rect x=\"24\" y=\"93\" width=\"16\" height=\"9\" rx=\"4.5\" fill=\"rgba(8,5,2,0.75)\"/>\n            <circle cx=\"68\" cy=\"92\" r=\"13\" fill=\"#150c04\" stroke=\"#0f5c52\" stroke-width=\"2\"/>\n            <circle cx=\"63\" cy=\"87\" r=\"2.6\" fill=\"url(#mcT)\"/><circle cx=\"73\" cy=\"87\" r=\"2.6\" fill=\"url(#mcT)\"/>\n            <rect x=\"60\" y=\"93\" width=\"16\" height=\"9\" rx=\"4.5\" fill=\"rgba(8,5,2,0.75)\"/>\n            <circle cx=\"32\" cy=\"132\" r=\"13\" fill=\"#150c04\" stroke=\"#7c4a10\" stroke-width=\"2\"/>\n            <circle cx=\"27\" cy=\"127\" r=\"2.6\" fill=\"url(#mcA)\"/><circle cx=\"37\" cy=\"127\" r=\"2.6\" fill=\"url(#mcA)\"/>\n            <rect x=\"24\" y=\"133\" width=\"16\" height=\"9\" rx=\"4.5\" fill=\"rgba(8,5,2,0.75)\"/>\n            <circle cx=\"68\" cy=\"132\" r=\"13\" fill=\"#150c04\" stroke=\"#0f5c52\" stroke-width=\"2\"/>\n            <circle cx=\"63\" cy=\"127\" r=\"2.6\" fill=\"url(#mcT)\"/><circle cx=\"73\" cy=\"127\" r=\"2.6\" fill=\"url(#mcT)\"/>\n            <rect x=\"60\" y=\"133\" width=\"16\" height=\"9\" rx=\"4.5\" fill=\"rgba(8,5,2,0.75)\"/>\n            <text x=\"32\" y=\"60.5\" font-size=\"8\" fill=\"#f0e6d2\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"800\">4</text>\n            <text x=\"68\" y=\"60.5\" font-size=\"8\" fill=\"#f0e6d2\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"800\">4</text>\n            <text x=\"32\" y=\"100.5\" font-size=\"8\" fill=\"#f0e6d2\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"800\">4</text>\n            <text x=\"68\" y=\"100.5\" font-size=\"8\" fill=\"#f0e6d2\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"800\">4</text>\n            <text x=\"32\" y=\"140.5\" font-size=\"8\" fill=\"#f0e6d2\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"800\">4</text>\n            <text x=\"68\" y=\"140.5\" font-size=\"8\" fill=\"#f0e6d2\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"800\">4</text>\n            <text x=\"50\" y=\"17\" font-size=\"12\" fill=\"#2dd4bf\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"800\">0</text>\n            <text x=\"50\" y=\"191\" font-size=\"12\" fill=\"#f59e0b\" text-anchor=\"middle\" font-family=\"sans-serif\" font-weight=\"800\">0</text>\n          </svg>\n        </div>"
});
