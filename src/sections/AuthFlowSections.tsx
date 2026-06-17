import type { FormEvent } from "react";
import {
  courses,
  formatOpportunityDeadline,
  getOptionLabel,
  getOptionLabels,
  getRecommendedCourses,
  getRecommendedOpportunities,
  hasUpcomingDeadline,
  onboardingQuestions,
  opportunities
} from "../data/content";
import type { Course, OnboardingProfile, OnboardingQuestion, Opportunity } from "../data/content";

export type AuthMode = "signup" | "signin";

export type RegistrationForm = {
  name: string;
  email: string;
  password: string;
};

export type RegistrationFieldErrors = Partial<Record<keyof RegistrationForm, string>>;

export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  grade: string;
  interests: string[];
  academicDirection: string;
  opportunityPreferences: {
    directions: string[];
    formats: string[];
    locations: string[];
  };
};

type FlowTopBarProps = {
  eyebrow: string;
  onBack?: () => void;
  onLogout?: () => void;
};

function FlowTopBar({ eyebrow, onBack, onLogout }: FlowTopBarProps) {
  return (
    <nav className="flow-topbar" aria-label="Mentoria Hub workspace navigation">
      <span className="flow-wordmark">Mentoria Hub</span>
      <span className="flow-eyebrow">{eyebrow}</span>
      <div className="flow-topbar-actions">
        {onBack ? (
          <button className="flow-link-button" type="button" onClick={onBack}>
            Back
          </button>
        ) : null}
        {onLogout ? (
          <button className="flow-link-button" type="button" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
}

function toggleValue(values: string[], optionId: string) {
  return values.includes(optionId) ? values.filter((value) => value !== optionId) : [...values, optionId];
}

function getQuestionValues(profile: OnboardingProfile, question: OnboardingQuestion) {
  switch (question.id) {
    case "grade":
      return profile.grade ? [profile.grade] : [];
    case "academicDirection":
      return profile.academicDirection ? [profile.academicDirection] : [];
    case "interests":
      return profile.interests;
    case "directions":
      return profile.directions;
    case "formats":
      return profile.formats;
    case "locations":
      return profile.locations;
  }
}

function setQuestionValue(profile: OnboardingProfile, question: OnboardingQuestion, optionId: string) {
  switch (question.id) {
    case "grade":
      return { ...profile, grade: optionId };
    case "academicDirection":
      return { ...profile, academicDirection: optionId };
    case "interests":
      return { ...profile, interests: toggleValue(profile.interests, optionId) };
    case "directions":
      return { ...profile, directions: toggleValue(profile.directions, optionId) };
    case "formats":
      return { ...profile, formats: toggleValue(profile.formats, optionId) };
    case "locations":
      return { ...profile, locations: toggleValue(profile.locations, optionId) };
  }
}

function isQuestionAnswered(profile: OnboardingProfile, question: OnboardingQuestion) {
  if (!question.required) {
    return true;
  }

  return getQuestionValues(profile, question).length > 0;
}

type OnboardingSectionProps = {
  profile: OnboardingProfile;
  step: number;
  onChange: (profile: OnboardingProfile) => void;
  onNext: () => void;
  onBack: () => void;
  onReturnHome: () => void;
};

export function OnboardingSection({ profile, step, onChange, onNext, onBack, onReturnHome }: OnboardingSectionProps) {
  const question = onboardingQuestions[step];
  const selectedValues = getQuestionValues(profile, question);
  const canContinue = isQuestionAnswered(profile, question);
  const isLastStep = step === onboardingQuestions.length - 1;
  const selectionLabel = selectedValues.length === 0 ? "selection: none" : `selection: ${selectedValues.length}`;

  return (
    <section className="flow-screen onboarding-screen" aria-labelledby="onboarding-title">
      <div className="flow-centered-shell">
        <div className="flow-console onboarding-console">
          <div className="flow-progress-row">
            <span>
              Step {step + 1} of {onboardingQuestions.length}
            </span>
            <span>{Math.round(((step + 1) / onboardingQuestions.length) * 100)}%</span>
          </div>
          <div className="flow-progress-track" aria-hidden="true">
            <span style={{ transform: `scaleX(${(step + 1) / onboardingQuestions.length})` }} />
          </div>

          <div className="question-block">
            <h1 id="onboarding-title">{question.title}</h1>
            <p className="selection-status">{selectionLabel}</p>
          </div>

          <div className="option-grid" role="group" aria-label={question.title}>
            {question.options.map((option) => {
              const selected = selectedValues.includes(option.id);

              return (
                <button
                  className={`option-chip${selected ? " option-chip-selected" : ""}`}
                  type="button"
                  aria-pressed={selected}
                  key={option.id}
                  onClick={() => onChange(setQuestionValue(profile, question, option.id))}
                >
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flow-actions">
            <button className="secondary-action" type="button" onClick={step === 0 ? onReturnHome : onBack}>
              Back
            </button>
            <button className="primary-action" type="button" disabled={!canContinue} onClick={onNext}>
              {isLastStep ? "Continue to registration" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

type RegistrationSectionProps = {
  authMode: AuthMode;
  form: RegistrationForm;
  fieldErrors: RegistrationFieldErrors;
  authError: string;
  authNotice: string;
  loading: boolean;
  profileCompletion?: boolean;
  supabaseConfigError: string;
  supabaseReady: boolean;
  onChange: (field: keyof RegistrationForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onModeChange: (mode: AuthMode) => void;
  onBack: () => void;
};

export function RegistrationSection({
  authMode,
  form,
  fieldErrors,
  authError,
  authNotice,
  loading,
  profileCompletion = false,
  supabaseConfigError,
  supabaseReady,
  onChange,
  onSubmit,
  onModeChange,
  onBack
}: RegistrationSectionProps) {
  const isSignup = authMode === "signup";
  const needsName = isSignup || profileCompletion;
  const needsPassword = !profileCompletion;

  return (
    <section className="flow-screen auth-screen" aria-labelledby="auth-title">
      <div className="flow-centered-shell">
        <form className="flow-console auth-form auth-console" onSubmit={onSubmit} noValidate>
          <div className="auth-console-header">
            <button className="secondary-action compact-action auth-back-button" type="button" onClick={onBack}>
              Back
            </button>
            <h1 id="auth-title">{profileCompletion ? "Finish profile" : isSignup ? "Create account" : "Sign in"}</h1>
          </div>

          {!supabaseReady ? (
            <div className="form-alert" role="alert">
              {supabaseConfigError ||
                "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy."}
            </div>
          ) : null}

          {authNotice ? (
            <div className="form-alert form-alert-soft" role="status">
              {authNotice}
            </div>
          ) : null}

          {authError ? (
            <div className="form-alert" role="alert">
              {authError}
            </div>
          ) : null}

          {needsName ? (
            <label className="form-field">
              <span>Name</span>
              <input
                autoComplete="name"
                value={form.name}
                aria-invalid={Boolean(fieldErrors.name)}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="Aruzhan"
              />
              <small>{fieldErrors.name ?? "This appears in your dashboard greeting."}</small>
            </label>
          ) : null}

          <label className="form-field">
            <span>Email</span>
            <input
              autoComplete="email"
              type="email"
              value={form.email}
              aria-invalid={Boolean(fieldErrors.email)}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="student@mentoria.kz"
            />
            <small>{fieldErrors.email ?? "Use the same email when signing back in."}</small>
          </label>

          {needsPassword ? (
            <label className="form-field">
              <span>Password</span>
              <input
                autoComplete={isSignup ? "new-password" : "current-password"}
                type="password"
                value={form.password}
                aria-invalid={Boolean(fieldErrors.password)}
                onChange={(event) => onChange("password", event.target.value)}
                placeholder="Minimum 6 characters"
              />
              <small>{fieldErrors.password ?? "Stored and verified by Supabase Auth."}</small>
            </label>
          ) : null}

          <button className="primary-action auth-submit" type="submit" disabled={loading || !supabaseReady}>
            {loading ? "Working..." : profileCompletion ? "Save profile" : isSignup ? "Create account" : "Sign in"}
          </button>

          {!profileCompletion ? (
            <button
              className="mode-switch"
              type="button"
              onClick={() => onModeChange(isSignup ? "signin" : "signup")}
            >
              {isSignup ? "Already have an account? Sign in" : "Need an account? Create one"}
            </button>
          ) : null}
        </form>
      </div>
    </section>
  );
}

function buildOnboardingProfile(profile: StudentProfile): OnboardingProfile {
  return {
    grade: profile.grade,
    interests: profile.interests,
    academicDirection: profile.academicDirection,
    directions: profile.opportunityPreferences.directions,
    formats: profile.opportunityPreferences.formats,
    locations: profile.opportunityPreferences.locations
  };
}

function getOpportunityPool(extraOpportunities: Opportunity[]) {
  const opportunityMap = new Map<string, Opportunity>();

  opportunities.forEach((opportunity) => opportunityMap.set(opportunity.id, opportunity));
  extraOpportunities.forEach((opportunity) => opportunityMap.set(opportunity.id, opportunity));

  return [...opportunityMap.values()];
}

type DashboardSectionProps = {
  profile: StudentProfile;
  extraOpportunities?: Opportunity[];
  onCourses: () => void;
  onOpportunities: () => void;
  onLogout: () => void;
};

function DeadlineCalendar({ opportunities }: { opportunities: Opportunity[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oppMap = new Map<number, Opportunity>();
  opportunities.forEach(opp => {
    const d = new Date(opp.deadline);
    d.setHours(0, 0, 0, 0);
    oppMap.set(d.getTime(), opp);
  });

  const cells = [];
  const totalDays = 52 * 7;
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(today);
    // Center the calendar roughly around today
    date.setDate(date.getDate() - Math.floor(totalDays / 2) + i);
    date.setHours(0, 0, 0, 0);
    
    const opp = oppMap.get(date.getTime());
    cells.push({
      date,
      opportunity: opp
    });
  }

  return (
    <section className="dashboard-panel calendar-panel" aria-labelledby="calendar-title">
      <div className="panel-heading">
        <div>
          <span>Timeline</span>
          <h2 id="calendar-title">Deadline Calendar</h2>
        </div>
      </div>
      <div className="deadline-calendar-grid">
        {cells.map((cell, idx) => (
          <div 
            key={idx} 
            className={`calendar-cell ${cell.opportunity ? 'has-deadline' : ''}`}
            title={cell.opportunity ? `${cell.opportunity.title} (Due: ${cell.date.toLocaleDateString()})` : cell.date.toLocaleDateString()}
          ></div>
        ))}
      </div>
    </section>
  );
}

<<<<<<< HEAD
export function DashboardSection({ profile, onCourses, onOpportunities, onLogout }: DashboardSectionProps) {
=======
export function DashboardSection({ profile, extraOpportunities = [], onCourses, onOpportunities, onLogout }: DashboardSectionProps) {
>>>>>>> bac16fde47e2c06bb5c22bbb0e4bda01544823d2
  const onboardingProfile = buildOnboardingProfile(profile);
  const interestLabels = getOptionLabels("interests", profile.interests);
  const directionLabel = getOptionLabel("academicDirection", profile.academicDirection);
  const allOpportunities = getOpportunityPool(extraOpportunities);
  const recommendedOpportunities = getRecommendedOpportunities(onboardingProfile, allOpportunities);
  const recommendedCourses = getRecommendedCourses(onboardingProfile);
  const inProgressCourses = recommendedCourses.filter((course) => course.progress > 0 && course.progress < 100).length;
  const upcomingDeadlines = recommendedOpportunities.filter((opportunity) => hasUpcomingDeadline(opportunity)).length;

  return (
    <section className="flow-screen dashboard-screen" aria-labelledby="dashboard-title">
      <FlowTopBar eyebrow="Student dashboard" onLogout={onLogout} />

      <div className="dashboard-shell">
        <div className="dashboard-hero">
          <div>
            <p className="flow-kicker">Welcome back</p>
            <h1 id="dashboard-title">{profile.name}</h1>
            <p>
              Grade {profile.grade} profile focused on {directionLabel}.{" "}
              Recommended matches are ranked from your onboarding answers, curated Mentoria programs, and the cleaned
              Telegram opportunity feed.
            </p>
          </div>
          <div className="profile-summary" aria-label="Onboarding profile summary">
            {interestLabels.slice(0, 5).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="metric-grid" aria-label="Dashboard statistics">
          <article className="metric-card">
<<<<<<< HEAD
            <span>Learning streak</span>
            <strong>7 days</strong>
          </article>
          <article className="metric-card">
            <span>Completed courses</span>
            <strong>3</strong>
          </article>
          <article className="metric-card">
            <span>Saved opportunities</span>
=======
            <span>Active courses</span>
            <strong>{courses.length}</strong>
          </article>
          <article className="metric-card">
            <span>In progress</span>
            <strong>{inProgressCourses}</strong>
          </article>
          <article className="metric-card">
            <span>Recommended matches</span>
>>>>>>> bac16fde47e2c06bb5c22bbb0e4bda01544823d2
            <strong>{recommendedOpportunities.length}</strong>
          </article>
          <article className="metric-card">
            <span>Upcoming deadlines</span>
            <strong>{upcomingDeadlines}</strong>
          </article>
        </div>

        <DeadlineCalendar opportunities={recommendedOpportunities} />

        <div className="dashboard-columns">
          <section className="dashboard-panel" aria-labelledby="recommended-matches-title">
            <div className="panel-heading">
              <div>
                <span>Shortlist</span>
                <h2 id="recommended-matches-title">Recommended matches</h2>
              </div>
              <button className="secondary-action compact-action" type="button" onClick={onOpportunities}>
                Opportunities
              </button>
            </div>
            <div className="match-list">
              {recommendedOpportunities.length > 0 ? (
                recommendedOpportunities.map((opportunity) => (
                  <OpportunitySummary opportunity={opportunity} key={opportunity.id} />
                ))
              ) : (
                <EmptyState
                  title="No matches yet"
                  message="Adjust your onboarding interests or check again after the catalog refreshes."
                />
              )}
            </div>
          </section>

          <section className="dashboard-panel dashboard-panel-soft" aria-labelledby="recommended-courses-title">
            <div className="panel-heading">
              <div>
                <span>Learning</span>
                <h2 id="recommended-courses-title">Recommended courses</h2>
              </div>
              <button className="secondary-action compact-action" type="button" onClick={onCourses}>
                Courses
              </button>
            </div>
            <div className="course-progress-list">
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((course) => (
                  <CourseProgressRow course={course} key={course.id} />
                ))
              ) : (
                <EmptyState title="No course path yet" message="Choose more interests so Mentoria can connect courses to matches." />
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

type CoursesWorkspaceProps = {
  profile: StudentProfile;
  onBack: () => void;
  onLogout: () => void;
};

export function CoursesWorkspace({ profile, onBack, onLogout }: CoursesWorkspaceProps) {
  const onboardingProfile = buildOnboardingProfile(profile);
  const recommendedCourses = getRecommendedCourses(onboardingProfile, courses.length);

  return (
    <section className="flow-screen workspace-screen" aria-labelledby="workspace-courses-title">
      <FlowTopBar eyebrow="Courses" onBack={onBack} onLogout={onLogout} />
      <div className="workspace-shell">
        <div className="workspace-heading">
          <p className="flow-kicker">Mentoria courses</p>
          <h1 id="workspace-courses-title">Continue your preparation path</h1>
          <p>Course progress is prototype data for now, but the recommendations come from the saved onboarding profile.</p>
        </div>
        <div className="workspace-card-grid">
          {recommendedCourses.map((course) => (
            <article className="workspace-course-card" key={course.id}>
              <span>{course.track}</span>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="course-meta-row">
                <span>{course.difficulty}</span>
                <span>{course.lessons.length} lessons</span>
              </div>
              <div className="course-progress-track" aria-label={`${course.title} progress`}>
                <span style={{ transform: `scaleX(${course.progress / 100})` }} />
              </div>
              <button className="secondary-action compact-action" type="button">
                Continue
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type OpportunitiesWorkspaceProps = {
  profile: StudentProfile;
  extraOpportunities?: Opportunity[];
  onBack: () => void;
  onLogout: () => void;
};

export function OpportunitiesWorkspace({ profile, extraOpportunities = [], onBack, onLogout }: OpportunitiesWorkspaceProps) {
  const onboardingProfile = buildOnboardingProfile(profile);
  const allOpportunities = getOpportunityPool(extraOpportunities);
  const recommendedOpportunities = getRecommendedOpportunities(onboardingProfile, allOpportunities, allOpportunities.length);

  return (
    <section className="flow-screen workspace-screen" aria-labelledby="workspace-opportunities-title">
      <FlowTopBar eyebrow="Opportunities" onBack={onBack} onLogout={onLogout} />
      <div className="workspace-shell">
        <div className="workspace-heading">
          <p className="flow-kicker">Opportunity shortlist</p>
          <h1 id="workspace-opportunities-title">Matches from your profile</h1>
          <p>These cards are a dashboard-level preview of what a full catalog would turn into later.</p>
        </div>
        <div className="workspace-opportunity-list">
          {recommendedOpportunities.length > 0 ? (
            recommendedOpportunities.map((opportunity) => (
              <article className="workspace-opportunity-row" key={opportunity.id}>
                <div>
                  <span className="deadline-chip">{formatOpportunityDeadline(opportunity)}</span>
                  <h2>{opportunity.title}</h2>
                  <p>{opportunity.description}</p>
                  <div className="opportunity-tags">
                    <span>{opportunity.direction}</span>
                    <span>{opportunity.format}</span>
                    <span>Grades {opportunity.grades.join(", ")}</span>
                  </div>
                </div>
                <span className="match-badge">Match</span>
              </article>
            ))
          ) : (
            <EmptyState title="No matches yet" message="Try broadening the profile filters or refresh the opportunity feed." />
          )}
        </div>
      </div>
    </section>
  );
}

function OpportunitySummary({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="match-summary-row">
      <div>
        <h3>{opportunity.title}</h3>
        <p>
          {opportunity.category} - {opportunity.format} - {formatOpportunityDeadline(opportunity)}
        </p>
      </div>
      <span>Match</span>
    </article>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="empty-state" role="status">
      <span />
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}

function CourseProgressRow({ course }: { course: Course }) {
  return (
    <article className="course-progress-row">
      <div>
        <h3>{course.title}</h3>
        <p>
          {course.difficulty} - {course.lessons.length} lessons
        </p>
      </div>
      <div className="course-progress-track" aria-label={`${course.title} progress`}>
        <span style={{ transform: `scaleX(${course.progress / 100})` }} />
      </div>
    </article>
  );
}
