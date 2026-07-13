CATEGORIES.find(c=>c.label==='Words').games.push({
  id: 'splice', title: 'SPLICE', title_he: 'ספרייס', title_es: 'SPLICE', icon: '🔤', href: 'splice.html',
  accent: '#38bdf8', shadow: 'rgba(56,189,248,0.15)', iconBg: '#0c1d2e',
  gradient: 'linear-gradient(135deg,#38bdf8,#818cf8)',
  btnBg: '#0c1d2e', btnColor: '#7dd3fc',
  playLabel: 'Play Splice',
  tagline: 'Letters sit in a connected grid. Trace a path through adjacent nodes to spell hidden words — no clues, just connections.',
  tagline_he: 'אותיות יושבות ברשת מחוברת. סמנו נתיב דרך צמתים סמוכים כדי לאיית מילים חבויות — בלי הגדרות, רק חיבורים.',
  tagline_es: 'Las letras están en una cuadrícula conectada. Traza un camino por nodos adyacentes para deletrear palabras ocultas — sin pistas, solo conexiones.',
  rules: [
    'Tap a letter node to start your path',
    'Continue tapping adjacent nodes to spell a word',
    'Tap the last node again to backtrack',
    'Find all hidden words to win — English · Hebrew · Spanish',
  ],
  rules_he: [
    'הקישו על צומת אות כדי להתחיל את הנתיב',
    'המשיכו להקיש על צמתים סמוכים כדי לאיית מילה',
    'הקישו שוב על הצומת האחרון כדי לחזור אחורה',
    'מצאו את כל המילים החבויות כדי לנצח — אנגלית · עברית · ספרדית',
  ],
  rules_es: [
    'Toca un nodo de letra para empezar tu camino',
    'Sigue tocando nodos adyacentes para deletrear una palabra',
    'Toca el último nodo de nuevo para retroceder',
    'Encuentra todas las palabras ocultas para ganar — inglés · hebreo · español',
  ],
  preview: `<svg viewBox="0 0 130 100" width="130" height="100" style="display:block;margin:0 auto">
    <line x1="25" y1="25" x2="65" y2="25" stroke="#21262d" stroke-width="2"/>
    <line x1="65" y1="25" x2="105" y2="25" stroke="#21262d" stroke-width="2"/>
    <line x1="25" y1="25" x2="65" y2="65" stroke="#21262d" stroke-width="2"/>
    <line x1="65" y1="25" x2="25" y2="65" stroke="#21262d" stroke-width="2"/>
    <line x1="65" y1="25" x2="65" y2="65" stroke="#21262d" stroke-width="2"/>
    <line x1="65" y1="25" x2="105" y2="65" stroke="#21262d" stroke-width="2"/>
    <line x1="105" y1="25" x2="65" y2="65" stroke="#21262d" stroke-width="2"/>
    <line x1="25" y1="65" x2="65" y2="65" stroke="#21262d" stroke-width="2"/>
    <line x1="65" y1="65" x2="105" y2="65" stroke="#21262d" stroke-width="2"/>
    <line x1="25" y1="65" x2="65" y2="25" stroke="#38bdf8" stroke-width="3" opacity=".8"/>
    <line x1="65" y1="25" x2="105" y2="65" stroke="#38bdf8" stroke-width="3" opacity=".8"/>
    <circle cx="25" cy="25" r="14" fill="#0a1929" stroke="#67e8f9" stroke-width="2.5"/>
    <text x="25" y="25" dy=".36em" text-anchor="middle" fill="#e0f2fe" font-size="11" font-weight="800" font-family="system-ui">C</text>
    <circle cx="65" cy="25" r="14" fill="#0a1929" stroke="#38bdf8" stroke-width="2"/>
    <text x="65" y="25" dy=".36em" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800" font-family="system-ui">A</text>
    <circle cx="105" cy="25" r="14" fill="#0a1929" stroke="#38bdf8" stroke-width="2"/>
    <text x="105" y="25" dy=".36em" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800" font-family="system-ui">T</text>
    <circle cx="25" cy="65" r="14" fill="#13181f" stroke="#1c2230" stroke-width="1.5"/>
    <text x="25" y="65" dy=".36em" text-anchor="middle" fill="#30363d" font-size="11" font-weight="800" font-family="system-ui">N</text>
    <circle cx="65" cy="65" r="14" fill="#13181f" stroke="#1c2230" stroke-width="1.5"/>
    <text x="65" y="65" dy=".36em" text-anchor="middle" fill="#30363d" font-size="11" font-weight="800" font-family="system-ui">U</text>
    <circle cx="105" cy="65" r="14" fill="#0a1929" stroke="#67e8f9" stroke-width="3.5"/>
    <text x="105" y="65" dy=".36em" text-anchor="middle" fill="#e0f2fe" font-size="11" font-weight="800" font-family="system-ui">R</text>
  </svg>`,
});
