import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useT } from "../lib/i18n";

type HeroSectionProps = {
  onLogin: () => void;
  onStartJourney: () => void;
};

export function HeroSection({ onLogin, onStartJourney }: HeroSectionProps) {
  const t = useT();
  const navLinks = [
    { href: "#match-console", label: t.nav.matches },
    { href: "#courses", label: t.nav.courses },
    { href: "#mentorlm", label: t.nav.mentorLM },
    { href: "#faq", label: t.nav.faq }
  ];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="grain" aria-hidden="true" />
      <svg className="ethno-route" viewBox="0 0 180 760" aria-hidden="true" focusable="false">
        <path d="M92 14 C24 98 144 174 72 260 C12 332 128 414 80 500 C36 580 116 640 66 734" />
        <circle cx="92" cy="14" r="6" />
        <circle cx="72" cy="260" r="6" />
        <circle cx="80" cy="500" r="6" />
        <circle cx="66" cy="734" r="6" />
      </svg>

      <div className="hero-inner">
        <ThemeToggle className="hero-theme-toggle" />
        <LanguageSwitcher className="hero-language-switcher" />
        <button className="hero-login-button" type="button" onClick={onLogin}>
          {t.hero.login}
        </button>

        <nav className="hero-rail" aria-label={t.nav.sections}>
          <a className="wordmark" href="#hero-title" aria-label={t.nav.home}>
            {t.productName}
          </a>
          <div className="rail-links">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">{t.hero.title}</h1>
            <p className="promise">{t.hero.promise}</p>
            <p className="all-in-one">{t.hero.allInOne}</p>
            <p className="hero-lede">
              <span className="hero-inline-chip">{t.hero.chip}</span>
              {t.hero.lede}
            </p>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={onStartJourney}>
                <span>{t.hero.start}</span>
                <span className="button-mark" aria-hidden="true">
                  &gt;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
