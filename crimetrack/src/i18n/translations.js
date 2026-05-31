export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", dir: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", dir: "ltr" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", dir: "ltr" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", dir: "rtl" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", dir: "rtl" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", dir: "rtl" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪", dir: "ltr" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", dir: "ltr" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭", dir: "ltr" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", dir: "ltr" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", dir: "ltr" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾", dir: "ltr" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦", dir: "ltr" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴", dir: "ltr" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", dir: "ltr" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿", dir: "ltr" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺", dir: "ltr" },
];

export function getDir(lang) {
  const l = LANGUAGES.find(x => x.code === lang);
  return l?.dir || "ltr";
}

export function detectBrowserLanguage() {
  const bl = navigator.language?.split("-")[0];
  return LANGUAGES.find(l => l.code === bl)?.code || "en";
}

const T = {
  en: {
    appName: "CrimeTrack Universal", tagline: "Global Law Enforcement Intelligence Platform",
    dashboard: "Dashboard", cases: "Cases", suspects: "Suspects", evidence: "Evidence",
    officers: "Officers", newCase: "New Case", newSuspect: "New Suspect",
    addEvidence: "Add Evidence", signIn: "Sign In", logout: "Logout",
    loading: "Loading...", back: "Back", save: "Save", cancel: "Cancel",
    search: "Search...", filter: "Filter", status: "Status", priority: "Priority",
    open: "Open", solved: "Solved", closed: "Closed", critical: "Critical",
    high: "High", medium: "Medium", low: "Low", atLarge: "At Large",
    inCustody: "In Custody", wanted: "Wanted", totalCases: "Total Cases",
    openCases: "Open Cases", solvedCases: "Solved Cases", suspects: "Suspects",
    crimeType: "Crime Type", location: "Location", assignedOfficer: "Assigned Officer",
    incidentDate: "Incident Date", description: "Description", submit: "Submit",
    country: "Country", department: "Department", badgeNumber: "Badge #",
    rank: "Rank", clearanceLevel: "Clearance Level", threatLevel: "Threat Level",
    nationality: "Nationality", lastKnownLocation: "Last Known Location",
    interpol: "INTERPOL Notice", charges: "Charges", notes: "Notes",
    noResults: "No results found.", editCase: "Edit Case", viewDetails: "View Details",
    caseNumber: "Case #", alias: "Alias / AKA", recentCases: "Recent Cases",
    globalStats: "Global Statistics", activeCases: "Active Cases",
  },
  es: {
    appName: "CrimeTrack Universal", tagline: "Plataforma Global de Inteligencia Policial",
    dashboard: "Panel", cases: "Casos", suspects: "Sospechosos", evidence: "Evidencia",
    officers: "Oficiales", newCase: "Nuevo Caso", newSuspect: "Nuevo Sospechoso",
    addEvidence: "Agregar Evidencia", signIn: "Iniciar Sesión", logout: "Cerrar Sesión",
    loading: "Cargando...", back: "Atrás", save: "Guardar", cancel: "Cancelar",
    search: "Buscar...", filter: "Filtrar", status: "Estado", priority: "Prioridad",
    open: "Abierto", solved: "Resuelto", closed: "Cerrado", critical: "Crítico",
    high: "Alto", medium: "Medio", low: "Bajo", atLarge: "Prófugo",
    inCustody: "Bajo Custodia", wanted: "Buscado", totalCases: "Total de Casos",
    openCases: "Casos Abiertos", solvedCases: "Casos Resueltos", suspects: "Sospechosos",
    crimeType: "Tipo de Crimen", location: "Ubicación", assignedOfficer: "Oficial Asignado",
    incidentDate: "Fecha del Incidente", description: "Descripción", submit: "Enviar",
    country: "País", department: "Departamento", badgeNumber: "Placa #",
    rank: "Rango", clearanceLevel: "Nivel de Acceso", threatLevel: "Nivel de Amenaza",
    nationality: "Nacionalidad", lastKnownLocation: "Último Paradero Conocido",
    interpol: "Aviso INTERPOL", charges: "Cargos", notes: "Notas",
    noResults: "Sin resultados.", editCase: "Editar Caso", viewDetails: "Ver Detalles",
    caseNumber: "Caso #", alias: "Alias / AKA", recentCases: "Casos Recientes",
    globalStats: "Estadísticas Globales", activeCases: "Casos Activos",
  },
  fr: {
    appName: "CrimeTrack Universal", tagline: "Plateforme mondiale de renseignement policier",
    dashboard: "Tableau de bord", cases: "Affaires", suspects: "Suspects", evidence: "Preuves",
    officers: "Officiers", newCase: "Nouvelle Affaire", newSuspect: "Nouveau Suspect",
    addEvidence: "Ajouter une preuve", signIn: "Connexion", logout: "Déconnexion",
    loading: "Chargement...", back: "Retour", save: "Enregistrer", cancel: "Annuler",
    search: "Rechercher...", filter: "Filtrer", status: "Statut", priority: "Priorité",
    open: "Ouvert", solved: "Résolu", closed: "Fermé", critical: "Critique",
    high: "Élevé", medium: "Moyen", low: "Faible", atLarge: "En fuite",
    inCustody: "En garde à vue", wanted: "Recherché", totalCases: "Total des affaires",
    openCases: "Affaires ouvertes", solvedCases: "Affaires résolues", suspects: "Suspects",
    crimeType: "Type de crime", location: "Lieu", assignedOfficer: "Officier assigné",
    incidentDate: "Date de l'incident", description: "Description", submit: "Soumettre",
    country: "Pays", department: "Département", badgeNumber: "Badge #",
    rank: "Rang", clearanceLevel: "Niveau d'habilitation", threatLevel: "Niveau de menace",
    nationality: "Nationalité", lastKnownLocation: "Dernière position connue",
    interpol: "Notice INTERPOL", charges: "Charges", notes: "Notes",
    noResults: "Aucun résultat.", editCase: "Modifier l'affaire", viewDetails: "Voir les détails",
    caseNumber: "Affaire #", alias: "Alias / AKA", recentCases: "Affaires récentes",
    globalStats: "Statistiques mondiales", activeCases: "Affaires actives",
  },
};

export function t(lang, key) {
  return T[lang]?.[key] || T["en"]?.[key] || key;
}
