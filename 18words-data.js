// Word pools bucketed by letter length, used to build each day's 18-round
// puzzle. No grid/crossing constraints here (unlike Crossword/Word Ladder),
// so words use natural spelling — accented Spanish vowels/ñ and correct
// Hebrew final letters are both fine.
const WORDS = {
  en: {
    4: ['DARK','SOAP','GOLD','FISH','MOON','STAR','BIRD','TREE','LAKE','SNOW','RAIN','WIND','FIRE','ROCK','SAND','LEAF','BONE','MILK','CORN','WOLF'],
    5: ['HOUSE','APPLE','GRAPE','MONEY','RIVER','CLOUD','BREAD','CHAIR','TABLE','HEART','SMILE','DANCE','LIGHT','NIGHT','MUSIC','HAPPY','WATER','EARTH','OCEAN','BEACH','STONE'],
    6: ['GARDEN','FLOWER','ISLAND','CASTLE','SILVER','ORANGE','PURPLE','YELLOW','WINTER','SUMMER','SPRING','DESERT','FOREST','BOTTLE','PENCIL','WINDOW','KITTEN','PUPPET','MARKET','PLANET'],
    7: ['DOLPHIN','PICTURE','KITCHEN','JOURNEY','FREEDOM','THUNDER','CRYSTAL','AIRPORT','HOLIDAY','CAPTAIN','CHICKEN','BLANKET','COMPASS','DIAMOND','VILLAGE','MORNING','EVENING','TEACHER','STUDENT'],
  },
  es: {
    4: ['CASA','BOCA','VIDA','AGUA','MESA','NIÑO','LUNA','MANO','PATO','GATO','ROPA','LAGO','NUBE','FLOR','CAFÉ','LEÓN','VELA','SOPA','PISO','RATO'],
    5: ['PLAYA','NOCHE','VERDE','DULCE','FUEGO','NIEVE','CIELO','LIBRO','PERRO','CARTA','FRUTA','LECHE','PLATO','MUNDO','CAMPO','PARED','TORRE','ÁRBOL','FINAL','PIANO'],
    6: ['FIESTA','VIENTO','DIENTE','PUENTE','VERANO','CAMINO','DINERO','COCINA','JARDÍN','NÚMERO','MAÑANA','SEMANA','MANTEL','CARIÑO','SONIDO','MOLINO','CAMISA','TESORO','SILLÓN','PALOMA'],
    7: ['ESCUELA','FAMILIA','VENTANA','BOTELLA','VESTIDO','CANCIÓN','PALABRA','ESPALDA','CORAZÓN','PAISAJE','CAMPANA','MANZANA','NARANJA','ENEMIGO','SILBIDO','PESCADO','TORTUGA','CAPITÁN','MOCHILA','PAQUETE'],
  },
  // No final letters (ם ן ץ ף ך) — a lone final-form tile reads oddly out of
  // context on the polygon layout, so every word here ends with a regular
  // letter instead.
  he: {
    3: ['שמש','בית','ילד','כלב','חלב','דבש','שלג','ערב','בקר','ספר','עיר','רוח','פרח','עלה','אור','דור','כוס','סוס','גור','שור','בור','צור'],
    4: ['שמלה','תפוח','כיסא','ילדה','גינה','מדבר','תפוז','בננה','לילה','כוכב','מפתח','צלחת','מחשב','גלגל','שקית','עגלה','דלעת','קסדה','רדיו','תריס'],
    5: ['תמונה','מסעדה','מטריה','מדינה','מספרה','תלמיד','גלידה','שמיכה','מקלחת','מדרגה','מצלמה','מרפאה','תעודה'],
  },
}

// Per-language round difficulty curve — 18 entries, each the letter length
// for that round. Hebrew stays shorter throughout since common Hebrew nouns
// rarely reach 6-7 letters (Word Ladder makes the same call, capping Hebrew
// at 3-letter words for the same reason).
const ROUND_LENGTHS = {
  en: [4,4,4,4, 5,5,5,5,5, 6,6,6,6,6, 7,7,7,7],
  es: [4,4,4,4, 5,5,5,5,5, 6,6,6,6,6, 7,7,7,7],
  he: [3,3,3,3,3,3, 4,4,4,4,4,4, 5,5,5,5,5,5],
}

const STRINGS = {
  title:        { en: '18 WORDS',                he: '18 מילים',              es: '18 PALABRAS' },
  tagline:      { en: 'Daily word challenge',     he: 'אתגר מילים יומי',       es: 'Desafío diario de palabras' },
  back:         { en: 'Games',                    he: 'משחקים',                es: 'Juegos' },
  wordProgress: { en: 'WORD',                     he: 'מילה',                  es: 'PALABRA' },
  today:        { en: "Today's Challenge",        he: 'האתגר של היום',         es: 'Desafío de hoy' },
  practice:     { en: 'Practice',                 he: 'תרגול',                 es: 'Práctica' },
  archive:      { en: 'Archive',                  he: 'ארכיון',                es: 'Archivo' },
  play:         { en: 'Play',                     he: 'שחק',                   es: 'Jugar' },
  playNow:      { en: 'Play now',                 he: 'שחק עכשיו',             es: 'Jugar ahora' },
  resume:       { en: 'Resume',                   he: 'המשך',                  es: 'Reanudar' },
  restart:      { en: 'Restart',                  he: 'התחל מחדש',             es: 'Reiniciar' },
  paused:       { en: 'Paused',                   he: 'מושהה',                 es: 'Pausado' },
  reveal:       { en: 'Reveal letter',             he: 'חשוף אות',              es: 'Revelar letra' },
  alreadyDone:  { en: "You've already played today's puzzle.", he: 'כבר שיחקת בחידה של היום.', es: 'Ya jugaste el desafío de hoy.' },
  playAgain:    { en: 'Play again',               he: 'שחק שוב',               es: 'Jugar de nuevo' },
  results:      { en: 'Results',                  he: 'תוצאות',                es: 'Resultados' },
  solvedOf:     { en: 'solved',                   he: 'נפתרו',                 es: 'resueltas' },
  hintsUsed:    { en: 'hints used',                he: 'רמזים שנוצלו',          es: 'pistas usadas' },
  totalTime:    { en: 'total time',                he: 'זמן כולל',              es: 'tiempo total' },
  shareScore:   { en: 'Share score',               he: 'שתף תוצאה',             es: 'Compartir resultado' },
  copied:       { en: 'Copied!',                   he: 'הועתק!',                es: '¡Copiado!' },
  timeUp:       { en: "Time's up!",                he: 'הזמן נגמר!',            es: '¡Se acabó el tiempo!' },
  backHome:     { en: 'Back to Games',             he: 'חזרה למשחקים',         es: 'Volver a Juegos' },
  archiveTitle: { en: 'Play a past puzzle',        he: 'שחק חידה קודמת',        es: 'Jugar un desafío anterior' },
  close:        { en: 'Close',                     he: 'סגור',                  es: 'Cerrar' },
  puzzleNum:    { en: 'Puzzle',                    he: 'חידה',                  es: 'Desafío' },
}
