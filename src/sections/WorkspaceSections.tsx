import type { FormEvent, KeyboardEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  ChatCircleDots,
  CheckCircle,
  Compass,
  DownloadSimple,
  EyeSlash,
  FileText,
  LinkSimple,
  MagnifyingGlass,
  MapTrifold,
  NotePencil,
  Paperclip,
  PaperPlaneTilt,
  PlayCircle,
  UploadSimple,
  VideoCamera,
  WarningCircle,
  X
} from "@phosphor-icons/react";
import { Link, NavLink, Navigate, useParams } from "react-router-dom";
import {
  courses,
  formatOpportunityDeadline,
  getLessonAssignmentPrompt,
  getLessonSearchText,
  getOptionLabel,
  getOptionLabels,
  getOpportunityPool,
  getRecommendedOpportunities,
  opportunities
} from "../data/content";
import type { Course, Lesson, LessonMaterial, LessonSelfCheckQuestion, OnboardingProfile, Opportunity } from "../data/content";
import { sendMessage } from "../lib/mentorLM";
import type { ChatMessage } from "../lib/mentorLM";
import { getOpportunityDisplaySearchText, getOpportunityTranslation } from "../lib/opportunityText";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import {
  defaultStudentWorkspaceState,
  dismissRecommendedOpportunitiesWindow,
  enrollStudentCourse,
  fetchMentorLMLessonNotes,
  fetchStudentCourseEnrollments,
  fetchStudentOpportunities,
  fetchStudentWorkspaceState,
  saveMentorLMLessonNote,
  saveStudentOpportunity,
  setMentorLMLessonNotesHidden
} from "../lib/studentState";
import type {
  MentorLMLessonNote,
  StudentCourseEnrollment,
  StudentOpportunity,
  StudentOpportunitySource,
  StudentOpportunityStatus
} from "../lib/studentState";
import type { StudentProfile } from "./AuthFlowSections";

type WorkspaceProps = {
  profile: StudentProfile;
  onLogout: () => void;
};

type DashboardSectionProps = WorkspaceProps & {
  extraOpportunities?: Opportunity[];
};

type OpportunitiesWorkspaceProps = WorkspaceProps & {
  extraOpportunities?: Opportunity[];
};

const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 24
} as const;

const assignmentAttachmentBucket = "lesson-assignment-attachments";
const anyOpportunityFilterValue = "any";

type OpportunityFilterState = {
  direction: string;
  format: string;
  location: string;
  grade: string;
  category: string;
};

const emptyOpportunityFilters: OpportunityFilterState = {
  direction: anyOpportunityFilterValue,
  format: anyOpportunityFilterValue,
  location: anyOpportunityFilterValue,
  grade: anyOpportunityFilterValue,
  category: anyOpportunityFilterValue
};

type AssignmentSubmitState = "idle" | "loading" | "success" | "error";
type StudentStateError = string;

function sanitizeFileName(fileName: string) {
  const sanitizedName = fileName.trim().replace(/[^a-zA-Z0-9._-]+/g, "-");

  return sanitizedName || "assignment-file";
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }

      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

function normalizeQuizAnswer(value: string) {
  return value.trim().toLowerCase();
}

function isSelfCheckAnswerCorrect(question: LessonSelfCheckQuestion, answer: string) {
  const normalizedAnswer = normalizeQuizAnswer(answer);

  if (!normalizedAnswer) {
    return false;
  }

  if (question.type === "radio") {
    return normalizedAnswer === normalizeQuizAnswer(question.correctAnswer);
  }

  const acceptedAnswers = question.acceptedAnswers?.length ? question.acceptedAnswers : [question.correctAnswer];

  return acceptedAnswers.some((acceptedAnswer) => normalizedAnswer.includes(normalizeQuizAnswer(acceptedAnswer)));
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

function getStateErrorMessage(error: unknown, fallback: string): StudentStateError {
  return error instanceof Error ? error.message : fallback;
}

function useStudentCourseEnrollmentState(profileId: string) {
  const [enrollments, setEnrollments] = useState<StudentCourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<StudentStateError>("");

  useEffect(() => {
    let isMounted = true;

    async function loadEnrollments() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchStudentCourseEnrollments(profileId);

        if (isMounted) {
          setEnrollments(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setEnrollments([]);
          setError(getStateErrorMessage(loadError, "Course enrollments could not be loaded."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEnrollments();

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  async function enrollCourse(courseId: string) {
    const enrollment = await enrollStudentCourse(profileId, courseId);

    setEnrollments((currentEnrollments) => {
      const nextEnrollments = currentEnrollments.filter((currentEnrollment) => currentEnrollment.course_id !== courseId);
      return [enrollment, ...nextEnrollments];
    });

    return enrollment;
  }

  return { enrollCourse, enrollments, error, loading };
}

function useStudentOpportunityState(profileId: string) {
  const [studentOpportunities, setStudentOpportunities] = useState<StudentOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<StudentStateError>("");

  useEffect(() => {
    let isMounted = true;

    async function loadOpportunities() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchStudentOpportunities(profileId);

        if (isMounted) {
          setStudentOpportunities(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setStudentOpportunities([]);
          setError(getStateErrorMessage(loadError, "Saved opportunities could not be loaded."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOpportunities();

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  async function saveOpportunity(
    opportunityId: string,
    source: StudentOpportunitySource = "search",
    status: StudentOpportunityStatus = "saved"
  ) {
    const opportunity = await saveStudentOpportunity(profileId, opportunityId, source, status);

    setStudentOpportunities((currentOpportunities) => {
      const nextOpportunities = currentOpportunities.filter((currentOpportunity) => currentOpportunity.opportunity_id !== opportunityId);
      return [opportunity, ...nextOpportunities];
    });

    return opportunity;
  }

  return { error, loading, saveOpportunity, studentOpportunities };
}

function useStudentWorkspaceState(profileId: string) {
  const [workspaceState, setWorkspaceState] = useState(() => defaultStudentWorkspaceState(profileId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<StudentStateError>("");

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspaceState() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchStudentWorkspaceState(profileId);

        if (isMounted) {
          setWorkspaceState(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setWorkspaceState(defaultStudentWorkspaceState(profileId));
          setError(getStateErrorMessage(loadError, "Workspace state could not be loaded."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadWorkspaceState();

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  async function dismissRecommendedWindow() {
    const data = await dismissRecommendedOpportunitiesWindow(profileId);
    setWorkspaceState(data);
    return data;
  }

  return { dismissRecommendedWindow, error, loading, workspaceState };
}

function getCourseById(courseId?: string) {
  return courses.find((course) => course.id === courseId);
}

function getLessonById(course: Course | undefined, lessonId?: string) {
  return course?.lessons.find((lesson) => lesson.id === lessonId);
}

function getRandomizedCourses(courseList: Course[]) {
  return [...courseList]
    .map((course) => ({ course, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => item.course);
}

function getCourseSearchText(course: Course) {
  return [
    course.title,
    course.description,
    course.difficulty,
    course.track,
    ...course.tags,
    ...course.lessons.map(getLessonSearchText)
  ]
    .join(" ")
    .toLowerCase();
}

function getOpportunitySearchText(opportunity: Opportunity) {
  return [
    opportunity.title,
    opportunity.category,
    opportunity.direction,
    opportunity.format,
    opportunity.location,
    opportunity.deadline,
    opportunity.eventDate,
    getOpportunityDisplaySearchText(opportunity),
    ...opportunity.grades,
    ...opportunity.tags
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getSortedUniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function getSortedGradeValues(opportunityPool: Opportunity[]) {
  return [...new Set(opportunityPool.flatMap((opportunity) => opportunity.grades))]
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
}

function hasActiveOpportunityFilters(filters: OpportunityFilterState) {
  return Object.values(filters).some((value) => value !== anyOpportunityFilterValue);
}

function opportunityMatchesFilters(opportunity: Opportunity, filters: OpportunityFilterState) {
  return (
    (filters.direction === anyOpportunityFilterValue || opportunity.direction === filters.direction) &&
    (filters.format === anyOpportunityFilterValue || opportunity.format === filters.format) &&
    (filters.location === anyOpportunityFilterValue || opportunity.location === filters.location) &&
    (filters.grade === anyOpportunityFilterValue || opportunity.grades.includes(filters.grade)) &&
    (filters.category === anyOpportunityFilterValue || opportunity.category === filters.category)
  );
}

export function WorkspaceRail({ onLogout }: { onLogout: () => void }) {
  const navItems = [
    { to: "/roadmap", label: "Roadmap", icon: MapTrifold },
    { to: "/courses", label: "My courses", icon: BookOpen },
    { to: "/opportunities", label: "My opportunity", icon: Compass },
    { to: "/mentor-lm", label: "MentorLM", icon: ChatCircleDots }
  ];

  return (
    <nav className="workspace-top-rail workspace-rail" aria-label="Mentoria Hub workspace navigation">
      <NavLink
        className={({ isActive }) => `wordmark workspace-me-link${isActive ? " workspace-nav-link-active" : ""}`}
        to="/dashboard"
        end
      >
        Me
      </NavLink>
      <div className="workspace-top-links workspace-link-row">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) => `workspace-nav-link${isActive ? " workspace-nav-link-active" : ""}`}
              key={item.to}
              to={item.to}
            >
              <Icon aria-hidden="true" size={15} weight="light" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <ThemeToggle className="workspace-theme-toggle" />
        <button className="workspace-logout-link" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

function WorkspaceHeader({
  kicker,
  title,
  description,
  children
}: {
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="workspace-heading workspace-heading-centered"
      initial={{ opacity: 0, y: 16 }}
      transition={springTransition}
    >
      <p className="flow-kicker">{kicker}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </motion.div>
  );
}

function CourseCover({
  course,
  lesson,
  layoutId,
  variant = "large",
  showTrack = false
}: {
  course: Course;
  lesson?: Lesson;
  layoutId: string;
  variant?: "large" | "small" | "hero";
  showTrack?: boolean;
}) {
  const imageUrl = lesson?.coverUrl ?? course.coverUrl;

  return (
    <motion.div
      className={`workspace-cover workspace-cover-${variant}`}
      layoutId={layoutId}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      transition={springTransition}
    >
      {showTrack ? <span>{course.track}</span> : null}
      <strong>{lesson?.title ?? course.title}</strong>
    </motion.div>
  );
}

function WorkspaceEmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="workspace-empty-state" role="status">
      <span aria-hidden="true" />
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}

function DeadlineCalendar({ opportunities }: { opportunities: Opportunity[] }) {
  const cells = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const opportunityMap = new Map<number, Opportunity>();
    opportunities.forEach((opportunity) => {
      const deadline = new Date(opportunity.deadline);
      deadline.setHours(0, 0, 0, 0);
      opportunityMap.set(deadline.getTime(), opportunity);
    });

    return Array.from({ length: 52 * 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor((52 * 7) / 2) + index);
      date.setHours(0, 0, 0, 0);

      return {
        date,
        opportunity: opportunityMap.get(date.getTime())
      };
    });
  }, [opportunities]);

  return (
    <section className="dashboard-panel calendar-panel centered-glass-panel" aria-labelledby="calendar-title">
      <div className="panel-heading">
        <div>
          <span>Timeline</span>
          <h2 id="calendar-title">Deadline Calendar</h2>
        </div>
      </div>
      <div className="deadline-calendar-grid">
        {cells.map((cell) => (
          <div
            className={`calendar-cell ${cell.opportunity ? "has-deadline" : ""}`}
            key={cell.date.toISOString()}
            title={
              cell.opportunity
                ? `${getOpportunityTranslation(cell.opportunity).title} (Due: ${cell.date.toLocaleDateString()})`
                : cell.date.toLocaleDateString()
            }
          />
        ))}
      </div>
    </section>
  );
}

export function DashboardSection({ profile, extraOpportunities = [], onLogout }: DashboardSectionProps) {
  const onboardingProfile = buildOnboardingProfile(profile);
  const interestLabels = getOptionLabels("interests", profile.interests);
  const directionLabel = getOptionLabel("academicDirection", profile.academicDirection);
  const allOpportunities = getOpportunityPool(extraOpportunities);
  const recommendedOpportunities = getRecommendedOpportunities(onboardingProfile, allOpportunities, 3);
  const recommendedWindowOpportunities = recommendedOpportunities;
  const { enrollments } = useStudentCourseEnrollmentState(profile.id);
  const { saveOpportunity, studentOpportunities } = useStudentOpportunityState(profile.id);
  const {
    dismissRecommendedWindow,
    loading: workspaceStateLoading,
    workspaceState
  } = useStudentWorkspaceState(profile.id);
  const [dashboardActionError, setDashboardActionError] = useState("");
  const activeCourseEnrollments = enrollments.filter((enrollment) => enrollment.status === "active");
  const activeCourseIds = activeCourseEnrollments.map((enrollment) => enrollment.course_id);
  const enrollmentByCourseId = new Map(activeCourseEnrollments.map((enrollment) => [enrollment.course_id, enrollment]));
  const enrolledCourses = courses.filter((course) => activeCourseIds.includes(course.id));
  const showRecommendedWindow =
    !workspaceStateLoading && !workspaceState.recommended_opportunities_dismissed && recommendedWindowOpportunities.length === 3;

  async function closeRecommendedWindow() {
    setDashboardActionError("");

    try {
      await dismissRecommendedWindow();
    } catch (error) {
      setDashboardActionError(getStateErrorMessage(error, "Recommended opportunities could not be dismissed."));
    }
  }

  async function saveRecommendedOpportunity(opportunityId: string) {
    setDashboardActionError("");

    try {
      await saveOpportunity(opportunityId, "recommended-window", "chosen");
      await dismissRecommendedWindow();
    } catch (error) {
      setDashboardActionError(getStateErrorMessage(error, "Recommended opportunity could not be saved."));
    }
  }

  return (
    <section className="flow-screen dashboard-screen centered-workspace-screen" aria-labelledby="dashboard-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="dashboard-shell centered-workspace-shell">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-hero centered-dashboard-hero"
          initial={{ opacity: 0, y: 18 }}
          transition={springTransition}
        >
          <div>
            <p className="flow-kicker">Welcome back</p>
            <h1 id="dashboard-title">{profile.name}</h1>
            <p>
              Grade {profile.grade} profile focused on {directionLabel}. Recommended opportunities are ranked from your
              onboarding answers, curated Mentoria programs, and the cleaned Telegram opportunity feed.
            </p>
          </div>
          <div className="profile-summary centered-profile-summary" aria-label="Onboarding profile summary">
            {interestLabels.slice(0, 5).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </motion.div>

        <div className="metric-strip centered-metric-strip" aria-label="Dashboard statistics">
          <article>
            <span>Active courses</span>
            <strong>{activeCourseEnrollments.length}</strong>
            <Link className="secondary-action compact-action text-action-link" to="/courses">
              View
            </Link>
          </article>
          <article>
            <span>Chosen opportunities</span>
            <strong>{studentOpportunities.length}</strong>
            <Link className="secondary-action compact-action text-action-link" to="/opportunities">
              View
            </Link>
          </article>
        </div>

        <DeadlineCalendar opportunities={recommendedOpportunities} />

        <div className="dashboard-columns centered-dashboard-columns">
          {showRecommendedWindow ? (
            <section className="dashboard-panel recommended-opportunities-window" aria-labelledby="recommended-opportunities-title">
              <div className="panel-heading recommended-window-heading">
                <div>
                  <h2 id="recommended-opportunities-title">Recommended opportunities</h2>
                </div>
                <button
                  className="window-close-button"
                  type="button"
                  aria-label="Close Recommended opportunities"
                  onClick={closeRecommendedWindow}
                >
                  <X aria-hidden="true" size={15} weight="bold" />
                </button>
              </div>
              <div className="match-list">
                {recommendedWindowOpportunities.map((opportunity) => (
                  <OpportunitySummary
                    opportunity={opportunity}
                    key={opportunity.id}
                    onSave={() => saveRecommendedOpportunity(opportunity.id)}
                  />
                ))}
              </div>
              <p className="recommended-window-note">
                we’ve found something you might like from your answers to onboarding questions
              </p>
              {dashboardActionError ? <p className="workspace-state-error">{dashboardActionError}</p> : null}
              <div className="recommended-window-actions">
                <Link className="secondary-action compact-action text-action-link" to="/opportunities">
                  Opportunity search
                </Link>
                <Link className="secondary-action compact-action text-action-link" to="/mentor-lm">
                  Ask MentorLM
                </Link>
              </div>
            </section>
          ) : null}

          <section className="dashboard-panel dashboard-panel-soft centered-glass-panel" aria-labelledby="recommended-courses-title">
            <div className="panel-heading">
              <div>
                <h2 id="recommended-courses-title">Learning</h2>
              </div>
              <Link className="secondary-action compact-action text-action-link" to="/courses">
                My courses
              </Link>
            </div>
            <div className="course-progress-list">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <CourseProgressRow
                    course={course}
                    key={course.id}
                    progressPercent={Number(enrollmentByCourseId.get(course.id)?.progress_percent ?? 0)}
                  />
                ))
              ) : (
                <div className="workspace-empty-state learning-empty-state" role="status">
                  <span aria-hidden="true" />
                  <strong>It seems like you don’t have anything to learn</strong>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export function CoursesWorkspace({ profile, onLogout }: WorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { enrollments } = useStudentCourseEnrollmentState(profile.id);
  const randomizedCourses = useMemo(() => getRandomizedCourses(courses), []);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const enrolledCourseIds = enrollments.map((enrollment) => enrollment.course_id);
  const enrolledCourses = courses.filter((course) => enrolledCourseIds.includes(course.id));
  const catalogCourses = normalizedSearchQuery
    ? randomizedCourses.filter((course) => getCourseSearchText(course).includes(normalizedSearchQuery))
    : randomizedCourses;

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="workspace-courses-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell course-browser-shell">
        <WorkspaceHeader
          description={`${profile.name}, your course list is live from the course catalog. New courses added to data will appear here automatically.`}
          kicker="Mentoria courses"
          title="My courses"
        />

        <section className="my-courses-panel centered-glass-panel" aria-labelledby="enrolled-courses-title">
          <div className="panel-heading">
            <div>
              <h2 id="enrolled-courses-title">Enrolled courses</h2>
            </div>
          </div>
          {enrolledCourses.length > 0 ? (
            <div className="enrolled-course-list">
              {enrolledCourses.map((course) => (
                <Link className="enrolled-course-pill" to={`/courses/${course.id}`} key={course.id}>
                  <span>{course.title}</span>
                  <strong>{course.lessons.length} lessons</strong>
                </Link>
              ))}
            </div>
          ) : (
            <div className="workspace-empty-state course-empty-state" role="status">
              <span aria-hidden="true" />
              <strong>Oops, there are no courses. Would you like to find some?</strong>
            </div>
          )}
        </section>

        <label className="course-searchbar" htmlFor="course-catalog-search">
          <MagnifyingGlass aria-hidden="true" size={18} weight="light" />
          <input
            id="course-catalog-search"
            type="search"
            value={searchQuery}
            placeholder="Search the course catalog"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        <div className="course-browser-list" aria-label="Course catalog feed">
          {catalogCourses.length > 0 ? (
            catalogCourses.map((course, index) => {
              const previewLessons = course.lessons.slice(0, 3);

              return (
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className="course-browser-card"
                  initial={{ opacity: 0, y: 18 }}
                  key={course.id}
                  transition={{ ...springTransition, delay: index * 0.04 }}
                >
                  <Link className="course-browser-main" to={`/courses/${course.id}`}>
                    <CourseCover course={course} layoutId={`course-cover-${course.id}`} variant="large" />
                    <span className="course-browser-copy">
                      <strong>{course.title}</strong>
                      <span>{course.description}</span>
                    </span>
                    <span className="course-browser-meta">
                      <span>{course.difficulty}</span>
                      <span>{course.lessons.length} lessons</span>
                    </span>
                    <span className="primary-action compact-action course-open-action">
                      <span>Open course</span>
                      <ArrowRight aria-hidden="true" size={15} weight="light" />
                    </span>
                  </Link>
                  <div className="course-catalog-preview" aria-label={`${course.title} lesson preview`}>
                    {previewLessons.map((lesson) => (
                      <div className="course-preview-lesson" key={lesson.id}>
                        <span>{lesson.duration}</span>
                        <strong>{lesson.title}</strong>
                        <p>{lesson.description ?? getLessonAssignmentPrompt(lesson)}</p>
                      </div>
                    ))}
                  </div>
                </motion.article>
              );
            })
          ) : (
            <WorkspaceEmptyState title="No matching courses" message="Try a different course, topic, or lesson keyword." />
          )}
        </div>
      </div>
    </section>
  );
}

export function CourseDetailWorkspace({ profile, onLogout }: WorkspaceProps) {
  const { courseId } = useParams();
  const course = getCourseById(courseId);
  const { enrollCourse, enrollments } = useStudentCourseEnrollmentState(profile.id);
  const [enrollError, setEnrollError] = useState("");

  if (!course) {
    return <Navigate replace to="/courses" />;
  }

  const courseIdToEnroll = course.id;
  const enrolled = enrollments.some((enrollment) => enrollment.course_id === course.id && enrollment.status !== "archived");

  async function handleEnrollCourse() {
    setEnrollError("");

    try {
      await enrollCourse(courseIdToEnroll);
    } catch (error) {
      setEnrollError(getStateErrorMessage(error, "Course enrollment could not be saved."));
    }
  }

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="course-detail-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell course-detail-shell">
        <Link className="course-back-link" to="/courses" aria-label="Back to course search/catalog">
          <ArrowLeft aria-hidden="true" size={22} weight="light" />
        </Link>
        <WorkspaceHeader description={course.description} kicker="Course catalog" title={course.title} />
        <CourseCover course={course} layoutId={`course-cover-${course.id}`} variant="hero" />
        {!enrolled ? (
          <button
            className="primary-action course-enroll-action"
            disabled={!course.enrollmentSettings.isOpen}
            type="button"
            onClick={handleEnrollCourse}
          >
            enroll this course
          </button>
        ) : null}
        {enrollError ? <p className="workspace-state-error">{enrollError}</p> : null}

        <div className="lesson-list-shell" aria-label={`${course.title} lessons`}>
          {course.lessons.map((lesson, index) => (
            <div className="lesson-list-group" key={lesson.id}>
              <Link className="lesson-row-link" to={`/courses/${course.id}/lessons/${lesson.id}`}>
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className="lesson-row-card"
                  initial={{ opacity: 0, y: 14 }}
                  layoutId={`lesson-row-${course.id}-${lesson.id}`}
                  transition={{ ...springTransition, delay: index * 0.035 }}
                >
                  <CourseCover course={course} lesson={lesson} layoutId={`lesson-cover-${course.id}-${lesson.id}`} variant="small" />
                  <div>
                    <span>{lesson.duration}</span>
                    <h2>{lesson.title}</h2>
                    <p>{lesson.description ?? getLessonAssignmentPrompt(lesson)}</p>
                  </div>
                  <span className="lesson-row-action">
                    go to the lesson
                  </span>
                </motion.article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LessonVideoPanel({ lesson }: { lesson: Lesson }) {
  const videoUrl = lesson.video.url?.trim();
  const youtubeEmbedUrl = videoUrl && lesson.video.sourceType === "youtube" ? getYoutubeEmbedUrl(videoUrl) : "";
  const hasDirectVideo = videoUrl && lesson.video.sourceType === "file";
  const hasExternalVideo = videoUrl && !youtubeEmbedUrl && !hasDirectVideo;

  return (
    <section className="lesson-video-section lesson-flow-module" aria-labelledby="lesson-video-title">
      <div className="lesson-video-heading">
        <VideoCamera aria-hidden="true" size={20} weight="light" />
        <h2 id="lesson-video-title">{lesson.video.label}</h2>
      </div>
      <div className="lesson-video-frame">
        {youtubeEmbedUrl ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="lesson-video-player"
            src={youtubeEmbedUrl}
            title={lesson.video.label}
          />
        ) : null}
        {hasDirectVideo ? (
          <video className="lesson-video-player" controls playsInline preload="metadata">
            <source src={videoUrl} />
            Your browser does not support the video element.
          </video>
        ) : null}
        {hasExternalVideo ? (
          <div className="lesson-video-placeholder">
            <PlayCircle aria-hidden="true" size={36} weight="light" />
            <strong>{lesson.video.sourceType === "telegram" ? "Telegram lesson video" : "External lesson video"}</strong>
            <p>This source opens in a separate player window when embedding is not available.</p>
            <a className="primary-action compact-action" href={videoUrl} target="_blank" rel="noreferrer">
              <span>Open video lesson</span>
              <ArrowSquareOut aria-hidden="true" size={15} weight="light" />
            </a>
          </div>
        ) : null}
        {!videoUrl ? (
          <div className="lesson-video-example-wrapper">
            {/* EXAMPLE VIDEO PLACEHOLDER - REMOVABLE */}
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="lesson-video-player"
              src={
                [
                  "https://www.youtube.com/embed/QnQe0xW_JY4",
                  "https://www.youtube.com/embed/3nL2rZ6fL1o",
                  "https://www.youtube.com/embed/PjRkEhbXW_M",
                  "https://www.youtube.com/embed/Xq1A3eH9Zvw"
                ][lesson.id.length % 4]
              }
              title="Example Placeholder Video"
            />
            <div className="lesson-video-placeholder" style={{ borderTop: "none", borderRadius: "0 0 12px 12px", marginTop: "-4px" }}>
              <VideoCamera aria-hidden="true" size={24} weight="light" />
              <strong>Example Video</strong>
              <p>This is a placeholder. A mentor or admin can add a real YouTube or Telegram link later.</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function LessonAssignmentPanel({ course, lesson }: { course: Course; lesson: Lesson }) {
  const [answer, setAnswer] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [savedAttachmentName, setSavedAttachmentName] = useState("");
  const [savedAttachmentPath, setSavedAttachmentPath] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [submitState, setSubmitState] = useState<AssignmentSubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const fileInputId = `lesson-assignment-file-${course.id}-${lesson.id}`;
  const canSubmit = answer.trim().length > 0 || Boolean(attachment);

  useEffect(() => {
    let isMounted = true;

    async function loadSubmission() {
      if (!isSupabaseConfigured || !supabase) {
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        return;
      }

      const { data, error } = await supabase
        .from("lesson_assignment_submissions")
        .select("answer, attachment_name, attachment_path, submitted_at")
        .eq("student_id", authData.user.id)
        .eq("course_id", course.id)
        .eq("lesson_id", lesson.id)
        .maybeSingle();

      if (!isMounted || error || !data) {
        return;
      }

      setAnswer(data.answer ?? "");
      setSavedAttachmentName(data.attachment_name ?? "");
      setSavedAttachmentPath(data.attachment_path ?? "");
      setSubmittedAt(data.submitted_at ?? "");
    }

    loadSubmission();

    return () => {
      isMounted = false;
    };
  }, [course.id, lesson.id]);

  function handleAttachmentChange(file: File | undefined) {
    if (!file) {
      setAttachment(null);
      return;
    }

    const maxFileSizeBytes = lesson.assignment.maxFileSizeMb * 1024 * 1024;

    if (file.size > maxFileSizeBytes) {
      setSubmitState("error");
      setSubmitMessage(`Attach a file up to ${lesson.assignment.maxFileSizeMb} MB.`);
      setAttachment(null);
      return;
    }

    setAttachment(file);
    setSubmitState("idle");
    setSubmitMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setSubmitState("error");
      setSubmitMessage("Supabase is not configured, so the assignment cannot be submitted yet.");
      return;
    }

    setSubmitState("loading");
    setSubmitMessage("");

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Sign in again to submit this assignment.");
      }

      let attachmentPath = savedAttachmentPath || null;
      let attachmentName = savedAttachmentName || null;

      if (attachment) {
        const storedFileName = `${Date.now()}-${sanitizeFileName(attachment.name)}`;
        attachmentPath = `${authData.user.id}/${course.id}/${lesson.id}/${storedFileName}`;
        attachmentName = attachment.name;

        const { error: uploadError } = await supabase.storage
          .from(assignmentAttachmentBucket)
          .upload(attachmentPath, attachment, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          throw uploadError;
        }
      }

      const submittedAtIso = new Date().toISOString();
      const { data, error } = await supabase
        .from("lesson_assignment_submissions")
        .upsert(
          {
            student_id: authData.user.id,
            course_id: course.id,
            lesson_id: lesson.id,
            answer: answer.trim(),
            attachment_name: attachmentName,
            attachment_path: attachmentPath,
            submitted_at: submittedAtIso
          },
          { onConflict: "student_id,course_id,lesson_id" }
        )
        .select("attachment_name, attachment_path, submitted_at")
        .single();

      if (error) {
        throw error;
      }

      setAttachment(null);
      setSavedAttachmentName(data.attachment_name ?? "");
      setSavedAttachmentPath(data.attachment_path ?? "");
      setSubmittedAt(data.submitted_at ?? submittedAtIso);
      setSubmitState("success");
      setSubmitMessage("Assignment submitted.");
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : "Assignment submission failed.");
    }
  }

  return (
    <section className="lesson-flow-module lesson-assignment-module" aria-labelledby="lesson-assignment-title">
      <div className="lesson-module-heading">
        <span>1. Assignment</span>
        <h2 id="lesson-assignment-title">Submit your answer</h2>
      </div>
      <form className="lesson-assignment-form" onSubmit={handleSubmit}>
        <p>{lesson.assignment.prompt}</p>
        <label className="lesson-answer-field" htmlFor="lesson-assignment-answer">
          <span>Your answer</span>
          <textarea
            id="lesson-assignment-answer"
            rows={6}
            value={answer}
            placeholder="Write your answer here"
            onChange={(event) => setAnswer(event.target.value)}
          />
        </label>
        {lesson.assignment.acceptsFiles ? (
          <div className="lesson-attachment-row">
            <input
              accept={lesson.assignment.acceptedFileTypes.join(",")}
              className="lesson-file-input"
              id={fileInputId}
              type="file"
              onChange={(event) => handleAttachmentChange(event.target.files?.[0])}
            />
            <label className="secondary-action compact-action lesson-attach-action" htmlFor={fileInputId}>
              <Paperclip aria-hidden="true" size={16} weight="light" />
              <span>Attach file</span>
            </label>
            <span className="lesson-attachment-name">
              {attachment?.name ?? savedAttachmentName ?? "No file attached"}
            </span>
          </div>
        ) : null}
        <div className="lesson-submit-row">
          <button className="primary-action lesson-submit-button" type="submit" disabled={!canSubmit || submitState === "loading"}>
            <UploadSimple aria-hidden="true" size={17} weight="light" />
            <span>{submitState === "loading" ? "Submitting" : lesson.assignment.submitLabel}</span>
          </button>
          {submittedAt ? <span className="lesson-submitted-at">Last submitted {new Date(submittedAt).toLocaleDateString()}</span> : null}
        </div>
        {submitMessage ? (
          <p className={`lesson-submit-message lesson-submit-message-${submitState}`} role="status">
            {submitState === "success" ? <CheckCircle aria-hidden="true" size={16} weight="light" /> : null}
            {submitState === "error" ? <WarningCircle aria-hidden="true" size={16} weight="light" /> : null}
            <span>{submitMessage}</span>
          </p>
        ) : null}
      </form>
    </section>
  );
}

function getMaterialIcon(material: LessonMaterial) {
  if (material.kind === "download" || material.downloadable) {
    return DownloadSimple;
  }

  if (material.kind === "link") {
    return LinkSimple;
  }

  return FileText;
}

function LessonMaterialsPanel({ lesson }: { lesson: Lesson }) {
  return (
    <section className="lesson-flow-module lesson-materials-module" aria-labelledby="lesson-materials-title">
      <div className="lesson-module-heading">
        <span>2. Materials</span>
        <h2 id="lesson-materials-title">Lesson materials</h2>
      </div>
      <div className="lesson-material-list">
        {lesson.materials.map((material) => {
          const Icon = getMaterialIcon(material);

          return (
            <a
              className="lesson-material-row"
              download={material.downloadable ? `${material.id}.txt` : undefined}
              href={material.url}
              key={material.id}
              rel={material.downloadable ? undefined : "noreferrer"}
              target={material.downloadable ? undefined : "_blank"}
            >
              <span className="lesson-material-icon">
                <Icon aria-hidden="true" size={19} weight="light" />
              </span>
              <span>
                <strong>{material.title}</strong>
                <small>{material.description ?? (material.downloadable ? "Downloadable material" : "Open material")}</small>
              </span>
              <ArrowRight aria-hidden="true" size={15} weight="light" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

function LessonSelfCheckPanel({ lesson }: { lesson: Lesson }) {
  const questions = lesson.selfCheck.questions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const completedCount = Object.keys(results).length;
  const score = Object.values(results).filter(Boolean).length;
  const isComplete = completedCount === questions.length;
  const question = questions[currentQuestionIndex];
  const answer = answers[question.id] ?? "";
  const result = results[question.id];
  const canCheck = answer.trim().length > 0 && result === undefined && !isAdvancing;

  function updateAnswer(questionId: string, value: string) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value
    }));
  }

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    const isCorrect = isSelfCheckAnswerCorrect(question, answer);
    setResults((currentResults) => ({
      ...currentResults,
      [question.id]: isCorrect
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setIsAdvancing(true);
      window.setTimeout(() => {
        setCurrentQuestionIndex((currentIndex) => (currentIndex === currentQuestionIndex ? currentQuestionIndex + 1 : currentIndex));
        setIsAdvancing(false);
      }, 700);
    }
  }

  return (
    <section className="lesson-flow-module lesson-check-module" aria-labelledby="lesson-check-title">
      <div className="lesson-module-heading">
        <span>3. Check</span>
        <h2 id="lesson-check-title">Self-check</h2>
      </div>
      {isComplete ? (
        <div className="lesson-check-result-summary" role="status">
          <strong>{score}/3 correct</strong>
          <p>{lesson.selfCheck.scoreComments[score as 0 | 1 | 2 | 3]}</p>
        </div>
      ) : (
        <div className={`lesson-check-question${result === true ? " is-correct" : ""}${result === false ? " is-incorrect" : ""}`}>
          <span className="lesson-check-progress">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <h3>{question.prompt}</h3>
          {question.type === "radio" ? (
            <div className="lesson-check-options">
              {question.options?.map((option) => {
                const selected = answer === option;
                const optionCorrect = result !== undefined && normalizeQuizAnswer(option) === normalizeQuizAnswer(question.correctAnswer);
                const optionWrong = result === false && selected && !optionCorrect;

                return (
                  <label
                    className={`lesson-check-option${selected ? " is-selected" : ""}${optionCorrect ? " is-correct" : ""}${
                      optionWrong ? " is-incorrect" : ""
                    }`}
                    key={option}
                  >
                    <input
                      checked={selected}
                      name={question.id}
                      type="radio"
                      value={option}
                      onChange={(event) => updateAnswer(question.id, event.target.value)}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <label className="lesson-check-text-field">
              <span>Your answer</span>
              <input
                type="text"
                value={answer}
                placeholder="Type your answer"
                onChange={(event) => updateAnswer(question.id, event.target.value)}
              />
            </label>
          )}
          <button className="secondary-action compact-action lesson-check-button" type="button" disabled={!canCheck} onClick={handleCheck}>
            Check
          </button>
          {result !== undefined ? (
            <p className={`lesson-check-feedback${result ? " is-correct" : " is-incorrect"}`} role="status">
              {result ? question.feedback.correct : question.feedback.incorrect}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

type NoteSaveState = "idle" | "loading" | "success" | "error";

function getMentorNoteTitle(body: string) {
  const cleanBody = body.replace(/\s+/g, " ").trim();
  const firstSentence = cleanBody.match(/^.{1,80}?(?:[.!?]|$)/)?.[0].replace(/[.!?]$/, "").trim();

  return firstSentence || "MentorLM note";
}

function MentorLMMiniWindow({
  course,
  hasHiddenNotes,
  lesson,
  onNoteSaved,
  onShowNotes,
  profile
}: {
  course: Course;
  hasHiddenNotes: boolean;
  lesson: Lesson;
  onNoteSaved: (note: MentorLMLessonNote) => void;
  onShowNotes: () => void;
  profile: StudentProfile;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [saveState, setSaveState] = useState<NoteSaveState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [savedAssistantBody, setSavedAssistantBody] = useState("");
  const latestAssistantBody = [...messages].reverse().find((message) => message.role === "assistant" && message.content.trim())?.content.trim() ?? "";
  const canSaveLatest =
    lesson.mentorLMNoteConfig.allowStudentSave &&
    latestAssistantBody.length > 0 &&
    latestAssistantBody !== savedAssistantBody &&
    !streaming &&
    saveState !== "loading";

  async function submitMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const text = input.trim();

    if (!text || streaming) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: text };
    const assistantPlaceholder: ChatMessage = { role: "assistant", content: "" };
    const historyForApi = [...messages, userMessage];

    setMessages((currentMessages) => [...currentMessages, userMessage, assistantPlaceholder]);
    setInput("");
    setStreaming(true);
    setSaveState("idle");
    setStatusMessage("");

    try {
      await sendMessage(
        historyForApi,
        {
          name: profile.name,
          grade: profile.grade,
          interests: profile.interests,
          academicDirection: profile.academicDirection
        },
        opportunities,
        (chunk) => {
          setMessages((currentMessages) => {
            const nextMessages = [...currentMessages];
            const lastMessage = nextMessages[nextMessages.length - 1];
            nextMessages[nextMessages.length - 1] = { ...lastMessage, content: lastMessage.content + chunk };
            return nextMessages;
          });
        },
        { lessonContext: { course, lesson } }
      );
    } catch (error) {
      setMessages((currentMessages) => {
        const nextMessages = [...currentMessages];
        nextMessages[nextMessages.length - 1] = {
          role: "assistant",
          content: error instanceof Error ? `Error: ${error.message}` : "Error: MentorLM could not answer right now."
        };
        return nextMessages;
      });
    } finally {
      setStreaming(false);
    }
  }

  async function saveLatestNote() {
    if (!canSaveLatest) {
      return;
    }

    setSaveState("loading");
    setStatusMessage("");

    try {
      const data = await saveMentorLMLessonNote(
        profile.id,
        course.id,
        lesson.id,
        getMentorNoteTitle(latestAssistantBody),
        latestAssistantBody
      );

      onNoteSaved(data);
      setSavedAssistantBody(latestAssistantBody);
      setSaveState("success");
      setStatusMessage("Saved as MentorLM note.");
    } catch (error) {
      setSaveState("error");
      setStatusMessage(error instanceof Error ? error.message : "MentorLM note could not be saved.");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  }

  return (
    <section className="mentorlm-mini-window" aria-label="Mini MentorLM window">
      <div className="mentorlm-mini-heading">
        <div>
          <ChatCircleDots aria-hidden="true" size={19} weight="light" />
          <span>MentorLM</span>
        </div>
        {hasHiddenNotes ? (
          <button className="secondary-action compact-action" type="button" onClick={onShowNotes}>
            Show notes
          </button>
        ) : null}
      </div>
      <p>{hasHiddenNotes ? "Lesson notes are hidden." : "No MentorLM note has been generated for this lesson yet."}</p>
      <div className="mentorlm-mini-chat-log" role="log" aria-live="polite">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div className={`mentorlm-mini-message mentorlm-mini-message-${message.role}`} key={`${message.role}-${index}`}>
              {message.content || (streaming && index === messages.length - 1 ? <span className="mentorlm-cursor" /> : null)}
            </div>
          ))
        ) : (
          <span className="mentorlm-mini-empty">Ask about this lesson or request a study note.</span>
        )}
      </div>
      <form className="mentorlm-mini-form" onSubmit={submitMessage}>
        <label htmlFor={`mentorlm-mini-input-${course.id}-${lesson.id}`}>
          <span>Message MentorLM</span>
          <textarea
            disabled={streaming}
            id={`mentorlm-mini-input-${course.id}-${lesson.id}`}
            rows={2}
            value={input}
            placeholder="Write a question"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>
        <button className="primary-action compact-action mentorlm-mini-send" type="submit" disabled={streaming || !input.trim()} aria-label="Send message">
          {streaming ? "..." : <PaperPlaneTilt aria-hidden="true" size={17} weight="bold" />}
        </button>
      </form>
      {latestAssistantBody ? (
        <div className="mentorlm-mini-note-actions">
          <button className="secondary-action compact-action" type="button" disabled={!canSaveLatest} onClick={saveLatestNote}>
            <NotePencil aria-hidden="true" size={15} weight="light" />
            <span>{saveState === "loading" ? "Saving" : "Save as MentorLM note"}</span>
          </button>
          {statusMessage ? <span className={`mentorlm-mini-status mentorlm-mini-status-${saveState}`}>{statusMessage}</span> : null}
        </div>
      ) : null}
    </section>
  );
}

function LessonMentorLMPanel({
  course,
  lesson,
  notes,
  onNoteSaved,
  onNotesUpdated,
  profile
}: {
  course: Course;
  lesson: Lesson;
  notes: MentorLMLessonNote[];
  onNoteSaved: (note: MentorLMLessonNote) => void;
  onNotesUpdated: (notes: MentorLMLessonNote[]) => void;
  profile: StudentProfile;
}) {
  const [notesActionError, setNotesActionError] = useState("");
  const visibleNotes = notes.filter((note) => !note.is_hidden);
  const hiddenNotes = notes.filter((note) => note.is_hidden);

  async function hideVisibleNotes() {
    setNotesActionError("");

    try {
      const updatedNotes = await setMentorLMLessonNotesHidden(
        profile.id,
        course.id,
        lesson.id,
        visibleNotes.map((note) => note.id),
        true
      );
      onNotesUpdated(updatedNotes);
    } catch (error) {
      setNotesActionError(getStateErrorMessage(error, "MentorLM notes could not be hidden."));
    }
  }

  async function showHiddenNotes() {
    setNotesActionError("");

    try {
      const updatedNotes = await setMentorLMLessonNotesHidden(
        profile.id,
        course.id,
        lesson.id,
        hiddenNotes.map((note) => note.id),
        false
      );
      onNotesUpdated(updatedNotes);
    } catch (error) {
      setNotesActionError(getStateErrorMessage(error, "MentorLM notes could not be shown."));
    }
  }

  const miniWindow = (
    <MentorLMMiniWindow
      course={course}
      hasHiddenNotes={hiddenNotes.length > 0}
      lesson={lesson}
      onNoteSaved={onNoteSaved}
      onShowNotes={showHiddenNotes}
      profile={profile}
    />
  );

  if (visibleNotes.length === 0) {
    return (
      <>
        {miniWindow}
        {notesActionError ? <p className="workspace-state-error">{notesActionError}</p> : null}
      </>
    );
  }

  return (
    <>
      <section className="mentorlm-note-section lesson-flow-module" aria-labelledby="lesson-notes-title">
        <div className="lesson-video-heading lesson-notes-heading">
          <NotePencil aria-hidden="true" size={20} weight="light" />
          <h2 id="lesson-notes-title">MentorLM notes</h2>
          <button className="secondary-action compact-action lesson-hide-notes-button" type="button" onClick={hideVisibleNotes}>
            <EyeSlash aria-hidden="true" size={15} weight="light" />
            <span>Hide notes</span>
          </button>
        </div>
        <div className="mentorlm-note-details">
          {visibleNotes.map((note) => (
            <details key={note.id}>
              <summary>{note.title}</summary>
              <p>{note.body}</p>
            </details>
          ))}
        </div>
      </section>
      {miniWindow}
      {notesActionError ? <p className="workspace-state-error">{notesActionError}</p> : null}
    </>
  );
}

export function LessonWorkspace({ profile, onLogout }: WorkspaceProps) {
  const { courseId, lessonId } = useParams();
  const course = getCourseById(courseId);
  const lesson = getLessonById(course, lessonId);
  const { enrollments } = useStudentCourseEnrollmentState(profile.id);
  const [notes, setNotes] = useState<MentorLMLessonNote[]>([]);
  const lessonEnrolled = course ? enrollments.some((enrollment) => enrollment.course_id === course.id && enrollment.status !== "archived") : false;

  useEffect(() => {
    let isMounted = true;

    async function loadNotes() {
      if (!course || !lesson || !lessonEnrolled) {
        setNotes([]);
        return;
      }

      let data: MentorLMLessonNote[] = [];

      try {
        data = await fetchMentorLMLessonNotes(profile.id, course.id, lesson.id);
      } catch {
        data = [];
      }

      if (!isMounted) {
        return;
      }

      setNotes(data);
    }

    loadNotes();

    return () => {
      isMounted = false;
    };
  }, [course, lesson, lessonEnrolled, profile.id]);

  if (!course || !lesson) {
    return <Navigate replace to={course ? `/courses/${course.id}` : "/courses"} />;
  }

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="lesson-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell lesson-page-shell">
        <WorkspaceHeader
          description={lesson.description ?? getLessonAssignmentPrompt(lesson)}
          kicker={course.title}
          title={lesson.title}
        />
        <LessonVideoPanel lesson={lesson} />
        <LessonAssignmentPanel course={course} lesson={lesson} />
        <LessonMaterialsPanel lesson={lesson} />
        <LessonSelfCheckPanel lesson={lesson} />
        {lessonEnrolled && lesson.mentorLMNoteConfig.enabled ? (
          <LessonMentorLMPanel
            course={course}
            lesson={lesson}
            notes={notes}
            onNoteSaved={(note) => setNotes((currentNotes) => [note, ...currentNotes.filter((currentNote) => currentNote.id !== note.id)])}
            onNotesUpdated={(updatedNotes) =>
              setNotes((currentNotes) =>
                currentNotes.map((currentNote) => updatedNotes.find((updatedNote) => updatedNote.id === currentNote.id) ?? currentNote)
              )
            }
            profile={profile}
          />
        ) : null}
      </div>
    </section>
  );
}

export function OpportunitiesWorkspace({ profile, extraOpportunities = [], onLogout }: OpportunitiesWorkspaceProps) {
  const onboardingProfile = buildOnboardingProfile(profile);
  const allOpportunities = getOpportunityPool(extraOpportunities);
  const recommendedOpportunities = getRecommendedOpportunities(onboardingProfile, allOpportunities, allOpportunities.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<OpportunityFilterState>(emptyOpportunityFilters);
  const { saveOpportunity: saveOwnedOpportunity, studentOpportunities } = useStudentOpportunityState(profile.id);
  const [opportunityActionError, setOpportunityActionError] = useState("");
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const hasManualSearch = normalizedSearchQuery.length > 0;
  const filtersActive = hasActiveOpportunityFilters(filters);
  const showFilterMatchIcons = filtersActive && !hasManualSearch;
  const chosenOpportunityIds = studentOpportunities.map((opportunity) => opportunity.opportunity_id);
  const savedOpportunities = allOpportunities.filter((opportunity) => chosenOpportunityIds.includes(opportunity.id));
  const rankedOpportunityIndex = useMemo(
    () => new Map(recommendedOpportunities.map((opportunity, index) => [opportunity.id, index])),
    [recommendedOpportunities]
  );
  const filterOptions = useMemo(
    () => ({
      directions: getSortedUniqueValues(allOpportunities.map((opportunity) => opportunity.direction)),
      formats: getSortedUniqueValues(allOpportunities.map((opportunity) => opportunity.format)),
      locations: getSortedUniqueValues(allOpportunities.map((opportunity) => opportunity.location)),
      grades: getSortedGradeValues(allOpportunities),
      categories: getSortedUniqueValues(allOpportunities.map((opportunity) => opportunity.category))
    }),
    [allOpportunities]
  );
  const opportunityResults = useMemo(() => {
    if (!filtersActive && !hasManualSearch) {
      return recommendedOpportunities;
    }

    return allOpportunities
      .filter((opportunity) => opportunityMatchesFilters(opportunity, filters))
      .filter((opportunity) => !hasManualSearch || getOpportunitySearchText(opportunity).includes(normalizedSearchQuery))
      .sort((a, b) => {
        const firstIndex = rankedOpportunityIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const secondIndex = rankedOpportunityIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;

        return firstIndex - secondIndex || a.title.localeCompare(b.title);
      });
  }, [allOpportunities, filters, filtersActive, hasManualSearch, normalizedSearchQuery, rankedOpportunityIndex, recommendedOpportunities]);

  const resultsLabel = filtersActive
    ? `${opportunityResults.length} filtered ${opportunityResults.length === 1 ? "result" : "results"}`
    : hasManualSearch
      ? `${opportunityResults.length} search ${opportunityResults.length === 1 ? "result" : "results"}`
      : `${opportunityResults.length} profile ${opportunityResults.length === 1 ? "opportunity" : "opportunities"}`;
  const canClearSearch = filtersActive || hasManualSearch;

  function updateFilter(filterName: keyof OpportunityFilterState, value: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: value
    }));
  }

  function clearOpportunitySearch() {
    setSearchQuery("");
    setFilters(emptyOpportunityFilters);
  }

  async function saveOpportunityFromSearch(opportunityId: string) {
    setOpportunityActionError("");

    try {
      await saveOwnedOpportunity(opportunityId, "search", "saved");
    } catch (error) {
      setOpportunityActionError(getStateErrorMessage(error, "Opportunity could not be saved."));
    }
  }

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="workspace-opportunities-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell opportunities-shell">
        <WorkspaceHeader
          description="A focused workspace for finding programs, saving shortlists, and keeping chosen opportunities connected to the dashboard."
          kicker="My opportunity"
          title="My opportunity"
        />

        <section className="match-console opportunity-search-window" aria-labelledby="workspace-opportunity-search-title">
          <div className="console-core opportunity-search-core">
            <div className="console-frame" aria-hidden="true" />
            <header className="console-header">
              <div>
                <h2 id="workspace-opportunity-search-title">Opportunity search</h2>
              </div>
            </header>

            <label className="showcase-search opportunity-search-field">
              <MagnifyingGlass aria-hidden="true" className="opportunity-search-icon" size={18} weight="light" />
              <input
                aria-label="Search opportunities"
                autoComplete="off"
                placeholder="physics competitions"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>

            <div className="criteria-grid opportunity-filter-grid" aria-label="Opportunity filters">
              <OpportunityFilterSelect
                label="Direction"
                options={filterOptions.directions}
                value={filters.direction}
                onChange={(value) => updateFilter("direction", value)}
              />
              <OpportunityFilterSelect
                label="Format"
                options={filterOptions.formats}
                value={filters.format}
                onChange={(value) => updateFilter("format", value)}
              />
              <OpportunityFilterSelect
                label="Location"
                options={filterOptions.locations}
                value={filters.location}
                onChange={(value) => updateFilter("location", value)}
              />
              <OpportunityFilterSelect
                label="Grade"
                options={filterOptions.grades}
                value={filters.grade}
                onChange={(value) => updateFilter("grade", value)}
              />
              <OpportunityFilterSelect
                label="Type"
                options={filterOptions.categories}
                value={filters.category}
                onChange={(value) => updateFilter("category", value)}
              />
            </div>

            <div className="result-panel opportunity-results-panel" aria-label="Opportunity results">
              <div className="opportunity-results-heading-row">
                <p className="result-heading">{resultsLabel}</p>
                {canClearSearch ? (
                  <button className="secondary-action compact-action opportunity-clear-button" type="button" onClick={clearOpportunitySearch}>
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="opportunity-result-scroll" role="list">
                {opportunityResults.length > 0 ? (
                  opportunityResults.map((opportunity) => (
                    <OpportunitySearchCard
                      isSaved={chosenOpportunityIds.includes(opportunity.id)}
                      key={opportunity.id}
                      opportunity={opportunity}
                      showMatchIcon={showFilterMatchIcons}
                      onSave={() => saveOpportunityFromSearch(opportunity.id)}
                    />
                  ))
                ) : (
                  <WorkspaceEmptyState title="No matching opportunities" message="Your current search has no visible results." />
                )}
              </div>
              {opportunityActionError ? <p className="workspace-state-error">{opportunityActionError}</p> : null}
            </div>
          </div>
        </section>

        <section className="dashboard-panel centered-glass-panel saved-opportunities-window" aria-labelledby="saved-opportunities-title">
          <div className="panel-heading saved-opportunities-heading">
            <div>
              <span>Saved</span>
              <h2 id="saved-opportunities-title">Saved opportunities</h2>
            </div>
            <strong aria-label={`${chosenOpportunityIds.length} chosen opportunities`}>{chosenOpportunityIds.length}</strong>
          </div>

          <div className="saved-opportunity-list">
            {savedOpportunities.length > 0 ? (
              savedOpportunities.map((opportunity) => <SavedOpportunityRow key={opportunity.id} opportunity={opportunity} />)
            ) : (
              <WorkspaceEmptyState title="No saved opportunities yet" message="Your shortlist is empty." />
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

function OpportunityFilterSelect({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="criteria-select opportunity-filter-select">
      <span className="criteria-label">{label}</span>
      <select className="criteria-value" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value={anyOpportunityFilterValue}>Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {label === "Grade" ? `Grade ${option}` : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function OpportunitySearchCard({
  opportunity,
  isSaved,
  showMatchIcon,
  onSave
}: {
  opportunity: Opportunity;
  isSaved: boolean;
  showMatchIcon: boolean;
  onSave: () => void;
}) {
  const displayOpportunity = getOpportunityTranslation(opportunity);

  return (
    <div className="workspace-opportunity-card-shell" role="listitem">
      <article className="opportunity-row workspace-opportunity-card">
        <div className="opportunity-row-main workspace-opportunity-card-main">
          <div className="workspace-opportunity-card-meta">
            <span className="deadline-chip">{formatOpportunityDeadline(opportunity)}</span>
            {showMatchIcon ? (
              <span className="filter-match-icon" aria-label="Matched by filters" role="img">
                <CheckCircle aria-hidden="true" size={15} weight="bold" />
              </span>
            ) : null}
          </div>
          <h3>{displayOpportunity.title}</h3>
          <p>{displayOpportunity.description}</p>
          <div className="opportunity-tags">
            <span>{opportunity.direction}</span>
            <span>{opportunity.format}</span>
            <span>Grades {opportunity.grades.join(", ")}</span>
          </div>
          <div className="opportunity-card-actions">
            <button className="secondary-action compact-action opportunity-save-button" disabled={isSaved} type="button" onClick={onSave}>
              {isSaved ? "Saved" : "Save"}
            </button>
            <a className="secondary-action compact-action opportunity-open-link" href={opportunity.applyUrl} target="_blank" rel="noreferrer">
              Open
            </a>
          </div>
        </div>
      </article>
      <aside className="opportunity-popover workspace-opportunity-popover" aria-label={`More information about ${displayOpportunity.title}`}>
        <strong>{displayOpportunity.title}</strong>
        <p>{displayOpportunity.requirements}</p>
        <a href={opportunity.applyUrl} target="_blank" rel="noreferrer">
          {opportunity.applyUrl}
        </a>
      </aside>
    </div>
  );
}

function SavedOpportunityRow({ opportunity }: { opportunity: Opportunity }) {
  const displayOpportunity = getOpportunityTranslation(opportunity);

  return (
    <article className="match-summary-row saved-opportunity-row">
      <div>
        <h3>{displayOpportunity.title}</h3>
        <p>
          {opportunity.category} - {opportunity.format} - {formatOpportunityDeadline(opportunity)}
        </p>
      </div>
      <a className="secondary-action compact-action opportunity-open-link" href={opportunity.applyUrl} target="_blank" rel="noreferrer">
        Open
      </a>
    </article>
  );
}

function OpportunitySummary({ opportunity, onSave }: { opportunity: Opportunity; onSave?: () => void }) {
  const displayOpportunity = getOpportunityTranslation(opportunity);

  return (
    <article className="match-summary-row">
      <div>
        <h3>{displayOpportunity.title}</h3>
        <p>
          {opportunity.category} - {opportunity.format} - {formatOpportunityDeadline(opportunity)}
        </p>
      </div>
      {onSave ? (
        <button className="secondary-action compact-action" type="button" onClick={onSave}>
          Save
        </button>
      ) : (
        <span>Match</span>
      )}
    </article>
  );
}

function CourseProgressRow({ course, progressPercent }: { course: Course; progressPercent: number }) {
  return (
    <Link className="course-progress-link" to={`/courses/${course.id}`}>
      <article className="course-progress-row">
        <div>
          <h3>{course.title}</h3>
          <p>
            {course.difficulty} - {course.lessons.length} lessons
          </p>
        </div>
        <div className="course-progress-track" aria-label={`${course.title} progress`}>
          <span style={{ transform: `scaleX(${progressPercent / 100})` }} />
        </div>
      </article>
    </Link>
  );
}
