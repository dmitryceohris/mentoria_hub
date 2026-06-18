import type { FormEvent } from "react";
import { onboardingQuestions } from "../data/content";
import type { OnboardingProfile, OnboardingQuestion } from "../data/content";

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
  finalActionLabel?: string;
  onChange: (profile: OnboardingProfile) => void;
  onNext: () => void;
  onBack: () => void;
  onReturnHome: () => void;
};

export function OnboardingSection({
  profile,
  step,
  finalActionLabel = "Continue to registration",
  onChange,
  onNext,
  onBack,
  onReturnHome
}: OnboardingSectionProps) {
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
              {isLastStep ? finalActionLabel : "Next"}
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
            <h1 id="auth-title">{profileCompletion ? "Confirm registration" : isSignup ? "Create account" : "Sign in"}</h1>
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
            {loading ? "Working..." : profileCompletion ? "Continue to onboarding" : isSignup ? "Create account" : "Sign in"}
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
