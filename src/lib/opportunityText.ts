import type { Opportunity } from "../data/content";
import { DEFAULT_LOCALE, containsCyrillic, normalizeLocale } from "./language";
import type { SupportedLocale } from "./language";

const fallbackTitle = "Opportunity from source announcement";
const fallbackDescription = "Details are available in the source announcement.";
const fallbackRequirements = "Review the source announcement for participation details.";

function clean(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function safeEnglish(value: string | null | undefined, fallback: string) {
  const nextValue = clean(value);

  return nextValue && !containsCyrillic(nextValue) ? nextValue : fallback;
}

export function getOpportunityTranslation(opportunity: Opportunity, locale: SupportedLocale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale);
  const translation = opportunity.translations?.[normalizedLocale] ?? opportunity.translations?.[DEFAULT_LOCALE];

  return {
    title: safeEnglish(translation?.title ?? opportunity.title, fallbackTitle),
    description: safeEnglish(translation?.description ?? opportunity.description, fallbackDescription),
    requirements: safeEnglish(translation?.requirements ?? opportunity.requirements, fallbackRequirements),
    summary: safeEnglish(translation?.summary ?? translation?.description ?? opportunity.description, fallbackDescription)
  };
}

export function getOpportunitySourceText(opportunity: Opportunity) {
  return [
    opportunity.sourceTitle,
    opportunity.sourceDescription,
    opportunity.sourceRequirements,
    opportunity.title,
    opportunity.description,
    opportunity.requirements
  ]
    .filter(Boolean)
    .join(" ");
}

export function getOpportunityDisplaySearchText(opportunity: Opportunity, locale: SupportedLocale = DEFAULT_LOCALE) {
  const display = getOpportunityTranslation(opportunity, locale);

  return [
    display.title,
    display.description,
    display.requirements,
    getOpportunitySourceText(opportunity)
  ]
    .filter(Boolean)
    .join(" ");
}

