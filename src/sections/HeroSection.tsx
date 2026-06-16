import { navLinks } from "../data/content";

type HeroSectionProps = {
  onStartJourney: () => void;
  onDemoLogin: () => void;
};

export function HeroSection({ onStartJourney, onDemoLogin }: HeroSectionProps) {
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
        <nav className="hero-rail" aria-label="Mentoria Hub sections">
          <a className="wordmark" href="#hero-title" aria-label="Mentoria Hub home">
            Mentoria Hub
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
            <h1 id="hero-title">Mentoria Hub</h1>
            <p className="promise">With you on your way to your dream</p>
            <div className="keyword-band" aria-label="Mentoria Hub learning and opportunity areas">
              <span>SAT</span>
              <span>IELTS</span>
              <span>Courses</span>
              <span>Opportunity Search</span>
            </div>
            <p className="all-in-one">.. all in one place</p>
            <p className="hero-lede">
              Find competitions, scholarships, internships, and summer schools that fit your profile, then keep learning
              through Mentoria&apos;s own SAT, IELTS, and subject courses.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={onStartJourney}>
                <span>Start your journey</span>
                <span className="button-mark" aria-hidden="true">
                  &gt;
                </span>
              </button>
              <button className="button button-secondary" type="button" onClick={onDemoLogin}>
                <span>Try demo</span>
              </button>
            </div>
          </div>

          <div className="illustration-reserve" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
