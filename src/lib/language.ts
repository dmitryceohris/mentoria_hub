export const supportedLocales = ["en", "ru", "kk"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const languageNames: Record<SupportedLocale, string> = {
  en: "English",
  ru: "Russian",
  kk: "Kazakh"
};

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

