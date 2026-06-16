import type { FormEvent } from "react";
import React, { useEffect, useState } from "react";
import {
  courses,
  getOptionLabel,
  getOptionLabels,
  getRecommendedCourses,
  getRecommendedOpportunities,
  onboardingQuestions,
  opportunities
} from "../data/content";
import type { Course, OnboardingProfile, OnboardingQuestion, Opportunity } from "../data/content";
import { getAIRecommendedCourses, getAIRecommendedOpportunities } from "../lib/aiRecommendations";

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
  children?: React.ReactNode;
};

function FlowTopBar({ eyebrow, onBack, onLogout, children }: FlowTopBarProps) {
  return (
    <nav className="flow-topbar" aria-label="Mentoria Hub workspace navigation">
      <span className="flow-wordmark">Mentoria Hub</span>
      <span className="flow-eyebrow">{eyebrow}</span>
      <div className="flow-topbar-actions">
        {children}
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
            <p>{question.description}</p>
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
  supabaseReady,
  onChange,
  onSubmit,
  onModeChange,
  onBack
}: RegistrationSectionProps) {
  const isSignup = authMode === "signup";

  return (
    <section className="flow-screen auth-screen" aria-labelledby="auth-title">
      <div className="flow-centered-shell">
        <form className="flow-console auth-form auth-console" onSubmit={onSubmit} noValidate>
          <div className="auth-console-header">
            <button className="secondary-action compact-action auth-back-button" type="button" onClick={onBack}>
              Back
            </button>
            <h1 id="auth-title">{isSignup ? "Create account" : "Sign in"}</h1>
          </div>

          {!supabaseReady ? (
            <div className="form-alert" role="alert">
              Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to `.env.local` before registering.
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

          {isSignup ? (
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

          <button className="primary-action auth-submit" type="submit" disabled={loading || !supabaseReady}>
            {loading ? "Working..." : isSignup ? "Create account" : "Sign in"}
          </button>

          <button
            className="mode-switch"
            type="button"
            onClick={() => onModeChange(isSignup ? "signin" : "signup")}
          >
            {isSignup ? "Already have an account? Sign in" : "Need an account? Create one"}
          </button>
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

type DashboardSectionProps = {
  profile: StudentProfile;
  extraOpportunities?: Opportunity[];
  onCourses: () => void;
  onOpportunities: () => void;
  onMentorLM: () => void;
  onLogout: () => void;
};

export function DashboardSection({ profile, extraOpportunities = [], onCourses, onOpportunities, onMentorLM, onLogout }: DashboardSectionProps) {
  const onboardingProfile = buildOnboardingProfile(profile);
  const interestLabels = getOptionLabels("interests", profile.interests);
  const directionLabel = getOptionLabel("academicDirection", profile.academicDirection);

  const [recommendedOpportunities, setRecommendedOpportunities] = useState<Opportunity[]>(
    () => getRecommendedOpportunities(onboardingProfile)
  );
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>(
    () => getRecommendedCourses(onboardingProfile)
  );
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
    if (!apiKey) return;

    setAiLoading(true);

    const allOpportunities = extraOpportunities.length > 0 ? extraOpportunities : opportunities;

    Promise.all([
      getAIRecommendedOpportunities(onboardingProfile, allOpportunities),
      getAIRecommendedCourses(onboardingProfile, courses),
    ])
      .then(([oppResult, courseResult]) => {
        const aiOpps = oppResult.ids
          .map((id) => allOpportunities.find((o) => o.id === id))
          .filter((o): o is Opportunity => Boolean(o));
        const aiCourses = courseResult.ids
          .map((id) => courses.find((c) => c.id === id))
          .filter((c): c is Course => Boolean(c));

        if (aiOpps.length > 0) setRecommendedOpportunities(aiOpps);
        if (aiCourses.length > 0) setRecommendedCourses(aiCourses);
        setAiExplanation(oppResult.explanation);
      })
      .catch(() => {
        // fallback to tag-based already set in initial state
      })
      .finally(() => setAiLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  return (
    <section className="flow-screen dashboard-screen" aria-labelledby="dashboard-title">
      <FlowTopBar eyebrow="Student dashboard" onLogout={onLogout}>
        <button className="secondary-action compact-action" type="button" onClick={onMentorLM}>
          MentorLM ✦
        </button>
      </FlowTopBar>

      <div className="dashboard-shell">
        <div className="dashboard-hero">
          <div>
            <p className="flow-kicker">Welcome back</p>
            <h1 id="dashboard-title">{profile.name}</h1>
            <p>
              Grade {profile.grade} profile focused on {directionLabel}.{" "}
              {aiLoading
                ? "AI is personalizing your recommendations…"
                : aiExplanation
                  ? aiExplanation
                  : "Your first recommendations are tuned from the onboarding answers saved in Supabase."}
            </p>
          </div>
          <div className="profile-summary" aria-label="Onboarding profile summary">
            {interestLabels.slice(0, 5).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div className="metric-grid" aria-label="Dashboard statistics">
          <article>
            <span>Learning streak</span>
            <strong>7 days</strong>
          </article>
          <article>
            <span>Completed courses</span>
            <strong>3</strong>
          </article>
          <article>
            <span>Saved opportunities</span>
            <strong>{recommendedOpportunities.length}</strong>
          </article>
          <article>
            <span>Upcoming deadlines</span>
            <strong>4</strong>
          </article>
        </div>

        <div className="dashboard-columns">
          <section className="dashboard-panel" aria-labelledby="saved-opportunities-title">
            <div className="panel-heading">
              <div>
                <span>Shortlist</span>
                <h2 id="saved-opportunities-title">Saved opportunities</h2>
              </div>
              <button className="secondary-action compact-action" type="button" onClick={onOpportunities}>
                Opportunities
              </button>
            </div>
            <div className="saved-list">
              {recommendedOpportunities.map((opportunity) => (
                <OpportunitySummary opportunity={opportunity} key={opportunity.id} />
              ))}
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
              {recommendedCourses.map((course) => (
                <CourseProgressRow course={course} key={course.id} />
              ))}
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
  const allOpportunities = extraOpportunities.length > 0 ? extraOpportunities : opportunities;
  const recommendedOpportunities = getRecommendedOpportunities(onboardingProfile, allOpportunities.length);

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
          {recommendedOpportunities.map((opportunity) => (
            <article className="workspace-opportunity-row" key={opportunity.id}>
              <div>
                <span className="deadline-chip">{new Date(opportunity.deadline).toLocaleDateString("en-US")}</span>
                <h2>{opportunity.title}</h2>
                <p>{opportunity.description}</p>
                <div className="opportunity-tags">
                  <span>{opportunity.direction}</span>
                  <span>{opportunity.format}</span>
                  <span>Grades {opportunity.grades.join(", ")}</span>
                </div>
              </div>
              <span className="saved-badge">Saved</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OpportunitySummary({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="saved-summary-row">
      <div>
        <h3>{opportunity.title}</h3>
        <p>
          {opportunity.category} - {opportunity.format} - deadline{" "}
          {new Date(opportunity.deadline).toLocaleDateString("en-US")}
        </p>
      </div>
      <span>Saved</span>
    </article>
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
