import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  OnboardingSection,
  RegistrationSection
} from "./sections/AuthFlowSections";
import type {
  AuthMode,
  RegistrationFieldErrors,
  RegistrationForm,
  StudentProfile
} from "./sections/AuthFlowSections";
import {
  CourseDetailWorkspace,
  CoursesWorkspace,
  DashboardSection,
  LessonWorkspace,
  MentorPetWorkspace,
  OpportunitiesWorkspace
} from "./sections/WorkspaceSections";
import { CompanionSection } from "./sections/CompanionSection";
import { CoursesSection } from "./sections/CoursesSection";
import { FaqSection } from "./sections/FaqSection";
import { HeroSection } from "./sections/HeroSection";
import { OpportunitySearchSection } from "./sections/OpportunitySearchSection";
import { RecommendedMatchesSection } from "./sections/RecommendedMatchesSection";
import { emptyOnboardingProfile, onboardingQuestions } from "./data/content";
import type { OnboardingProfile, Opportunity } from "./data/content";
import { loadTelegramOpportunities } from "./lib/telegramOpportunities";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import {
  fetchOwnProfile,
  getSession as getSupabaseSession,
  onAuthStateChange,
  signInWithPassword,
  signOut,
  signUpWithProfile,
  updateOwnProfile
} from "./lib/auth";

const onboardingDraftKey = "mentoria.onboardingDraft";

const initialRegistrationForm: RegistrationForm = {
  name: "",
  email: "",
  password: ""
};

function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.main
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.main>
  );
}

function readOnboardingDraft() {
  if (typeof window === "undefined") {
    return emptyOnboardingProfile;
  }

  const rawDraft = window.sessionStorage.getItem(onboardingDraftKey);

  if (!rawDraft) {
    return emptyOnboardingProfile;
  }

  try {
    return normalizeOnboardingProfile(JSON.parse(rawDraft));
  } catch {
    return emptyOnboardingProfile;
  }
}

function normalizeOnboardingProfile(value: unknown): OnboardingProfile {
  if (!value || typeof value !== "object") {
    return emptyOnboardingProfile;
  }

  const profile = value as Partial<OnboardingProfile>;

  return {
    grade: typeof profile.grade === "string" ? profile.grade : "",
    interests: Array.isArray(profile.interests)
      ? profile.interests.filter((item): item is string => typeof item === "string")
      : [],
    academicDirection: typeof profile.academicDirection === "string" ? profile.academicDirection : "",
    directions: Array.isArray(profile.directions)
      ? profile.directions.filter((item): item is string => typeof item === "string")
      : [],
    formats: Array.isArray(profile.formats) ? profile.formats.filter((item): item is string => typeof item === "string") : [],
    locations: Array.isArray(profile.locations)
      ? profile.locations.filter((item): item is string => typeof item === "string")
      : []
  };
}

function hasCompletedOnboarding(profile: OnboardingProfile) {
  return onboardingQuestions.every((question) => {
    if (!question.required) {
      return true;
    }

    switch (question.id) {
      case "grade":
        return profile.grade.length > 0;
      case "academicDirection":
        return profile.academicDirection.length > 0;
      case "interests":
        return profile.interests.length > 0;
      case "directions":
        return profile.directions.length > 0;
      case "formats":
        return profile.formats.length > 0;
      case "locations":
        return profile.locations.length > 0;
    }
  });
}

function validateRegistrationForm(authMode: AuthMode, form: RegistrationForm) {
  const errors: RegistrationFieldErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (authMode === "signup" && form.name.trim().length === 0) {
    errors.name = "Enter your name.";
  }

  if (!emailPattern.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [telegramOpportunities, setTelegramOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    loadTelegramOpportunities().then((opps) => {
      if (opps.length > 0) setTelegramOpportunities(opps);
    });
  }, []);
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile>(() => readOnboardingDraft());
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>(initialRegistrationForm);
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const supabaseReady = useMemo(() => Boolean(isSupabaseConfigured && supabase), []);

  useEffect(() => {
    window.sessionStorage.setItem(onboardingDraftKey, JSON.stringify(onboardingProfile));
  }, [onboardingProfile]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    if (!supabase) {
      setBootstrapping(false);
      return undefined;
    }

    let active = true;

    async function bootstrapSession() {
      try {
        const session = await getSupabaseSession();

        if (!active) {
          return;
        }

        setSession(session);

        if (session?.user) {
          const loadedProfile = await fetchOwnProfile(session.user.id);

          if (!active) {
            return;
          }

          if (loadedProfile) {
            setProfile(loadedProfile);
            if (["/", "/onboarding", "/registration"].includes(window.location.pathname)) {
              navigate("/dashboard", { replace: true });
            }
          } else {
            setRegistrationForm((current) => ({
              ...current,
              email: session.user.email ?? current.email
            }));
            navigate("/onboarding", { replace: true });
          }
        }
      } catch (error) {
        if (active) {
          setAuthError(error instanceof Error ? error.message : "Could not restore the Supabase session.");
        }
      } finally {
        if (active) {
          setBootstrapping(false);
        }
      }
    }

    bootstrapSession();

    const unsubscribe = onAuthStateChange((nextSession) => {
      setSession(nextSession);

      if (!nextSession) {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigate]);

  function startOnboarding() {
    setAuthError("");
    setAuthNotice("");
    setFieldErrors({});
    setAuthMode("signup");
    setOnboardingStep(0);
    navigate("/onboarding");
  }

  function continueOnboarding() {
    if (onboardingStep === onboardingQuestions.length - 1) {
      setAuthError("");
      setAuthNotice("");
      setFieldErrors({});
      navigate("/registration");
      return;
    }

    setOnboardingStep((currentStep) => currentStep + 1);
  }

  function updateRegistrationField(field: keyof RegistrationForm, value: string) {
    setRegistrationForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setAuthError("");
    setAuthNotice("");
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setAuthNotice("");

    if (!hasCompletedOnboarding(onboardingProfile) && authMode === "signup") {
      setAuthError("Complete the onboarding questions before creating an account.");
      navigate("/onboarding");
      return;
    }

    const nextFieldErrors = validateRegistrationForm(authMode, registrationForm);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    if (!supabase) {
      setAuthError("Supabase is not configured. Add the Vite env variables and restart the dev server.");
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === "signup") {
        const data = await signUpWithProfile(registrationForm, onboardingProfile);

        if (!data.user || !data.session) {
          setAuthNotice(
            "Account created, but email confirmation is enabled in Supabase. Disable mandatory confirmation for the demo or confirm the email before signing in."
          );
          return;
        }

        const nextProfile = await updateOwnProfile(data.user.id, registrationForm, onboardingProfile);
        setSession(data.session);
        setProfile(nextProfile);
        window.sessionStorage.removeItem(onboardingDraftKey);
        navigate("/dashboard", { replace: true });
        return;
      }

      const data = await signInWithPassword(registrationForm.email, registrationForm.password);
      const loadedProfile = await fetchOwnProfile(data.user.id);
      setSession(data.session);

      if (loadedProfile) {
        setProfile(loadedProfile);
        navigate("/dashboard", { replace: true });
      } else {
        setAuthNotice("Signed in. Finish onboarding once so Mentoria can create your student profile.");
        setOnboardingStep(0);
        navigate("/onboarding", { replace: true });
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Authentication failed. Try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    await signOut();

    setSession(null);
    setProfile(null);
    setAuthError("");
    setAuthNotice("");
    setRegistrationForm(initialRegistrationForm);
    navigate("/", { replace: true });
  }

  if (bootstrapping) {
    return (
      <PageShell>
        <section className="flow-screen loading-screen" aria-live="polite">
          <div className="loading-panel">
            <span>Mentoria Hub</span>
            <strong>Loading student workspace</strong>
          </div>
        </section>
      </PageShell>
    );
  }

  const registrationRoute = (
    <PageShell>
      <RegistrationSection
        authMode={authMode}
        form={registrationForm}
        fieldErrors={fieldErrors}
        authError={authError}
        authNotice={authNotice}
        loading={authLoading}
        supabaseReady={supabaseReady}
        onChange={updateRegistrationField}
        onSubmit={submitRegistration}
        onModeChange={(nextMode) => {
          setAuthMode(nextMode);
          setFieldErrors({});
          setAuthError("");
          setAuthNotice("");
        }}
        onBack={() => navigate("/onboarding")}
      />
    </PageShell>
  );

  function protectedRoute(children: ReactNode) {
    return profile ? <PageShell>{children}</PageShell> : registrationRoute;
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageShell>
                <HeroSection onStartJourney={startOnboarding} />
                <OpportunitySearchSection />
                <RecommendedMatchesSection />
                <CoursesSection />
                <CompanionSection />
                <FaqSection />
              </PageShell>
            }
          />
          <Route
            path="/onboarding"
            element={
              <PageShell>
                <OnboardingSection
                  profile={onboardingProfile}
                  step={onboardingStep}
                  onChange={setOnboardingProfile}
                  onNext={continueOnboarding}
                  onBack={() => setOnboardingStep((currentStep) => Math.max(0, currentStep - 1))}
                  onReturnHome={() => navigate("/")}
                />
              </PageShell>
            }
          />
          <Route path="/registration" element={registrationRoute} />
          <Route
            path="/dashboard"
            element={protectedRoute(
              <DashboardSection profile={profile as StudentProfile} extraOpportunities={telegramOpportunities} onLogout={logout} />
            )}
          />
          <Route
            path="/courses"
            element={protectedRoute(<CoursesWorkspace profile={profile as StudentProfile} onLogout={logout} />)}
          />
          <Route path="/courses/:courseId" element={protectedRoute(<CourseDetailWorkspace onLogout={logout} />)} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={protectedRoute(<LessonWorkspace onLogout={logout} />)} />
          <Route
            path="/opportunities"
            element={protectedRoute(
              <OpportunitiesWorkspace profile={profile as StudentProfile} extraOpportunities={telegramOpportunities} onLogout={logout} />
            )}
          />
          <Route
            path="/mentor-pet"
            element={protectedRoute(<MentorPetWorkspace profile={profile as StudentProfile} onLogout={logout} />)}
          />
          <Route path="*" element={<Navigate replace to={profile ? "/dashboard" : "/"} />} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
  );
}
