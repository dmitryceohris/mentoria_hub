import type { ReactNode } from "react";

type Opportunity = {
  title: string;
  description: string;
};

type Course = {
  track: string;
  title: string;
  description: string;
};

type ConsoleShellProps = {
  title: string;
  titleId?: string;
  intro?: string;
  coreClassName?: string;
  children: ReactNode;
};

const opportunities: Opportunity[] = [
  {
    title: "Almaty Physics Battles 2026",
    description:
      "An international team-based physics competition for secondary school students, held in Almaty, Kazakhstan. Teams join through online selection stages."
  },
  {
    title: "International Young Physicists' Tournament 2026",
    description:
      "A team-based physics tournament for high school students, taking place July 5-12, 2026 in Zurich, Switzerland, with research, experiments, and scientific discussion."
  },
  {
    title: "Beamline for Schools 2026",
    description:
      "A CERN, DESY, and ELSA physics proposal competition where high-school teams design an experiment for a particle accelerator beamline."
  },
  {
    title: "Online Physics Olympiad Invitational 2026",
    description:
      "An online physics contest pathway with an invitational round held August 30-September 1 and international participation from physics students."
  }
];

const courses: Course[] = [
  {
    track: "Mentoria English",
    title: "Beginner IELTS",
    description: "Free course for first IELTS structure, vocabulary, and weekly practice habits."
  },
  {
    track: "Mentoria Science",
    title: "Introduction to Biology",
    description: "Free course for cells, genetics, ecosystems, and research thinking basics."
  },
  {
    track: "Mentoria Physics",
    title: "Introduction to Theoretical Physics",
    description: "Free course for mechanics, models, problem solving, and mathematical intuition."
  }
];

const faqItems = [
  {
    question: "Who is Mentoria Hub for?",
    answer: "Students in grades 8-11 who want to find opportunities and prepare through Mentoria courses.",
    open: true
  },
  {
    question: "What opportunities can students find?",
    answer:
      "Competitions, scholarships, internships, summer schools, research programs, and similar education paths."
  },
  {
    question: "Are Mentoria courses included?",
    answer: "Yes. Courses can support language tests, science tracks, and application preparation."
  },
  {
    question: "What happens after saving an opportunity?",
    answer: "The student can keep it in the dashboard with preparation notes and next steps."
  }
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Zm5.2-1.4 4.2 4.2" />
    </svg>
  );
}

function SaveButton() {
  return (
    <button className="save-button" type="button">
      Save
    </button>
  );
}

function ConsoleShell({ title, titleId, intro, coreClassName = "", children }: ConsoleShellProps) {
  return (
    <div className={`console-core ${coreClassName}`.trim()}>
      <div className="console-frame" aria-hidden="true" />
      <header className="console-header">
        <div>
          <h2 id={titleId}>{title}</h2>
          {intro ? <p className="console-intro">{intro}</p> : null}
        </div>
      </header>
      {children}
    </div>
  );
}

function OpportunityRow({ opportunity, featured = false }: { opportunity: Opportunity; featured?: boolean }) {
  return (
    <article className={`opportunity-row${featured ? " opportunity-row-iypt" : ""}`}>
      <div className="opportunity-row-main">
        <h3>{opportunity.title}</h3>
        <p>{opportunity.description}</p>
      </div>
      <SaveButton />
    </article>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <div className="course-visual" aria-hidden="true" />
      <span>{course.track}</span>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </article>
  );
}

function HeroSection() {
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
            <a href="#match-console">Matches</a>
            <a href="#courses">Courses</a>
            <a href="#companion">MentorPet</a>
            <a href="#mentors">Mentors</a>
            <a href="#faq">FAQ</a>
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
              <a className="button button-primary" href="#match-console">
                <span>Start your journey</span>
                <span className="button-mark" aria-hidden="true">
                  &gt;
                </span>
              </a>
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

function OpportunitySearchSection() {
  return (
    <section className="match-section" id="match-console" aria-labelledby="match-section-title">
      <div className="match-copy">
        <h2 id="match-section-title">Find programs that fit your profile</h2>
        <p>
          Search competitions, scholarships, internships, summer schools, and courses from one focused Mentoria
          workspace.
        </p>
      </div>

      <div className="match-console match-console-dock" aria-labelledby="console-title">
        <ConsoleShell title="Opportunity Search" titleId="console-title">
          <div className="showcase-search" aria-label="Search query">
            <SearchIcon />
            <span>physics competitions</span>
          </div>

          <div className="criteria-grid" aria-label="Selected opportunity filters">
            <div className="criteria-select">
              <span className="criteria-label">Direction</span>
              <span className="criteria-value">Physics</span>
            </div>
            <div className="criteria-select">
              <span className="criteria-label">Format</span>
              <span className="criteria-value">Any</span>
            </div>
            <div className="criteria-select">
              <span className="criteria-label">Location</span>
              <span className="criteria-value">Global</span>
            </div>
            <div className="criteria-select">
              <span className="criteria-label">Grade</span>
              <span className="criteria-value">Grade 10</span>
            </div>
            <div className="criteria-select">
              <span className="criteria-label">Type</span>
              <span className="criteria-value">Competition</span>
            </div>
          </div>

          <div className="result-panel" aria-label="Opportunity showcase">
            <p className="result-heading">4 matched opportunities</p>
            <OpportunityRow opportunity={opportunities[0]} />
            <div className="iypt-popover-anchor">
              <OpportunityRow opportunity={opportunities[1]} featured />
              <aside
                className="opportunity-popover"
                aria-label="More information about International Young Physicists' Tournament 2026"
              >
                <strong>International Young Physicists&apos; Tournament</strong>
                <p>
                  Teams prepare original research and discuss their solutions through Physics Fights. The 2026
                  tournament is hosted in Zurich.
                </p>
                <a href="https://www.iypt.org/" target="_blank" rel="noreferrer">
                  https://www.iypt.org/
                </a>
              </aside>
            </div>
            <OpportunityRow opportunity={opportunities[2]} />
            <OpportunityRow opportunity={opportunities[3]} />
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}

function SavedOpportunitiesSection() {
  return (
    <section className="product-section" id="features" aria-labelledby="saved-title">
      <div className="match-copy product-copy">
        <h2 id="saved-title">Keep every next step visible</h2>
        <p>Save programs from search, watch deadlines, and keep course preparation attached to the same student workspace.</p>
      </div>

      <div className="product-console saved-console" aria-label="Saved opportunities dashboard preview">
        <ConsoleShell
          title="Student dashboard"
          intro="A quiet workspace for saved programs, prep tasks, and mentor handoff."
          coreClassName="product-core"
        >
          <div className="dashboard-grid">
            <article className="dashboard-row">
              <strong>International Young Physicists&apos; Tournament 2026</strong>
              <span>Research outline and national selection prep</span>
            </article>
            <article className="dashboard-row">
              <strong>Beamline for Schools 2026</strong>
              <span>Draft experiment proposal with mentor review</span>
            </article>
            <article className="dashboard-row dashboard-row-soft">
              <strong>Course prep</strong>
              <span>Physics fundamentals, academic English, and writing support stay linked to saved opportunities.</span>
            </article>
          </div>
          <div className="dashboard-placeholder">More saved programs will appear here as the student builds a shortlist.</div>
        </ConsoleShell>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section className="product-section courses-section" id="courses" aria-labelledby="courses-title">
      <div className="match-copy product-copy">
        <h2 id="courses-title">Free courses that support the journey</h2>
        <p>
          Mentoria courses sit beside opportunity search, so students can prepare for language tests, science tracks, and
          applications in one place.
        </p>
      </div>

      <div className="product-console course-console" aria-label="Mentoria courses preview">
        <ConsoleShell title="Course library" intro="Search is a visual placeholder for the course catalog." coreClassName="product-core">
          <div className="showcase-search course-search" aria-label="Course search placeholder">
            <SearchIcon />
            <span>Search Mentoria courses</span>
          </div>
          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard course={course} key={course.title} />
            ))}
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}

function CompanionSection() {
  return (
    <section className="product-section companion-section" id="companion" aria-labelledby="companion-title">
      <div className="match-copy product-copy">
        <h2 id="companion-title">MentorPet keeps context close</h2>
        <p>
          MentorPet can add personal notes to course programs, remind students what to do next, and notify them through a
          Telegram add-on.
        </p>
      </div>

      <div className="product-console companion-console" aria-label="MentorPet notes and Telegram reminders preview">
        <ConsoleShell title="Notes and reminders" intro="A placeholder view for course notes and Telegram nudges." coreClassName="product-core">
          <div className="companion-notes">
            <article>
              <strong>Beginner IELTS</strong>
              <p>Add a personal note: practice listening before school on Tuesday and Thursday.</p>
            </article>
            <article>
              <strong>Physics prep</strong>
              <p>Telegram reminder: review experiment notes two days before the mentor session.</p>
            </article>
            <article id="mentors">
              <strong>Human mentor handoff</strong>
              <p>When an application needs judgment, MentorPet keeps the context ready for a mentor.</p>
            </article>
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="match-copy product-copy faq-copy">
        <h2 id="faq-title">Quick answers</h2>
        <p>A few basics for students, schools, and Mentoria partners.</p>
      </div>

      <div className="faq-console" aria-label="Frequently asked questions">
        {faqItems.map((item) => (
          <details key={item.question} open={item.open}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function App() {
  return (
    <main>
      <HeroSection />
      <OpportunitySearchSection />
      <SavedOpportunitiesSection />
      <CoursesSection />
      <CompanionSection />
      <FaqSection />
    </main>
  );
}
