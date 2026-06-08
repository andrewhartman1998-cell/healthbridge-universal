export const LANGUAGES = [
  {code:'en',name:'English',rtl:false},{code:'es',name:'Español',rtl:false},{code:'zh',name:'中文',rtl:false},
  {code:'hi',name:'हिन्दी',rtl:false},{code:'ar',name:'العربية',rtl:true},{code:'fr',name:'Français',rtl:false},
  {code:'bn',name:'বাংলা',rtl:false},{code:'pt',name:'Português',rtl:false},{code:'ru',name:'Русский',rtl:false},
  {code:'ur',name:'اردو',rtl:true},{code:'id',name:'Bahasa Indonesia',rtl:false},{code:'de',name:'Deutsch',rtl:false},
  {code:'ja',name:'日本語',rtl:false},{code:'sw',name:'Kiswahili',rtl:false},{code:'mr',name:'मराठी',rtl:false},
  {code:'te',name:'తెలుగు',rtl:false},{code:'tr',name:'Türkçe',rtl:false},{code:'ta',name:'தமிழ்',rtl:false},
  {code:'vi',name:'Tiếng Việt',rtl:false},{code:'ko',name:'한국어',rtl:false},{code:'it',name:'Italiano',rtl:false},
  {code:'fa',name:'فارسی',rtl:true},{code:'pl',name:'Polski',rtl:false},{code:'uk',name:'Українська',rtl:false},
  {code:'nl',name:'Nederlands',rtl:false},{code:'ms',name:'Bahasa Melayu',rtl:false},{code:'ro',name:'Română',rtl:false},
  {code:'th',name:'ภาษาไทย',rtl:false},{code:'el',name:'Ελληνικά',rtl:false},{code:'cs',name:'Čeština',rtl:false},
  {code:'hu',name:'Magyar',rtl:false},{code:'sv',name:'Svenska',rtl:false},{code:'da',name:'Dansk',rtl:false},
  {code:'fi',name:'Suomi',rtl:false},{code:'no',name:'Norsk',rtl:false},{code:'he',name:'עברית',rtl:true},
  {code:'sk',name:'Slovenčina',rtl:false},{code:'hr',name:'Hrvatski',rtl:false},{code:'bg',name:'Български',rtl:false},
  {code:'sr',name:'Српски',rtl:false},{code:'lt',name:'Lietuvių',rtl:false},{code:'sl',name:'Slovenščina',rtl:false},
  {code:'lv',name:'Latviešu',rtl:false},{code:'et',name:'Eesti',rtl:false},{code:'af',name:'Afrikaans',rtl:false},
  {code:'am',name:'አማርኛ',rtl:false},{code:'tl',name:'Filipino',rtl:false},{code:'my',name:'မြန်မာဘာသာ',rtl:false},
  {code:'km',name:'ខ្មែរ',rtl:false},{code:'ne',name:'नेपाली',rtl:false},
]

const EN = {
  appName:'BookWriter Global', tagline:'Write your book. In any language.',
  nav:{home:'Home',books:'My Books',write:'Write',outline:'Outline',goals:'Goals',export:'Export',genres:'Genres',writing_tools:'Writing Tools'},
  home:{hero:'Every person has a story worth telling.',heroSub:'BookWriter Global is a free, full-featured writing platform for authors everywhere — in 50 languages. Outline, draft, edit, and export your book. No account needed.',startBtn:'Start Writing',booksBtn:'My Books'},
  books:{title:'My Books',newBook:'+ New Book',noBooks:'No books yet. Start your first one!',chapters:'chapters',words:'words',open:'Open & Write',delete:'Delete'},
  newBook:{title:'Create New Book',bookTitle:'Book Title *',author:'Author Name',genre:'Genre',writingLang:'Writing Language',description:'Book Description / Premise',create:'Create Book',cancel:'Cancel'},
  write:{addChapter:'+ New Chapter',words:'words',saved:'Auto-saved',untitled:'Untitled Chapter',placeholder:'Start writing here...\n\nTip: Don\'t edit as you go. Just write. The first draft is about getting the story out of your head and onto the page.',focusMode:'Focus Mode',exitFocus:'Exit Focus',findReplace:'Find & Replace'},
  outline:{title:'Outline',synopsis:'Synopsis',addAct:'+ Add Act / Section',addScene:'+ Add Scene',actTitle:'Act / Section',sceneTitle:'Scene',notesPlaceholder:'Scene notes, beats, character arcs, key dialogue...'},
  goals:{title:'Writing Goals',dailyGoal:'Daily Word Goal',todayProgress:'Today\'s Progress',streak:'Day Streak',totalWritten:'Total Words Written',setGoal:'Set Goal',wordsToday:'words today',complete:'Complete!'},
  exportPage:{title:'Export Manuscript',download:'Download .txt',downloadDocx:'Copy for Word/Docs',preview:'Manuscript Preview',stats:'Stats',totalWords:'Total Words',chapters:'Chapters',readTime:'Reading Time',mins:'min read'},
  genres:{title:'Genre Writing Guides',subtitle:'Click a genre for structure, craft tips, word count targets, and famous examples.'},
  tools:{title:'Writing Tools',wordFreq:'Word Frequency',readability:'Readability Score',paceCheck:'Pacing Check',nameGen:'Character Name Generator',promptGen:'Writing Prompt Generator',generate:'Generate',analyze:'Analyze'},
}

const TRANSLATIONS = {
  en: EN,
  es: {...EN, appName:'BookWriter Global', tagline:'Escribe tu libro. En cualquier idioma.', nav:{...EN.nav,home:'Inicio',books:'Mis Libros',write:'Escribir',outline:'Esquema',goals:'Objetivos',export:'Exportar',genres:'Géneros',writing_tools:'Herramientas'}, home:{hero:'Cada persona tiene una historia que vale la pena contar.',heroSub:'BookWriter Global es una plataforma de escritura gratuita para autores de todo el mundo — en 50 idiomas.',startBtn:'Empezar a Escribir',booksBtn:'Mis Libros'}, books:{...EN.books,title:'Mis Libros',newBook:'+ Nuevo Libro',noBooks:'No hay libros aún.',chapters:'capítulos',words:'palabras',open:'Abrir',delete:'Eliminar'}, write:{...EN.write,addChapter:'+ Nuevo Capítulo',words:'palabras',saved:'Guardado',untitled:'Capítulo sin título',placeholder:'Empieza a escribir aquí...',focusMode:'Modo Enfoque',exitFocus:'Salir del Enfoque',findReplace:'Buscar y Reemplazar'}},
  fr: {...EN, tagline:'Écrivez votre livre. Dans n\'importe quelle langue.', nav:{...EN.nav,home:'Accueil',books:'Mes Livres',write:'Écrire',outline:'Plan',goals:'Objectifs',export:'Exporter',genres:'Genres',writing_tools:'Outils'}, home:{hero:'Chaque personne a une histoire qui vaut la peine d\'être racontée.',heroSub:'BookWriter Global est une plateforme d\'écriture gratuite pour les auteurs du monde entier.',startBtn:'Commencer à Écrire',booksBtn:'Mes Livres'}},
  de: {...EN, tagline:'Schreib dein Buch. In jeder Sprache.', nav:{...EN.nav,home:'Startseite',books:'Meine Bücher',write:'Schreiben',outline:'Gliederung',goals:'Ziele',export:'Exportieren',genres:'Genres',writing_tools:'Werkzeuge'}, home:{hero:'Jeder Mensch hat eine Geschichte, die es wert ist, erzählt zu werden.',heroSub:'BookWriter Global ist eine kostenlose Schreibplattform für Autoren weltweit.',startBtn:'Jetzt Schreiben',booksBtn:'Meine Bücher'}},
  ar: {...EN, tagline:'اكتب كتابك. بأي لغة.', nav:{...EN.nav,home:'الرئيسية',books:'كتبي',write:'الكتابة',outline:'المخطط',goals:'الأهداف',export:'تصدير',genres:'الأنواع',writing_tools:'الأدوات'}, home:{hero:'كل شخص لديه قصة تستحق أن تُروى.',heroSub:'BookWriter Global منصة كتابة مجانية للكتّاب في كل مكان — بـ 50 لغة.',startBtn:'ابدأ الكتابة',booksBtn:'كتبي'}},
  zh: {...EN, tagline:'用任何语言写你的书。', nav:{...EN.nav,home:'首页',books:'我的书',write:'写作',outline:'大纲',goals:'目标',export:'导出',genres:'类型',writing_tools:'写作工具'}, home:{hero:'每个人都有一个值得讲述的故事。',heroSub:'BookWriter Global 是一个面向全球作者的免费写作平台 — 支持50种语言。',startBtn:'立即开始写作',booksBtn:'我的书'}},
  pt: {...EN, tagline:'Escreva seu livro. Em qualquer idioma.', nav:{...EN.nav,home:'Início',books:'Meus Livros',write:'Escrever',outline:'Esboço',goals:'Metas',export:'Exportar',genres:'Gêneros',writing_tools:'Ferramentas'}, home:{hero:'Toda pessoa tem uma história que vale a pena contar.',heroSub:'BookWriter Global é uma plataforma de escrita gratuita para autores em todo o mundo.',startBtn:'Começar a Escrever',booksBtn:'Meus Livros'}},
  ru: {...EN, tagline:'Пишите свою книгу. На любом языке.', nav:{...EN.nav,home:'Главная',books:'Мои Книги',write:'Писать',outline:'Структура',goals:'Цели',export:'Экспорт',genres:'Жанры',writing_tools:'Инструменты'}, home:{hero:'У каждого человека есть история, достойная рассказа.',heroSub:'BookWriter Global — бесплатная платформа для писателей по всему миру.',startBtn:'Начать Писать',booksBtn:'Мои Книги'}},
  ja: {...EN, tagline:'あなたの本を書こう。どんな言語でも。', nav:{...EN.nav,home:'ホーム',books:'私の本',write:'執筆',outline:'アウトライン',goals:'目標',export:'エクスポート',genres:'ジャンル',writing_tools:'ツール'}, home:{hero:'すべての人に語るべき物語がある。',heroSub:'BookWriter Globalは、世界中の作家のための無料執筆プラットフォームです。50言語対応。',startBtn:'今すぐ書く',booksBtn:'私の本'}},
  ko: {...EN, tagline:'당신의 책을 쓰세요. 어떤 언어로든.', nav:{...EN.nav,home:'홈',books:'내 책',write:'쓰기',outline:'개요',goals:'목표',export:'내보내기',genres:'장르',writing_tools:'도구'}, home:{hero:'모든 사람에게는 말할 가치 있는 이야기가 있다.',heroSub:'BookWriter Global은 전 세계 작가를 위한 무료 글쓰기 플랫폼입니다.',startBtn:'지금 쓰기 시작',booksBtn:'내 책'}},
  it: {...EN, tagline:'Scrivi il tuo libro. In qualsiasi lingua.', nav:{...EN.nav,home:'Home',books:'I Miei Libri',write:'Scrivi',outline:'Schema',goals:'Obiettivi',export:'Esporta',genres:'Generi',writing_tools:'Strumenti'}, home:{hero:'Ogni persona ha una storia che merita di essere raccontata.',heroSub:'BookWriter Global è una piattaforma di scrittura gratuita per autori di tutto il mondo.',startBtn:'Inizia a Scrivere',booksBtn:'I Miei Libri'}},
}

LANGUAGES.forEach(l => { if (!TRANSLATIONS[l.code]) TRANSLATIONS[l.code] = {...EN, appName:`BookWriter (${l.name})`} })

export const useT = (lang) => TRANSLATIONS[lang] || TRANSLATIONS.en
