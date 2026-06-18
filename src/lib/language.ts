export const supportedLocales = ["en", "ru", "kk"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const languageNames: Record<SupportedLocale, string> = {
  en: "English",
  ru: "Russian",
  kk: "Қазақша"
};

export const localeStorageKey = "mentoria.locale";

const cyrillicPattern = /[\u0400-\u04FF]/;

export function containsCyrillic(value: string | null | undefined) {
  return Boolean(value && cyrillicPattern.test(value));
}

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

export function normalizeLocale(value: string | null | undefined): SupportedLocale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

export function getInitialLocale(): SupportedLocale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  return normalizeLocale(window.localStorage.getItem(localeStorageKey));
}

export function setStoredLocale(locale: SupportedLocale) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(localeStorageKey, locale);
}

export function getLocaleName(locale: SupportedLocale) {
  return languageNames[locale];
}

export function formatDate(locale: SupportedLocale, value: Date | string | number) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(locale === "en" ? "en-US" : locale === "ru" ? "ru-RU" : "kk-KZ", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
