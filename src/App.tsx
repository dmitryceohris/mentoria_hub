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
import { AdminWorkspace } from "./sections/AdminWorkspace";
import { MentorLMSection } from "./sections/MentorLMSection";
import { RoadmapWorkspace } from "./sections/RoadmapWorkspace";
import {
  CourseDetailWorkspace,
  CoursesWorkspace,
  DashboardSection,
  LessonWorkspace,
  OpportunitiesWorkspace
} from "./sections/WorkspaceSections";
import { CoursesSection } from "./sections/CoursesSection";
import { FaqSection } from "./sections/FaqSection";
import { HeroSection } from "./sections/HeroSection";
import { MentorLMPreviewSection } from "./sections/MentorLMPreviewSection";
import { OpportunitySearchSection } from "./sections/OpportunitySearchSection";
import { RecommendedMatchesSection } from "./sections/RecommendedMatchesSection";
import { emptyOnboardingProfile, onboardingQuestions } from "./data/content";
import type { OnboardingProfile, Opportunity } from "./data/content";
import { loadTelegramOpportunities, filterActive } from "./lib/telegramOpportunities";
import { isSupabaseConfigured, supabase, supabaseConfigError } from "./lib/supabase";
import {
  fetchOwnProfile,
  getSession as getSupabaseSession,
  onAuthStateChange,
  saveCompletedOnboardingProfile,
  signInWithPassword,
  signOut,
  signUpWithCredentials
} from "./lib/auth";

const onboardingDraftKey = "mentoria.onboardingDraft";
const protectedPathPattern = /^\/(?:admin|dashboard|courses|opportunities|mentor-lm|roadmap)(?:\/|$)/;

type AuthStatus =
  | "bootstrapping"
  | "signed-out"
  | "profile-loading"
  | "profile-ready"
  | "profile-missing"
  | "onboarding-loading"
  | "error";

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

function getOnboardingProfileFromStudentProfile(profile: StudentProfile): OnboardingProfile {
  return {
    grade: profile.grade,
    interests: profile.interests,
    academicDirection: profile.academicDirection,
    directions: profile.opportunityPreferences.directions,
    formats: profile.opportunityPreferences.formats,
    locations: profile.opportunityPreferences.locations
  };
}

function mergeOnboardingProfiles(current: OnboardingProfile, saved: OnboardingProfile): OnboardingProfile {
  return {
    grade: current.grade || saved.grade,
    interests: current.interests.length > 0 ? current.interests : saved.interests,
    academicDirection: current.academicDirection || saved.academicDirection,
    directions: current.directions.length > 0 ? current.directions : saved.directions,
    formats: current.formats.length > 0 ? current.formats : saved.formats,
    locations: current.locations.length > 0 ? current.locations : saved.locations
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

function getFirstIncompleteOnboardingStep(profile: OnboardingProfile) {
  const incompleteStep = onboardingQuestions.findIndex((question) => {
    if (!question.required) {
      return false;
    }

    switch (question.id) {
      case "grade":
        return profile.grade.length === 0;
      case "academicDirection":
        return profile.academicDirection.length === 0;
      case "interests":
        return profile.interests.length === 0;
      case "directions":
        return profile.directions.length === 0;
      case "formats":
        return profile.formats.length === 0;
      case "locations":
        return profile.locations.length === 0;
    }
  });

  return incompleteStep === -1 ? onboardingQuestions.length - 1 : incompleteStep;
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

function getSafeReturnTo(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  const pathname = value.split(/[?#]/)[0];

  return isProtectedPath(pathname) ? value : "/dashboard";
}

function getReturnToFromSearch(search: string) {
  return getSafeReturnTo(new URLSearchParams(search).get("returnTo"));
}

function getExplicitReturnToFromSearch(search: string) {
  const params = new URLSearchParams(search);

  return params.has("returnTo") ? getSafeReturnTo(params.get("returnTo")) : "";
}

function getRouteWithReturnTo(route: "/onboarding" | "/registration", returnTo: string) {
  return `${route}?returnTo=${encodeURIComponent(getSafeReturnTo(returnTo))}`;
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

function getSessionMetadataName(session: Session) {
  const value = session.user.user_metadata?.name;

  return typeof value === "string" ? value.trim() : "";
}

function userHasNoNewIdentity(user: unknown) {
  if (!user || typeof user !== "object" || !("identities" in user)) {
    return false;
  }

  const identities = (user as { identities?: unknown }).identities;

  return Array.isArray(identities) && identities.length === 0;
}

function isExistingAccountSignupError(error: unknown) {
  const message = getErrorMessage(error, "").toLowerCase();

  return message.includes("already registered") || message.includes("already exists") || message.includes("user already");
}

function waitForLoadingScreen() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 520);
  });
}

function getOnboardingEmailRedirectTo() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.origin}/onboarding`;
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(supabase ? "bootstrapping" : "signed-out");
  const [telegramOpportunities, setTelegramOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    loadTelegramOpportunities().then((opps) => {
      if (opps.length > 0) setTelegramOpportunities(opps);
    });
  }, []);

  // Catalog, recommendations and roadmap show only upcoming opportunities;
  // MentorLM gets the full list so it can answer about past events too.
  const activeOpportunities = useMemo(() => filterActive(telegramOpportunities), [telegramOpportunities]);

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
  const onboardingProfileRef = useRef(onboardingProfile);

  const supabaseReady = useMemo(() => Boolean(isSupabaseConfigured && supabase), []);
  const currentPathWithSearch = getPathWithSearch(location);
  const explicitReturnTo = useMemo(() => getExplicitReturnToFromSearch(location.search), [location.search]);
  const returnToPath = useMemo(() => getReturnToFromSearch(location.search), [location.search]);

  const loadProfileForSession = useCallback(
    async (
      nextSession: Session | null,
      options: {
        isActive?: () => boolean;
        redirectOnReady?: boolean;
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

      let loadedProfile: StudentProfile | null = null;

      try {
        loadedProfile = await fetchOwnProfile(nextSession.user.id);
      } catch (error) {
        if (isActive() && loadRequestId === profileLoadRequestIdRef.current && !profileSaveInFlightRef.current) {
          setProfile(null);
          setAuthStatus("error");
        }

        throw error;
      }

      if (!isActive() || loadRequestId !== profileLoadRequestIdRef.current || profileSaveInFlightRef.current) {
        return null;
      }

      if (loadedProfile) {
        const savedOnboardingProfile = getOnboardingProfileFromStudentProfile(loadedProfile);

        if (!hasCompletedOnboarding(savedOnboardingProfile)) {
          const recoveredOnboardingProfile = mergeOnboardingProfiles(onboardingProfileRef.current, savedOnboardingProfile);
          onboardingProfileRef.current = recoveredOnboardingProfile;
          setOnboardingProfile(recoveredOnboardingProfile);
          setOnboardingStep(getFirstIncompleteOnboardingStep(recoveredOnboardingProfile));
          setProfile(null);
          setAuthStatus("profile-missing");
          setRegistrationForm((current) => ({
            ...current,
            email: loadedProfile.email || nextSession.user.email || current.email,
            name: current.name || loadedProfile.name || getSessionMetadataName(nextSession)
          }));
          return null;
        }

        setProfile(loadedProfile);
        setAuthStatus("profile-ready");

        if (options.redirectOnReady) {
          navigate(getSafeReturnTo(options.returnTo), { replace: true });
        }

        return loadedProfile;
      }

      if (!isActive() || loadRequestId !== profileLoadRequestIdRef.current || profileSaveInFlightRef.current) {
        return null;
      }

      setProfile(null);
      setAuthStatus("profile-missing");

      setRegistrationForm((current) => ({
        ...current,
        email: nextSession.user.email ?? current.email,
        name: current.name || getSessionMetadataName(nextSession)
      }));

      return null;
    },
    [navigate]
  );

  async function saveProfileForSession(nextSession: Session, nextPath: string) {
    const nextProfile = await saveCompletedOnboardingProfile(nextSession.user.id, registrationForm, onboardingProfile);
    setSession(nextSession);
    setProfile(nextProfile);
    setAuthStatus("profile-ready");
    setRegistrationForm(initialRegistrationForm);
    window.sessionStorage.removeItem(onboardingDraftKey);
    navigate(nextPath, { replace: true });
    return nextProfile;
  }

  useEffect(() => {
    onboardingProfileRef.current = onboardingProfile;
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
        const bootstrapReturnTo = bootstrapIsProtected
          ? bootstrapPath
          : getExplicitReturnToFromSearch(window.location.search) || "/dashboard";
        await loadProfileForSession(restoredSession, {
          isActive: () => active,
          redirectOnReady: Boolean(restoredSession?.user && isEntryRoute(bootstrapPathname)),
          returnTo: bootstrapReturnTo
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
        returnTo:
          typeof window !== "undefined" && isProtectedPath(window.location.pathname)
            ? getPathWithSearch(window.location)
            : getExplicitReturnToFromSearch(window.location.search) || "/dashboard"
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

  async function startOnboarding() {
    setAuthError("");
    setAuthNotice("");
    setFieldErrors({});
    setAuthMode("signup");
    setOnboardingStep(0);

    if (session?.user && authStatus === "profile-missing") {
      navigate(explicitReturnTo ? getRouteWithReturnTo("/onboarding", explicitReturnTo) : "/onboarding");
      return;
    }

    if (session?.user && authStatus === "profile-ready" && profile) {
      setAuthStatus("profile-loading");
      await waitForLoadingScreen();
      setAuthStatus("profile-ready");
      navigate("/dashboard");
      return;
    }

    navigate("/registration");
  }

  async function startSignIn() {
    setAuthError("");
    setAuthNotice("");
    setFieldErrors({});
    setAuthMode("signin");

    if (session?.user && authStatus === "profile-missing") {
      navigate(explicitReturnTo ? getRouteWithReturnTo("/onboarding", explicitReturnTo) : "/onboarding");
      return;
    }

    if (session?.user && authStatus === "profile-ready" && profile) {
      setAuthStatus("profile-loading");
      await waitForLoadingScreen();
      setAuthStatus("profile-ready");
      navigate("/dashboard");
      return;
    }

    navigate("/registration");
  }

  async function continueOnboarding() {
    if (onboardingStep === onboardingQuestions.length - 1) {
      setAuthError("");
      setAuthNotice("");
      setFieldErrors({});

      if (!session?.user) {
        setAuthNotice("Sign in to save your onboarding answers.");
        setAuthMode("signin");
        navigate(explicitReturnTo ? getRouteWithReturnTo("/registration", explicitReturnTo) : "/registration");
        return;
      }

      if (!hasCompletedOnboarding(onboardingProfile)) {
        setAuthError("Complete the onboarding questions before opening your dashboard.");
        setOnboardingStep(getFirstIncompleteOnboardingStep(onboardingProfile));
        return;
      }

      setAuthLoading(true);
      profileSaveInFlightRef.current = true;
      profileLoadRequestIdRef.current += 1;
      setAuthStatus("profile-loading");

      try {
        await saveProfileForSession(session, returnToPath);
      } catch (error) {
        setAuthStatus("profile-missing");
        setAuthError(getErrorMessage(error, "Could not save your onboarding profile. Try again."));
        navigate(getRouteWithReturnTo("/registration", returnToPath), { replace: true });
      } finally {
        profileLoadRequestIdRef.current += 1;
        profileSaveInFlightRef.current = false;
        setAuthLoading(false);
      }

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

    const nextFieldErrors = validateRegistrationForm(authMode, registrationForm);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    if (!supabase) {
      setAuthError(supabaseConfigError || "Supabase is not configured. Add the Vite env variables and restart the dev server.");
      return;
    }

    setAuthLoading(true);
    let profileSaveStarted = false;

    function beginProfileSave() {
      profileSaveStarted = true;
      profileSaveInFlightRef.current = true;
      profileLoadRequestIdRef.current += 1;
    }

    try {
      if (authMode === "signup") {
        beginProfileSave();
        const data = await signUpWithCredentials(registrationForm, getOnboardingEmailRedirectTo());

        if (data.user && userHasNoNewIdentity(data.user)) {
          setAuthMode("signin");
          setRegistrationForm((current) => ({ ...initialRegistrationForm, email: current.email }));
          setAuthNotice("This email already has an account. Log in to continue.");
          return;
        }

        if (!data.user) {
          setAuthNotice("Account created. Confirm your email, then sign in to continue.");
          return;
        }

        if (!data.session) {
          setSession(null);
          setProfile(null);
          setAuthStatus("signed-out");
          setAuthMode("signin");
          setRegistrationForm((current) => ({ ...initialRegistrationForm, email: current.email }));
          setAuthNotice("Account created. Confirm your email, then sign in to continue onboarding.");
          return;
        }

        setSession(data.session ?? null);
        setProfile(null);
        setAuthStatus("onboarding-loading");
        setOnboardingProfile(emptyOnboardingProfile);
        onboardingProfileRef.current = emptyOnboardingProfile;
        setOnboardingStep(0);
        window.sessionStorage.removeItem(onboardingDraftKey);
        setAuthLoading(false);
        await waitForLoadingScreen();
        setAuthStatus("profile-missing");
        navigate(explicitReturnTo ? getRouteWithReturnTo("/onboarding", explicitReturnTo) : "/onboarding", { replace: true });
        return;
      }

      const data = await signInWithPassword(registrationForm.email, registrationForm.password);
      const nextPath = returnToPath;
      const loadedProfile = await loadProfileForSession(data.session, {
        redirectOnReady: false,
        returnTo: nextPath
      });

      if (loadedProfile) {
        setRegistrationForm(initialRegistrationForm);
        navigate(nextPath, { replace: true });
      } else if (data.session?.user) {
        navigate(getRouteWithReturnTo("/onboarding", nextPath), { replace: true });
      } else {
        setAuthError("Signed in, but Mentoria could not load a session. Try again.");
      }
    } catch (error) {
      if (authMode === "signup" && isExistingAccountSignupError(error)) {
        setAuthMode("signin");
        setRegistrationForm((current) => ({ ...initialRegistrationForm, email: current.email }));
        setAuthNotice("This email already has an account. Log in to continue.");
        return;
      }

      setAuthError(getErrorMessage(error, "Authentication failed. Try again."));
      setAuthStatus("error");
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
    navigate("/", { replace: true });
  }

  function renderLoadingRoute(label: string) {
    return (
      <PageShell>
        <section className="flow-screen loading-screen" aria-live="polite">
          <div className="loading-panel">
            <strong>{label}</strong>
          </div>
        </section>
      </PageShell>
    );
  }

  const loadingRoute = renderLoadingRoute("Loading student workspace");
  const onboardingLoadingRoute = renderLoadingRoute("Loading onboarding questions");

  if (authStatus === "onboarding-loading") {
    return onboardingLoadingRoute;
  }

  if (authStatus === "bootstrapping") {
    return loadingRoute;
  }

  if (authStatus === "profile-loading" && session?.user && profile) {
    return loadingRoute;
  }

  const profileCompletion = false;
  const registrationAuthMode: AuthMode = authMode;

  const registrationRoute = (
    <PageShell>
      <RegistrationSection
        authMode={registrationAuthMode}
        form={registrationForm}
        fieldErrors={fieldErrors}
        authError={authError}
        authNotice={authNotice}
        loading={authLoading}
        profileCompletion={profileCompletion}
        supabaseConfigError={supabaseConfigError}
        supabaseReady={supabaseReady}
        onChange={updateRegistrationField}
        onSubmit={submitRegistration}
        onModeChange={(nextMode) => {
          setAuthMode(nextMode);
          setFieldErrors({});
          setAuthError("");
          setAuthNotice("");
        }}
        onBack={() => navigate("/")}
      />
    </PageShell>
  );

  const onboardingRoute = session?.user ? (
    <PageShell>
      <OnboardingSection
        profile={onboardingProfile}
        step={onboardingStep}
        finalActionLabel={session?.user ? "Continue to dashboard" : "Continue to registration"}
        onChange={setOnboardingProfile}
        onNext={continueOnboarding}
        onBack={() => setOnboardingStep((currentStep) => Math.max(0, currentStep - 1))}
        onReturnHome={() => navigate("/")}
      />
    </PageShell>
  ) : (
    <Navigate replace to={explicitReturnTo ? getRouteWithReturnTo("/registration", explicitReturnTo) : "/registration"} />
  );

  function protectedRoute(children: ReactNode) {
    if (authStatus === "profile-loading") {
      return loadingRoute;
    }

    if (authStatus === "profile-ready" && profile) {
      return <PageShell>{children}</PageShell>;
    }

    if (session && authStatus === "profile-missing") {
      return <Navigate replace to={getRouteWithReturnTo("/onboarding", currentPathWithSearch)} />;
    }

    return <Navigate replace to={getRouteWithReturnTo("/registration", currentPathWithSearch)} />;
  }

  if (authStatus === "profile-loading" && isEntryRoute(location.pathname)) {
    return loadingRoute;
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageShell>
                <HeroSection onLogin={startSignIn} onStartJourney={startOnboarding} />
                <OpportunitySearchSection />
                <RecommendedMatchesSection />
                <CoursesSection />
                <MentorLMPreviewSection />
                <FaqSection />
              </PageShell>
            }
          />
          <Route path="/onboarding" element={onboardingRoute} />
          <Route path="/registration" element={registrationRoute} />
          <Route
            path="/dashboard"
            element={protectedRoute(
              <DashboardSection profile={profile as StudentProfile} extraOpportunities={activeOpportunities} onLogout={logout} />
            )}
          />
          <Route
            path="/courses"
            element={protectedRoute(<CoursesWorkspace profile={profile as StudentProfile} onLogout={logout} />)}
          />
          <Route path="/courses/:courseId" element={protectedRoute(<CourseDetailWorkspace profile={profile as StudentProfile} onLogout={logout} />)} />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={protectedRoute(<LessonWorkspace profile={profile as StudentProfile} onLogout={logout} />)}
          />
          <Route
            path="/opportunities"
            element={protectedRoute(
              <OpportunitiesWorkspace profile={profile as StudentProfile} extraOpportunities={activeOpportunities} onLogout={logout} />
            )}
          />
          <Route
            path="/mentor-lm"
            element={protectedRoute(
              <MentorLMSection profile={profile as StudentProfile} opportunities={telegramOpportunities} onLogout={logout} />
            )}
          />
          <Route
            path="/roadmap"
            element={protectedRoute(
              <RoadmapWorkspace profile={profile as StudentProfile} extraOpportunities={activeOpportunities} onLogout={logout} />
            )}
          />
          <Route
            path="/admin"
            element={protectedRoute(<AdminWorkspace profile={profile as StudentProfile} onLogout={logout} />)}
          />
          <Route path="*" element={<Navigate replace to={profile ? "/dashboard" : "/"} />} />
        </Routes>
      </AnimatePresence>
    </LayoutGroup>
  );
}
