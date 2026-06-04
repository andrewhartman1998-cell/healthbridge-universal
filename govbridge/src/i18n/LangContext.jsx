import { createContext, useContext, useState, useEffect } from 'react';

export const languages = [
  { code: 'en', name: 'English', rtl: false }, { code: 'es', name: 'Español', rtl: false },
  { code: 'fr', name: 'Français', rtl: false }, { code: 'de', name: 'Deutsch', rtl: false },
  { code: 'pt', name: 'Português', rtl: false }, { code: 'it', name: 'Italiano', rtl: false },
  { code: 'ru', name: 'Русский', rtl: false }, { code: 'zh', name: '中文', rtl: false },
  { code: 'ja', name: '日本語', rtl: false }, { code: 'ko', name: '한국어', rtl: false },
  { code: 'ar', name: 'العربية', rtl: true }, { code: 'fa', name: 'فارسی', rtl: true },
  { code: 'ur', name: 'اردو', rtl: true }, { code: 'he', name: 'עברית', rtl: true },
  { code: 'hi', name: 'हिन्दी', rtl: false }, { code: 'bn', name: 'বাংলা', rtl: false },
  { code: 'tr', name: 'Türkçe', rtl: false }, { code: 'vi', name: 'Tiếng Việt', rtl: false },
  { code: 'th', name: 'ภาษาไทย', rtl: false }, { code: 'pl', name: 'Polski', rtl: false },
  { code: 'nl', name: 'Nederlands', rtl: false }, { code: 'sv', name: 'Svenska', rtl: false },
  { code: 'no', name: 'Norsk', rtl: false }, { code: 'da', name: 'Dansk', rtl: false },
  { code: 'fi', name: 'Suomi', rtl: false }, { code: 'cs', name: 'Čeština', rtl: false },
  { code: 'sk', name: 'Slovenčina', rtl: false }, { code: 'ro', name: 'Română', rtl: false },
  { code: 'hu', name: 'Magyar', rtl: false }, { code: 'el', name: 'Ελληνικά', rtl: false },
  { code: 'uk', name: 'Українська', rtl: false }, { code: 'id', name: 'Bahasa Indonesia', rtl: false },
  { code: 'ms', name: 'Bahasa Melayu', rtl: false }, { code: 'tl', name: 'Filipino', rtl: false },
  { code: 'sw', name: 'Kiswahili', rtl: false }, { code: 'am', name: 'አማርኛ', rtl: false },
  { code: 'yo', name: 'Yorùbá', rtl: false }, { code: 'ig', name: 'Igbo', rtl: false },
  { code: 'ha', name: 'Hausa', rtl: false }, { code: 'zu', name: 'isiZulu', rtl: false },
  { code: 'af', name: 'Afrikaans', rtl: false }, { code: 'ca', name: 'Català', rtl: false },
  { code: 'lt', name: 'Lietuvių', rtl: false }, { code: 'lv', name: 'Latviešu', rtl: false },
  { code: 'et', name: 'Eesti', rtl: false }, { code: 'sr', name: 'Српски', rtl: false },
  { code: 'hr', name: 'Hrvatski', rtl: false }, { code: 'bg', name: 'Български', rtl: false },
];

const T = {
  en: { appName: 'GovBridge Global', tagline: 'Every citizen deserves access to the benefits their government provides', nav: { finder: 'Benefits Finder', eligibility: 'Eligibility Check', apply: 'Apply Now', disability: 'Disability Access', emergency: 'Emergency Relief' }, hero: 'Your Government Owes You. Let\'s Find What.', sub: 'GovBridge connects citizens worldwide to disability benefits, housing assistance, food support, healthcare subsidies, unemployment insurance, veterans programs, and every other benefit your government provides — in plain language, in your language.', cta: 'Find My Benefits' },
  es: { appName: 'GovBridge Global', tagline: 'Todo ciudadano merece acceso a los beneficios que su gobierno provee', nav: { finder: 'Buscador', eligibility: 'Elegibilidad', apply: 'Solicitar', disability: 'Discapacidad', emergency: 'Emergencia' }, hero: 'Tu Gobierno Te Debe. Encontremos Qué.', sub: 'GovBridge conecta a ciudadanos de todo el mundo con beneficios de discapacidad, asistencia de vivienda, apoyo alimentario, subsidios de salud y mucho más.', cta: 'Encontrar Mis Beneficios' },
  fr: { appName: 'GovBridge Global', tagline: 'Chaque citoyen mérite d\'accéder aux aides de son gouvernement', nav: { finder: 'Recherche', eligibility: 'Éligibilité', apply: 'Demander', disability: 'Handicap', emergency: 'Urgence' }, hero: 'Votre Gouvernement Vous Doit. Découvrons Quoi.', sub: 'GovBridge connecte les citoyens du monde entier aux allocations d\'invalidité, aux aides au logement, aux subventions alimentaires et sanitaires.', cta: 'Trouver Mes Aides' },
  ar: { appName: 'GovBridge Global', tagline: 'كل مواطن يستحق الوصول إلى المزايا الحكومية', nav: { finder: 'البحث عن المزايا', eligibility: 'التحقق من الأهلية', apply: 'تقدم الآن', disability: 'إمكانية الوصول للإعاقة', emergency: 'الإغاثة الطارئة' }, hero: 'حكومتك مدينة لك. دعنا نكتشف ماذا.', sub: 'GovBridge يربط المواطنين في جميع أنحاء العالم بمزايا الإعاقة والإسكان والغذاء والرعاية الصحية والإغاثة في الطوارئ.', cta: 'ابحث عن مزاياي' },
  zh: { appName: 'GovBridge Global', tagline: '每位公民都应获得政府福利', nav: { finder: '福利查找', eligibility: '资格检查', apply: '立即申请', disability: '残障通道', emergency: '紧急救援' }, hero: '你的政府欠你的。让我们来找出。', sub: 'GovBridge将全球公民与残障福利、住房援助、食品支持、医疗补贴和紧急救援计划连接起来。', cta: '查找我的福利' },
};

function getT(lang) { return T[lang] || T['en']; }
const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('govbridge_lang') || 'en');
  const tr = getT(lang);
  const rtl = languages.find(l => l.code === lang)?.rtl || false;
  useEffect(() => {
    localStorage.setItem('govbridge_lang', lang);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, rtl]);
  return <LangContext.Provider value={{ lang, setLang, tr, rtl, languages }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
