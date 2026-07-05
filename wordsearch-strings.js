// ── Word bank ─────────────────────────────────────────────────────────────
// Hebrew: final forms (ם ן ף ך ץ) are NOT used — only base forms.
// generatePuzzle() calls normalizeHebrew() on all he words at runtime.
const WORD_BANK = {
  animals: {
    en: ['CAT','DOG','LION','WOLF','BEAR','OWL','DEER','EAGLE','FOX','FROG','DUCK','FISH','LLAMA','CHEETAH','LEOPARD','SHARK','CRAB','BEE','BEETLE','ANT','PANDA','KOALA','BAT','TIGER','ELEPHANT','ZEBRA','MONKEY','PENGUIN','DOLPHIN','RABBIT','SNAKE','TURTLE','CAMEL','KANGAROO','HORSE','COW','SHEEP','GOAT','MOUSE','OCTOPUS','CHAMELEON','RHINOCEROS','ARMADILLO','FLAMINGO','HEDGEHOG','GORILLA','OSTRICH','SQUIRREL','BUTTERFLY'],
    he: ['חתול','כלב','אריה','זאב','דוב','ינשוף','איל','נשר','שועל','צפרדע','ברווז','דג', 'למה', 'ציטה', 'נמר', 'כריש', 'סרטן', 'דבורה', 'חיפושית', 'נמלה', 'פנדה', 'קואלה', 'עטלף','טיגריס','פיל','זברה','קוף','פינגווין','דולפין','ארנב','נחש','צב','גמל','קנגורו','סוס','פרה','כבש','עז','עכבר','תמנון','זיקית','קרנף','ארמדילו','פלמינגו','קיפוד','גורילה','יען','סנאי','פרפר'],
    es: ['GATO','PERRO','LEON','LOBO','OSO','BUHO','CIERVO','AGUILA','ZORRO','RANA','PATO','PEZ','LLAMA','GUEPARDO','LEOPARDO','TIBURON','CANGREJO','ABEJA','ESCARABAJO','HORMIGA','PANDA','KOALA','MURCIELAGO','TIGRE','ELEFANTE','CEBRA','MONO','PINGUINO','DELFIN','CONEJO','SERPIENTE','TORTUGA','CAMELLO','CANGURO','CABALLO','VACA','OVEJA','CABRA','RATON','PULPO','CAMALEON','RINOCERONTE','ARMADILLO','FLAMENCO','ERIZO','GORILA','AVESTRUZ','ARDILLA','MARIPOSA'],
    ar: ['قط','كلب','أسد','ذئب','دب','بوم','ظبي','نسر','ثعلب','ضفدع','بطة','سمك','لاما','فهد','نمر','قرش','سرطان','نحلة','خنفساء','نملة','باندا','كوالا','خفاش','فيل','قرد','بطريق','دولفين','أرنب','ثعبان','سلحفاة','جمل','كنغر','حصان','بقرة','خروف','ماعز','فأر','أخطبوط','حرباء','كركدن','أرمديلو','فلامنغو','قنفذ','غوريلا','نعامة','سنجاب','فراشة']
  },
  colors: {
    en: ['RED','BLUE','GREEN','GOLD','PINK','GREY','TEAL','LIME','RUBY','CYAN','ROSE','NAVY','YELLOW','BLACK','WHITE','SILVER','PURPLE','ORANGE','BROWN','GRAY','VIOLET','CORAL','SCARLET','OCHRE','SAND','JADE','MAROON','CRIMSON','IVORY','INDIGO','AMBER','LAVENDER','MAGENTA','KHAKI','CHARCOAL','AQUAMARINE'],
    he: ['צהוב','שחור','לבן','אפור','כסף','אדום','כחול','ירוק','זהב','ורוד','טורקיז','ליים','רובי','ציאן','ורד','נייבי','סגול','כתום','חום','תכלת','לילך','ברונזה','שני','שמנת','חול','ירקן','בורדו','ארגמן','שנהב','אינדיגו','ענבר','לבנדר','מגנטה','חאקי','פחם','אקוומרין'],
    es: ['ROJO','AZUL','VERDE','ORO','ROSA','GRIS','LILA','CIAN','RUBI','CORAL','LIMA','OCRE','AMARILLO','NEGRO','BLANCO','PLATA','MORADO','NARANJA','MARRON','TURQUESA','VIOLETA','ESCARLATA','ARENA','JADE','GRANATE','CARMESI','MARFIL','INDIGO','AMBAR','LAVANDA','MAGENTA','CAQUI','CARBON','AGUAMARINA'],
    ar: ['أحمر','أزرق','أخضر','ذهبي','وردي','رمادي','أبيض','أسود','أصفر','بني','زيتوني','فيروزي','فضي','بنفسجي','برتقالي','أرجواني','مرجاني','قرمزي','مغرة','رملي','يشمي','كستنائي','عاجي','نيلي','كهرماني','خزامي','ماجنتا','كاكي','فحمي']
  },
  space: {
    en: ['MOON','STAR','MARS','NEPTUNE','SPACESHIP','VENUS','COMET','ORBIT','NEBULA','SATURN','PULSAR','QUASAR','GALAXY','METEOR','SATELLITE','ASTEROID','ECLIPSE','SUPERNOVA','TELESCOPE','JUPITER','ROCKET'],
    he: ['ירח','כוכב','מאדים','נוגה','שביט','מסלול','ערפילית','שבתאי','פולסר','קוואזר','גלקסיה','מטאור','נפטון','חללית','לוויין','אסטרואיד','ליקוי','סופרנובה','טלסקופ','צדק','רקטה'],
    es: ['LUNA','ESTRELLA','MARTE','VENUS','COMETA','ORBITA','NEBULA','SATURNO','PULSAR','GALAXIA','METEORO','COSMOS','NEPTUNO','NAVE','SATELITE','ASTEROIDE','ECLIPSE','SUPERNOVA','TELESCOPIO','JUPITER','COHETE'],
    ar: ['قمر','نجم','مريخ','زهرة','مذنب','مدار','سديم','زحل','مجرة','كويكب','نيزك','كون','نبتون','مركبة','تابع','أستيرويد','خسوف','مستعر','تلسكوب','مشتري','صاروخ']
  },
  food: {
    en: ['RICE','CORN','SOUP','CAKE','PLUM','OLIVE','BREAD','MANGO','PIZZA','LEMON','GRAPE','TOFU','SOY','HUMMUS','ORANGE','PEAR','LENTILS','AVOCADO','FALAFEL','PASTA','LENTIL','GARLIC','ONION','TOMATO','BANANA','CHOCOLATE','SYRUP','SALAD','APPLE','CARROT','CUCUMBER','MELON','STRAWBERRY','BROCCOLI','CELERY','PEANUT','ARTICHOKE','POMEGRANATE','ASPARAGUS','CINNAMON','WATERMELON','EGGPLANT','SPINACH','MUSHROOM','COCONUT','PINEAPPLE','PEPPER'],
    he: ['אורז','תירס','מרק','עוגה','שזיף','זית','לחם','מנגו','פיצה','לימון','ענב','טופו','סויה','חומוס','תפוז','אגס','עדשים','אבוקדו','פלאפל','פסטה','עדשה','שום','בצל','עגבניה','בננה','שוקולד','סירופ','סלט','תפוח','גזר','מלפפון','מלון','תות','ברוקולי','סלרי','בוטן','ארטישוק','רימון','אספרגוס','קינמון','אבטיח','חציל','תרד','פטרייה','קוקוס','אננס','פלפל'],
    es: ['ARROZ','MAIZ','SOPA','PASTEL','CIRUELA','OLIVA','PAN','MANGO','PIZZA','LIMON','UVA','QUESO','TOFU','SOJA','HUMMUS','NARANJA','PERA','LENTEJAS','AGUACATE','FALAFEL','PASTA','LENTEJA','AJO','CEBOLLA','TOMATE','PLATANO','CHOCOLATE','JARABE','ENSALADA','MANZANA','ZANAHORIA','PEPINO','MELON','FRESA','BROCOLI','APIO','ACEITUNA','MANI','ALCACHOFA','GRANADA','ESPARRAGO','CANELA','SANDIA','BERENJENA','ESPINACA','HONGO','COCO','ANANAS','PIMIENTO'],
    ar: ['أرز','ذرة','حساء','كعكة','برقوق','زيتون','خبز','مانجو','بيتزا','ليمون','عنب','توفو','صويا','حمص','برتقال','كمثرى','عدس','أفوكادو','فلافل','معكرونة','ثوم','بصل','طماطم','موز','شوكولاتة','شراب','سلطة','تفاح','جزر','خيار','شمام','فراولة','بروكلي','كرفس','خرشوف','رمان','هليون','قرفة','بطيخ','باذنجان','سبانخ','فطر','أناناس','فلفل']
  },
  sports: {
    en: ['SOCCER','TENNIS','BOXING','RUGBY','GOLF','SWIMMING','CYCLING','HOCKEY','POLO','CHESS','SURFING','YOGA','CLIMBING','BOWLING','ARCHERY','FENCING','SKIING','WRESTLING','BASEBALL','SKATING','ROWING','DARTS','SQUASH','MARATHON','TAEKWONDO','SUMO','SNOWBOARDING','BADMINTON','GYMNASTICS','TRIATHLON','VOLLEYBALL','HANDBALL','KARATE','CRICKET','RUNNING','SAILING','DIVING','BASKETBALL'],
    he: ['כדורגל','טניס','אגרוף','רוגבי','גולף','שחייה','רכיבה','הוקי','פולו','שחמט','גלישה','יוגה','טיפוס','באולינג','קשתות','סייף','סקי','היאבקות','בייסבול','החלקה','חתירה','דארטס','סקווש','מרתון','טאקוונדו','סומו','סנובורד','בדמינטון','התעמלות','טריאתלון','כדורעף','כדוריד','קראטה','קריקט','ריצה','שייט','צלילה','כדורסל'],
    es: ['FUTBOL','TENIS','BOXEO','RUGBY','GOLF','NATACION','CICLISMO','HOCKEY','POLO','AJEDREZ','SURF','YOGA','ESCALADA','BOLOS','ARQUERIA','ESGRIMA','ESQUI','LUCHA','BEISBOL','PATINAJE','REMO','DARDOS','SQUASH','MARATON','TAEKWONDO','SUMO','SNOWBOARD','BADMINTON','GIMNASIA','TRIATLON','VOLEIBOL','BALONMANO','KARATE','CRICKET','CARRERA','VELA','BUCEO','BALONCESTO'],
    ar: ['كرة','تنس','ملاكمة','ركبي','غولف','سباحة','دراجة','هوكي','بولو','شطرنج','تزلج','يوغا','تسلق','بولينج','رماية','مبارزة','مصارعة','بيسبول','تجديف','سهام','اسكواش','ماراثون','تايكوندو','سومو','بادمنتون','جمباز','ترياثلون','كاراتيه','كريكيت','جري','إبحار','غوص']
  },
  nature: {
    en: ['RIVER','OCEAN','FOREST','DESERT','LAKE','VOLCANO','CAVE','GLACIER','CANYON','VALLEY','ISLAND','CLIFF'],
    he: ['נהר','אוקיינוס','יער','מדבר','אגם','הר','מערה','קרחון','קניון','עמק','אי','מצוק'],
    es: ['RIO','OCEANO','BOSQUE','DESIERTO','LAGO','VOLCAN','CUEVA','GLACIAR','CANON','VALLE','ISLA','ROCA'],
    ar: ['نهر','محيط','غابة','صحراء','بحيرة','بركان','كهف','جليد','وادي','جزيرة','جبل','شلال']
  },
  cities: {
    en: ['PARIS','ROME','TOKYO','CAIRO','DELHI','LIMA','OSLO','DUBAI','BERLIN','MIAMI','SYDNEY','SEOUL','JERUSALEM','HAIFA','WASHINGTON','BARCELONA','STOCKHOLM','AQABA'],
    he: ['פריז','רומא','טוקיו','קהיר','דלהי','לימה','אוסלו','דובאי','ברלין','מיאמי','סידני','סיאול','ירושלים','חיפה','וושינגטון','ברצלונה','סטוקהולם','עקבה'],
    es: ['PARIS','ROMA','TOKIO','CAIRO','DELHI','LIMA','OSLO','DUBAI','BERLIN','MIAMI','SIDNEY','SEUL','JERUSALEN','HAIFA','WASHINGTON','BARCELONA','ESTOCOLMO','AQABA'],
    ar: ['باريس','روما','طوكيو','القاهرة','دلهي','ليما','أوسلو','دبي','برلين','ميامي','سيدني','سيول','القدس','حيفا','واشنطن','برشلونة','ستوكهولم','العقبة']
  },
  body: {
    en: ['HEAD','EYE','EAR','NOSE','MOUTH','ARM','LEG','HAND','FOOT','HEART','BACK','KNEE','SHOULDER','FINGER'],
    he: ['ראש','עין','אוזן','אף','פה','יד','רגל','לב','גב','ברך','אצבע','גוף','כתף'],
    es: ['CABEZA','OJO','OREJA','NARIZ','BOCA','BRAZO','PIERNA','MANO','PIE','CORAZON','ESPALDA','RODILLA','HOMBRO','DEDO'],
    ar: ['رأس','عين','أذن','أنف','فم','يد','رجل','قلب','ظهر','ركبة','إصبع','جسم','كتف']
  },
  science: {
    en: ['ATOM','ENERGY','GRAVITY','OXYGEN','CELL','VIRUS','PLANET','GALAXY','MAGNET','VACCINE','CHEMISTRY','BIOLOGY','FOSSIL','BACTERIA','ELECTRON','MOON','STAR','RAINBOW','CLOUD','ICE','DINOSAUR','THUNDER','LIGHTNING','SKELETON','COMET','EVOLUTION','MOLECULE','ECOSYSTEM','RADIATION','HORMONE','FRICTION','TELESCOPE','ORBIT','CRYSTAL','METEOR'],
    he: ['אטום','אנרגיה','כבידה','חמצן','תא','נגיף','פלנטה','גלקסיה','מגנט','חיסון','כימיה','ביולוגיה','מאובן','חיידק','אלקטרון','ירח','כוכב','קשת','ענן','קרח','דינוזאור','רעם','ברק','שלד','שביט','פוטוסינתזה','אבולוציה','מולקולה','אקוסיסטמה','קרינה','הורמון','חיכוך','טלסקופ','מסלול','גביש','מטאור'],
    es: ['ATOMO','ENERGIA','GRAVEDAD','OXIGENO','CELULA','VIRUS','PLANETA','GALAXIA','IMAN','VACUNA','QUIMICA','BIOLOGIA','FOSIL','BACTERIA','ELECTRON','LUNA','ESTRELLA','ARCOIRIS','NUBE','HIELO','DINOSAURIO','TRUENO','RAYO','ESQUELETO','COMETA','FOTOSINTESIS','EVOLUCION','MOLECULA','ECOSISTEMA','RADIACION','HORMONA','FRICCION','TELESCOPIO','ORBITA','CRISTAL','METEORO'],
    ar: ['ذرة','طاقة','جاذبية','أكسجين','خلية','فيروس','كوكب','مجرة','مغناطيس','لقاح','كيمياء','أحياء','أحفورة','بكتيريا','إلكترون','قمر','نجم','سحابة','جليد','ديناصور','رعد','برق','هيكل','مذنب','تطور','جزيء','إشعاع','هرمون','احتكاك','تلسكوب','مدار','بلورة','نيزك']
  },
  geography: {
    en: ['FRANCE','JAPAN','BRAZIL','EGYPT','CANADA','ITALY','MEXICO','RUSSIA','CHINA','INDIA','GREECE','PERU','TURKEY','GERMANY','ISRAEL','SPAIN','ENGLAND','IRELAND','POLAND','HOLLAND','SWITZERLAND','AUSTRIA','DENMARK','FINLAND','SCOTLAND','ARGENTINA','AUSTRALIA','NORWAY','THAILAND','MOROCCO','ICELAND','PORTUGAL','VIETNAM','KENYA','SWEDEN','COLOMBIA'],
    he: ['צרפת','יפן','ברזיל','מצרים','קנדה','איטליה','מקסיקו','רוסיה','סין','הודו','יוון','פרו','טורקיה','גרמניה','ישראל','ספרד','אנגליה','אירלנד','פולין','הולנד','שוויץ','אוסטריה','דנמרק','פינלנד','סקוטלנד','ארגנטינה','אוסטרליה','נורווגיה','תאילנד','מרוקו','איסלנד','פורטוגל','וייטנאם','קניה','שוודיה','קולומביה'],
    es: ['FRANCIA','JAPON','BRASIL','EGIPTO','CANADA','ITALIA','MEXICO','RUSIA','CHINA','INDIA','GRECIA','PERU','TURQUIA','ALEMANIA','ISRAEL','ESPANA','INGLATERRA','IRLANDA','POLONIA','HOLANDA','SUIZA','AUSTRIA','DINAMARCA','FINLANDIA','ESCOCIA','ARGENTINA','AUSTRALIA','NORUEGA','TAILANDIA','MARRUECOS','ISLANDIA','PORTUGAL','VIETNAM','KENIA','SUECIA','COLOMBIA'],
    ar: ['فرنسا','اليابان','البرازيل','مصر','كندا','إيطاليا','المكسيك','روسيا','الصين','الهند','اليونان','بيرو','تركيا','ألمانيا','إسرائيل','إسبانيا','إنجلترا','أيرلندا','بولندا','هولندا','سويسرا','النمسا','الدنمارك','فنلندا','اسكتلندا','الأرجنتين','أستراليا','النرويج','تايلاند','المغرب','آيسلندا','البرتغال','فيتنام','كينيا','السويد','كولومبيا']
  },
  music: {
    en: ['GUITAR','PIANO','DRUM','VIOLIN','FLUTE','TRUMPET','SONG','MELODY','RHYTHM','CHOIR','CONCERT','ORCHESTRA','HARMONY','LYRICS','BAND','SAXOPHONE','CLARINET','HARP','ACCORDION','TAMBOURINE','SYMPHONY','CONDUCTOR','COMPOSER','TROMBONE','XYLOPHONE','SERENADE'],
    he: ['גיטרה','פסנתר','תוף','כינור','חליל','חצוצרה','שיר','מנגינה','קצב','מקהלה','קונצרט','תזמורת','הרמוניה','מילים','להקה','סקסופון','קלרינט','נבל','אקורדיון','טמבורין','סימפוניה','מנצח','מלחין','טרומבון','קסילופון','סרנדה'],
    es: ['GUITARRA','PIANO','TAMBOR','VIOLIN','FLAUTA','TROMPETA','CANCION','MELODIA','RITMO','CORO','CONCIERTO','ORQUESTA','ARMONIA','LETRA','BANDA','SAXOFON','CLARINETE','ARPA','ACORDEON','PANDERETA','SINFONIA','DIRECTOR','COMPOSITOR','TROMBON','XILOFONO','SERENATA'],
    ar: ['جيتار','بيانو','طبل','كمان','ناي','بوق','أغنية','لحن','إيقاع','جوقة','حفلة','أوركسترا','انسجام','كلمات','فرقة','ساكسفون','كلارينيت','قيثارة','أكورديون','دف','سيمفونية','قائد','ملحن','ترومبون','إكسيلوفون','سيرينادة']
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
  { id: 'body',    label: { en: '🫀 Body',     he: '🫀 גוף',    es: '🫀 Cuerpo',      ar: '🫀 جسم'     } },
  { id: 'science',   label: { en: '🔬 Science',   he: '🔬 מדע',      es: '🔬 Ciencia',    ar: '🔬 علم' } },
  { id: 'geography', label: { en: '🌍 Geography', he: '🌍 גאוגרפיה', es: '🌍 Geografía',  ar: '🌍 جغرافيا' } },
  { id: 'music',     label: { en: '🎵 Music',     he: '🎵 מוזיקה',   es: '🎵 Música',     ar: '🎵 موسيقى' } }
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
