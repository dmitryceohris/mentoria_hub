import { getSupportedLocaleOptions, useLocale, useT } from "../lib/i18n";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const options = getSupportedLocaleOptions();

  return (
    <div className={`language-switcher ${className}`.trim()} aria-label={t.language.aria} role="group">
      <span className="language-switcher-label">{t.language.label}</span>
      <div className="language-switcher-options">
        {options.map((option) => (
          <button
            aria-label={t.language.switchTo(option.name)}
            aria-pressed={locale === option.locale}
            className={locale === option.locale ? "is-active" : ""}
            key={option.locale}
            type="button"
            onClick={() => setLocale(option.locale)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
