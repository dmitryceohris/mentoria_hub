import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  upsertOwnProfile
} from "./lib/auth";

const onboardingDraftKey = "mentoria.onboardingDraft";
const protectedPathPattern = /^\/(?:dashboard|courses|opportunities|mentor-pet)(?:\/|$)/;

type AuthStatus = "bootstrapping" | "signed-out" | "profile-loading" | "profile-ready" | "profile-missing" | "error";

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

function validateRegistrationForm(
  authMode: AuthMode,
  form: RegistrationForm,
  options: { profileCompletion?: boolean } = {}
) {
  const errors: RegistrationFieldErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const needsName = authMode === "signup" || options.profileCompletion;
  const needsPassword = !options.profileCompletion;

  if (needsName && form.name.trim().length === 0) {
    errors.name = "Enter your name.";
  }

  if (!emailPattern.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (needsPassword && form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

function getPathWithSearch(location: { pathname: string; search: string }) {
  return `${location.pathname}${location.search}`;
}

function isProtectedPath(pathname: string) {
  return protectedPathPattern.test(pathname);
}

function isEntryRoute(pathname: string) {
  return pathname === "/onboarding" || pathname === "/registration";
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(supabase ? "bootstrapping" : "signed-out");
  const [authReturnTo, setAuthReturnTo] = useState("");
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
  const profileSaveInFlightRef = useRef(false);
  const profileLoadRequestIdRef = useRef(0);

  const supabaseReady = useMemo(() => Boolean(isSupabaseConfigured && supabase), []);
  const currentPathWithSearch = getPathWithSearch(location);

  const loadProfileForSession = useCallback(
    async (
      nextSession: Session | null,
      options: {
        isActive?: () => boolean;
        redirectOnReady?: boolean;
        redirectOnMissing?: boolean;
        returnTo?: string;
      } = {}
    ) => {
      const isActive = options.isActive ?? (() => true);

      if (!nextSession?.user) {
        if (!isActive()) return null;
        setSession(null);
        setProfile(null);
        setAuthStatus("signed-out");
        return null;
      }

      if (profileSaveInFlightRef.current) {
        setSession(nextSession);
        return null;
      }

      if (!isActive()) return null;

      const loadRequestId = ++profileLoadRequestIdRef.current;
      setSession(nextSession);
      setAuthStatus("profile-loading");

      const loadedProfile = await fetchOwnProfile(nextSession.user.id);

      if (!isActive() || loadRequestId !== profileLoadRequestIdRef.current || profileSaveInFlightRef.current) {
        return null;
      }

      if (loadedProfile) {
        setProfile(loadedProfile);
        setAuthStatus("profile-ready");

        if (options.redirectOnReady) {
          navigate(options.returnTo || "/dashboard", { replace: true });
        }

        return loadedProfile;
      }

      setProfile(null);
      setAuthStatus("profile-missing");
      if (options.returnTo) {
        setAuthReturnTo(options.returnTo);
      } else if (typeof window !== "undefined" && isProtectedPath(window.location.pathname)) {
        setAuthReturnTo(getPathWithSearch(window.location));
      }
      setRegistrationForm((current) => ({
        ...current,
        email: nextSession.user.email ?? current.email
      }));

      if (options.redirectOnMissing) {
        navigate("/onboarding", { replace: true });
      }

      return null;
    },
    [navigate]
  );

  async function saveProfileForSession(nextSession: Session, nextPath: string) {
    const nextProfile = await upsertOwnProfile(nextSession.user.id, registrationForm, onboardingProfile);
    setSession(nextSession);
    setProfile(nextProfile);
    setAuthStatus("profile-ready");
    setRegistrationForm(initialRegistrationForm);
    window.sessionStorage.removeItem(onboardingDraftKey);
    setAuthReturnTo("");
    navigate(nextPath, { replace: true });
    return nextProfile;
  }

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
    if (isProtectedPath(location.pathname) && authStatus === "signed-out") {
      setAuthReturnTo(currentPathWithSearch);
      setAuthMode("signin");
    }
  }, [authStatus, currentPathWithSearch, location.pathname]);

  useEffect(() => {
    if (!supabase) {
      setAuthStatus("signed-out");
      return undefined;
    }

    let active = true;

    async function bootstrapSession() {
      try {
        const restoredSession = await getSupabaseSession();
        const bootstrapPath = getPathWithSearch(window.location);
        const bootstrapPathname = window.location.pathname;
        const bootstrapIsProtected = isProtectedPath(bootstrapPathname);
        await loadProfileForSession(restoredSession, {
          isActive: () => active,
          redirectOnReady: Boolean(restoredSession?.user && isEntryRoute(bootstrapPathname)),
          redirectOnMissing: Boolean(restoredSession?.user && (bootstrapIsProtected || isEntryRoute(bootstrapPathname))),
          returnTo: bootstrapIsProtected ? bootstrapPath : "/dashboard"
        });
      } catch (error) {
        if (active) {
          setAuthError(getErrorMessage(error, "Could not restore the Supabase session."));
          setAuthStatus("error");
        }
      }
    }

    bootstrapSession();

    const unsubscribe = onAuthStateChange((nextSession) => {
      if (profileSaveInFlightRef.current) {
        setSession(nextSession);
        return;
      }

      if (!nextSession) {
        setSession(null);
        setProfile(null);
        setAuthStatus("signed-out");
        return;
      }

      loadProfileForSession(nextSession, {
        isActive: () => active,
        redirectOnReady: false,
        redirectOnMissing: false
      }).catch((error) => {
        if (active) {
          setAuthError(getErrorMessage(error, "Could not restore the Supabase session."));
          setAuthStatus("error");
        }
      });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [loadProfileForSession]);

  function startOnboarding() {
    setAuthError("");
    setAuthNotice("");
    setFieldErrors({});
    setAuthMode("signup");
    setAuthReturnTo("");
    setOnboardingStep(0);
    navigate("/onboarding");
  }

  function continueOnboarding() {
    if (onboardingStep === onboardingQuestions.length - 1) {
      setAuthError("");
      setAuthNotice("");
      setFieldErrors({});
      setAuthMode("signup");
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
    const completingProfile = Boolean(session?.user && authStatus === "profile-missing");

    if (!hasCompletedOnboarding(onboardingProfile) && (authMode === "signup" || completingProfile)) {
      setAuthError(
        completingProfile
          ? "Complete the onboarding questions before saving your profile."
          : "Complete the onboarding questions before creating an account."
      );
      navigate("/onboarding");
      return;
    }

    const nextFieldErrors = validateRegistrationForm(authMode, registrationForm, {
      profileCompletion: completingProfile
    });
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    if (!supabase) {
      setAuthError("Supabase is not configured. Add the Vite env variables and restart the dev server.");
      return;
    }

    setAuthLoading(true);
    let profileSaveStarted = false;
    let profileSaveSession: Session | null = completingProfile ? session : null;

    function beginProfileSave() {
      profileSaveStarted = true;
      profileSaveInFlightRef.current = true;
      profileLoadRequestIdRef.current += 1;
    }

    try {
      if (completingProfile && session?.user) {
        beginProfileSave();
        await saveProfileForSession(session, authReturnTo || "/dashboard");
        return;
      }

      if (authMode === "signup") {
        beginProfileSave();
        const data = await signUpWithProfile(registrationForm, onboardingProfile);

        if (!data.user || !data.session) {
          setAuthNotice(
            "Account created. Confirm your email, then sign in. Your onboarding answers are still saved in this browser."
          );
          return;
        }

        profileSaveSession = data.session;
        await saveProfileForSession(data.session, "/dashboard");
        return;
      }

      const data = await signInWithPassword(registrationForm.email, registrationForm.password);
      const loadedProfile = await loadProfileForSession(data.session, {
        redirectOnReady: false,
        redirectOnMissing: true
      });

      if (loadedProfile) {
        const nextPath = authReturnTo || "/dashboard";
        setRegistrationForm(initialRegistrationForm);
        setAuthReturnTo("");
        navigate(nextPath, { replace: true });
      } else {
        setAuthNotice("Signed in. Finish onboarding once so Mentoria can create your student profile.");
        setOnboardingStep(0);
      }
    } catch (error) {
      if (profileSaveSession?.user) {
        const failedProfileSession = profileSaveSession;
        setSession(failedProfileSession);
        setProfile(null);
        setAuthStatus("profile-missing");
        setRegistrationForm((current) => ({
          ...current,
          email: failedProfileSession.user.email ?? current.email
        }));
      }
      setAuthError(getErrorMessage(error, "Authentication failed. Try again."));
    } finally {
      if (profileSaveStarted) {
        profileLoadRequestIdRef.current += 1;
        profileSaveInFlightRef.current = false;
      }
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
    setAuthStatus("signed-out");
    setAuthReturnTo("");
    navigate("/", { replace: true });
  }

  const loadingRoute = (
    <PageShell>
      <section className="flow-screen loading-screen" aria-live="polite">
        <div className="loading-panel">
          <span>Mentoria Hub</span>
          <strong>Loading student workspace</strong>
        </div>
      </section>
    </PageShell>
  );

  if (authStatus === "bootstrapping") {
    return loadingRoute;
  }

  const profileCompletion = Boolean(session?.user && authStatus === "profile-missing");
  const protectedFallbackAuthMode: AuthMode =
    profileCompletion
      ? "signup"
      : isProtectedPath(location.pathname) && authReturnTo !== currentPathWithSearch
        ? "signin"
        : authMode;

  const registrationRoute = (
    <PageShell>
      <RegistrationSection
        authMode={protectedFallbackAuthMode}
        form={registrationForm}
        fieldErrors={fieldErrors}
        authError={authError}
        authNotice={authNotice}
        loading={authLoading}
        profileCompletion={profileCompletion}
        supabaseReady={supabaseReady}
        onChange={updateRegistrationField}
        onSubmit={submitRegistration}
        onModeChange={(nextMode) => {
          setAuthMode(nextMode);
          setFieldErrors({});
          setAuthError("");
          setAuthNotice("");
        }}
        onBack={() => navigate(authReturnTo ? "/" : "/onboarding")}
      />
    </PageShell>
  );

  function protectedRoute(children: ReactNode) {
    if (authStatus === "profile-loading") {
      return loadingRoute;
    }

    if (authStatus === "profile-ready" && profile) {
      return <PageShell>{children}</PageShell>;
    }

    if (session && authStatus === "profile-missing") {
      return <Navigate replace to="/onboarding" />;
    }

    return registrationRoute;
  }

  if (authStatus === "profile-loading" && isEntryRoute(location.pathname)) {
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
