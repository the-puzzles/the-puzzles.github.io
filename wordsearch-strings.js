// ── Word bank ─────────────────────────────────────────────────────────────
// Hebrew: final forms (ם ן ף ך ץ) are NOT used — only base forms.
// generatePuzzle() calls normalizeHebrew() on all he words at runtime.
const WORD_BANK = {
  animals: {
    en: ['CAT','DOG','LION','WOLF','BEAR','OWL','DEER','EAGLE','FOX','FROG','DUCK','FISH','LLAMA','CHEETAH','LEOPARD','SHARK','CRAB','BEE','BEETLE','ANT','PANDA','KOALA','BAT'],
    he: ['חתול','כלב','אריה','זאב','דוב','ינשוף','איל','נשר','שועל','צפרדע','ברווז','דג', 'למה', 'ציטה', 'נמר', 'כריש', 'סרטן', 'דבורה', 'חיפושית', 'נמלה', 'פנדה', 'קואלה', 'עטלף'],
    es: ['GATO','PERRO','LEON','LOBO','OSO','BUHO','CIERVO','AGUILA','ZORRO','RANA','PATO','PEZ','LLAMA','GUEPARDO','LEOPARDO','TIBURON','CANGREJO','ABEJA','ESCARABAJO','HORMIGA','PANDA','KOALA','MURCIELAGO'],
    ar: ['قط','كلب','أسد','ذئب','دب','بوم','ظبي','نسر','ثعلب','ضفدع','بطة','سمك','لاما','فهد','نمر','قرش','سرطان','نحلة','خنفساء','نملة','باندا','كوالا','خفاش']
  },
  colors: {
    en: ['RED','BLUE','GREEN','GOLD','PINK','GREY','TEAL','LIME','RUBY','CYAN','ROSE','NAVY','YELLOW','BLACK','WHITE','SILVER'],
    he: ['צהוב','שחור','לבן','אפור','כסף','אדום','כחול','ירוק','זהב','ורוד','טורקיז','ליים','רובי','ציאן','ורד','נייבי'],
    es: ['ROJO','AZUL','VERDE','ORO','ROSA','GRIS','LILA','CIAN','RUBI','CORAL','LIMA','OCRE','AMARILLO','NEGRO','BLANCO','PLATA'],
    ar: ['أحمر','أزرق','أخضر','ذهبي','وردي','رمادي','أبيض','أسود','أصفر','بني','زيتوني','فيروزي','فضي']
  },
  space: {
    en: ['MOON','STAR','MARS','NEPTUNE','SPACESHIP','VENUS','COMET','ORBIT','NEBULA','SATURN','PULSAR','QUASAR','GALAXY','METEOR','SATELLITE','ASTEROID','ECLIPSE','SUPERNOVA','TELESCOPE','JUPITER','ROCKET'],
    he: ['ירח','כוכב','מאדים','נוגה','שביט','מסלול','ערפילית','שבתאי','פולסר','קוואזר','גלקסיה','מטאור','נפטון','חללית','לוויין','אסטרואיד','ליקוי','סופרנובה','טלסקופ','צדק','רקטה'],
    es: ['LUNA','ESTRELLA','MARTE','VENUS','COMETA','ORBITA','NEBULA','SATURNO','PULSAR','GALAXIA','METEORO','COSMOS','NEPTUNO','NAVE','SATELITE','ASTEROIDE','ECLIPSE','SUPERNOVA','TELESCOPIO','JUPITER','COHETE'],
    ar: ['قمر','نجم','مريخ','زهرة','مذنب','مدار','سديم','زحل','مجرة','كويكب','نيزك','كون','نبتون','مركبة','تابع','أستيرويد','خسوف','مستعر','تلسكوب','مشتري','صاروخ']
  },
  food: {
    en: ['RICE','CORN','SOUP','CAKE','PLUM','OLIVE','BREAD','MANGO','PIZZA','LEMON','GRAPE','TOFU','SOY','HUMMUS','ORANGE','PEAR','LENTILS','AVOCADO','FALAFEL'],
    he: ['אורז','תירס','מרק','עוגה','שזיף','זית','לחם','מנגו','פיצה','לימון','ענב','טופו','סויה','חומוס','תפוז','אגס','עדשים','אבוקדו','פלאפל'],
    es: ['ARROZ','MAIZ','SOPA','PASTEL','CIRUELA','OLIVA','PAN','MANGO','PIZZA','LIMON','UVA','QUESO','TOFU','SOJA','HUMMUS','NARANJA','PERA','LENTEJAS','AGUACATE','FALAFEL'],
    ar: ['أرز','ذرة','حساء','كعكة','برقوق','زيتون','خبز','مانجو','بيتزا','ليمون','عنب','توفو','صويا','حمص','برتقال','كمثرى','عدس','أفوكادو','فلافل']
  },
  sports: {
    en: ['SOCCER','TENNIS','BOXING','RUGBY','GOLF','SWIMMING','CYCLING','HOCKEY','POLO','CHESS','SURFING','YOGA','CLIMBING'],
    he: ['כדורגל','טניס','אגרוף','רוגבי','גולף','שחייה','רכיבה','הוקי','פולו','שחמט','גלישה','יוגה','טיפוס'],
    es: ['FUTBOL','TENIS','BOXEO','RUGBY','GOLF','NATACION','CICLISMO','HOCKEY','POLO','AJEDREZ','SURF','YOGA','ESCALADA'],
    ar: ['كرة','تنس','ملاكمة','ركبي','غولف','سباحة','دراجة','هوكي','بولو','شطرنج','تزلج','يوغا','تسلق']
  },
  nature: {
    en: ['RIVER','OCEAN','FOREST','DESERT','LAKE','VOLCANO','CAVE','GLACIER','CANYON','VALLEY','ISLAND','CLIFF'],
    he: ['נהר','אוקיינוס','יער','מדבר','אגם','הר','מערה','קרחון','קניון','עמק','אי','מצוק'],
    es: ['RIO','OCEANO','BOSQUE','DESIERTO','LAGO','VOLCAN','CUEVA','GLACIAR','CANON','VALLE','ISLA','ROCA'],
    ar: ['نهر','محيط','غابة','صحراء','بحيرة','بركان','كهف','جليد','وادي','جزيرة','جبل','شلال']
  },
  cities: {
    en: ['PARIS','ROME','TOKYO','CAIRO','DELHI','LIMA','OSLO','DUBAI','BERLIN','MIAMI','SYDNEY','SEOUL'],
    he: ['פריז','רומא','טוקיו','קהיר','דלהי','לימה','אוסלו','דובאי','ברלין','מיאמי','סידני','סיאול'],
    es: ['PARIS','ROMA','TOKIO','CAIRO','DELHI','LIMA','OSLO','DUBAI','BERLIN','MIAMI','SIDNEY','SEUL'],
    ar: ['باريس','روما','طوكيو','القاهرة','دلهي','ليما','أوسلو','دبي','برلين','ميامي','سيدني','سيول']
  },
  body: {
    en: ['HEAD','EYE','EAR','NOSE','MOUTH','ARM','LEG','HAND','FOOT','HEART','BACK','KNEE'],
    he: ['ראש','עין','אוזן','אף','פה','יד','רגל','לב','גב','ברך','אצבע','גוף'],
    es: ['CABEZA','OJO','OREJA','NARIZ','BOCA','BRAZO','PIERNA','MANO','PIE','CORAZON','ESPALDA','RODILLA'],
    ar: ['رأس','عين','أذن','أنف','فم','يد','رجل','قلب','ظهر','ركبة','إصبع','جسم']
  }
};

const CATEGORIES = [
  { id: 'animals', label: { en: '🐾 Animals',  he: '🐾 חיות',   es: '🐾 Animales',    ar: '🐾 حيوانات' } },
  { id: 'colors',  label: { en: '🎨 Colors',   he: '🎨 צבעים',  es: '🎨 Colores',     ar: '🎨 ألوان'   } },
  { id: 'space',   label: { en: '🚀 Space',    he: '🚀 חלל',    es: '🚀 Espacio',     ar: '🚀 فضاء'    } },
  { id: 'food',    label: { en: '🍕 Food',     he: '🍕 אוכל',   es: '🍕 Comida',      ar: '🍕 طعام'    } },
  { id: 'sports',  label: { en: '🏅 Sports',   he: '🏅 ספורט',  es: '🏅 Deportes',    ar: '🏅 رياضة'   } },
  { id: 'nature',  label: { en: '🌿 Nature',   he: '🌿 טבע',    es: '🌿 Naturaleza',  ar: '🌿 طبيعة'   } },
  { id: 'cities',  label: { en: '🏙️ Cities',  he: '🏙️ ערים',  es: '🏙️ Ciudades',   ar: '🏙️ مدن'    } },
  { id: 'body',    label: { en: '🫀 Body',     he: '🫀 גוף',    es: '🫀 Cuerpo',      ar: '🫀 جسم'     } }
];

const STRINGS = {
  back:         { en:'← All Games', he:'כל המשחקים →', es:'← Todos los juegos', ar:'كل الألعاب →' },
  reset:        { en:'reset', he:'איפוס', es:'reiniciar', ar:'إعادة' },
  title:        { en:'WORDSEARCH', he:'מצאו מילים', es:'BUSCA PALABRAS', ar:'بحث الكلمات' },
  tagline:      { en:'Find hidden words — one word hides in secret', he:'מצאו את המילים הנסתרות — ומילה אחת מסתתרת בצורה חשאית', es:'Encuentra las palabras ocultas — una se esconde en secreto', ar:'ابحث عن الكلمات المخفية — وكلمة واحدة تختبئ سراً' },
  wordsToFind:  { en:'WORDS TO FIND', he:'מילים לחיפוש', es:'PALABRAS A HALLAR', ar:'كلمات للبحث' },
  huntMsg:      { en:'All words found! Now hunt the mystery word…', he:'מצאתם את כל המילים! עכשיו חפשו את המילה הנסתרת...', es:'¡Todas encontradas! Busca la palabra misteriosa…', ar:'وجدت كل الكلمات! ابحث الآن عن الكلمة الغامضة…' },
  wonMsg:       { en:'You found them all! Well done!', he:'כל הכבוד! מצאתם את כולן!', es:'¡Las encontraste todas! ¡Bien hecho!', ar:'وجدتها جميعاً! أحسنت!' },
  overlayTitle: { en:'🎉 Solved!', he:'🎉 כל הכבוד!', es:'🎉 ¡Resuelto!', ar:'🎉 أحسنت!' },
  overlaySub:   { en:'You found all hidden words including the mystery word!', he:'מצאתם את כל המילים הנסתרות כולל המילה המסתורית!', es:'¡Encontraste todas las palabras, incluso la misteriosa!', ar:'وجدت كل الكلمات المخفية بما فيها الكلمة الغامضة!' },
  newPuzzle:    { en:'New Puzzle →', he:'פאזל חדש →', es:'Nuevo juego →', ar:'لعبة جديدة →' },
  confirmReset: { en:'Reset current puzzle?', he:'לאפס את הפאזל הנוכחי?', es:'¿Reiniciar el puzzle actual?', ar:'هل تريد إعادة تعيين اللغز؟' },
  hint:         { en:'Hint', he:'רמז', es:'Pista', ar:'تلميح' },
  earlyMsg:     { en:'✨ Mystery word found early! Finish the list…', he:'✨ מצאתם את המילה הנסתרת! המשיכו לגלות את שאר המילים...', es:'✨ ¡Palabra misteriosa encontrada! Termina la lista…', ar:'✨ وجدت الكلمة الغامضة مبكراً! أكمل القائمة…' }
};
