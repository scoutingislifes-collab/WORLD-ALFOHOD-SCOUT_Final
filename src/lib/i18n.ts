import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

export type LanguageCode =
  | "ar" | "en" | "fr" | "es" | "de" | "zh" | "ru" | "pt" | "it" | "tr"
  | "ja" | "ko" | "hi" | "id" | "ms" | "nl" | "fa" | "he" | "ur" | "sw";

export const RTL_LANGS: LanguageCode[] = ["ar", "fa", "he", "ur"];

export type LanguageMeta = {
  code: LanguageCode;
  name: string;       // Native name
  english: string;    // English label (for accessibility)
  flag: string;       // Flag emoji
};

export const LANGUAGES: LanguageMeta[] = [
  { code: "ar", name: "العربية",      english: "Arabic",     flag: "🇸🇦" },
  { code: "en", name: "English",      english: "English",    flag: "🇬🇧" },
  { code: "fr", name: "Français",     english: "French",     flag: "🇫🇷" },
  { code: "es", name: "Español",      english: "Spanish",    flag: "🇪🇸" },
  { code: "de", name: "Deutsch",      english: "German",     flag: "🇩🇪" },
  { code: "zh", name: "中文",          english: "Chinese",    flag: "🇨🇳" },
  { code: "ru", name: "Русский",      english: "Russian",    flag: "🇷🇺" },
  { code: "pt", name: "Português",    english: "Portuguese", flag: "🇵🇹" },
  { code: "it", name: "Italiano",     english: "Italian",    flag: "🇮🇹" },
  { code: "tr", name: "Türkçe",       english: "Turkish",    flag: "🇹🇷" },
  { code: "ja", name: "日本語",        english: "Japanese",   flag: "🇯🇵" },
  { code: "ko", name: "한국어",        english: "Korean",     flag: "🇰🇷" },
  { code: "hi", name: "हिन्दी",         english: "Hindi",      flag: "🇮🇳" },
  { code: "id", name: "Indonesia",    english: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Melayu",       english: "Malay",      flag: "🇲🇾" },
  { code: "nl", name: "Nederlands",   english: "Dutch",      flag: "🇳🇱" },
  { code: "fa", name: "فارسی",        english: "Persian",    flag: "🇮🇷" },
  { code: "he", name: "עברית",        english: "Hebrew",     flag: "🇮🇱" },
  { code: "ur", name: "اردو",          english: "Urdu",       flag: "🇵🇰" },
  { code: "sw", name: "Kiswahili",    english: "Swahili",    flag: "🇰🇪" },
];

export const SUPPORTED_LANGS = LANGUAGES.map(l => l.code);

export function isRTL(code: string): boolean {
  return RTL_LANGS.includes(code as LanguageCode);
}

export function applyLanguageDirection(code: string) {
  const dir = isRTL(code) ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", code);
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGS,
    ns: ["common"],
    defaultNS: "common",
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "alfohod_lang",
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  .then(() => {
    applyLanguageDirection(i18n.resolvedLanguage || i18n.language || "ar");
  });

i18n.on("languageChanged", (lng) => applyLanguageDirection(lng));
i18n.on("initialized", () => {
  applyLanguageDirection(i18n.resolvedLanguage || i18n.language || "ar");
});

export default i18n;
