import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  ArrowRight,
  BookOpen,
  Compass,
  MagnifyingGlass,
  MapTrifold,
  NotePencil,
  PawPrint,
  Play,
  VideoCamera
} from "@phosphor-icons/react";
import { Link, NavLink, Navigate, useParams } from "react-router-dom";
import {
  courses,
  formatOpportunityDeadline,
  getOptionLabel,
  getOptionLabels,
  getRecommendedCourses,
  getRecommendedOpportunities,
  hasUpcomingDeadline,
  mentorPetLessonNotes,
  opportunities
} from "../data/content";
import type { Course, Lesson, MentorPetLessonNote, OnboardingProfile, Opportunity } from "../data/content";
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

function getCourseById(courseId?: string) {
  return courses.find((course) => course.id === courseId);
}

function getLessonById(course: Course | undefined, lessonId?: string) {
  return course?.lessons.find((lesson) => lesson.id === lessonId);
}

function getNotesForLesson(courseId: string, lessonId: string) {
  return mentorPetLessonNotes.filter((note) => note.courseId === courseId && note.lessonId === lessonId);
}

export function WorkspaceRail({ onLogout }: { onLogout: () => void }) {
  const navItems = [
    { to: "/roadmap", label: "Roadmap", icon: MapTrifold },
    { to: "/courses", label: "My courses", icon: BookOpen },
    { to: "/opportunities", label: "Opportunity search", icon: Compass },
    { to: "/mentor-pet", label: "MentorPet", icon: PawPrint }
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
  variant = "large"
}: {
  course: Course;
  lesson?: Lesson;
  layoutId: string;
  variant?: "large" | "small" | "hero";
}) {
  const imageUrl = lesson?.coverUrl ?? course.coverUrl;

  return (
    <motion.div
      className={`workspace-cover workspace-cover-${variant}`}
      layoutId={layoutId}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      transition={springTransition}
    >
      <span>{course.track}</span>
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

function InlineMentorPetNotes({ notes }: { notes: MentorPetLessonNote[] }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="mentorpet-inline-notes" aria-label="MentorPet notes">
      {notes.map((note) => (
        <article className="mentorpet-inline-note" key={note.id}>
          <NotePencil aria-hidden="true" size={14} weight="light" />
          <div>
            <strong>{note.title}</strong>
            <p>{note.body}</p>
          </div>
        </article>
      ))}
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
            title={cell.opportunity ? `${cell.opportunity.title} (Due: ${cell.date.toLocaleDateString()})` : cell.date.toLocaleDateString()}
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
  const recommendedOpportunities = getRecommendedOpportunities(onboardingProfile, allOpportunities);
  const recommendedCourses = getRecommendedCourses(onboardingProfile);
  const inProgressCourses = recommendedCourses.filter((course) => course.progress > 0 && course.progress < 100).length;
  const upcomingDeadlines = recommendedOpportunities.filter((opportunity) => hasUpcomingDeadline(opportunity)).length;

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
              Grade {profile.grade} profile focused on {directionLabel}. Recommended matches are ranked from your
              onboarding answers, curated Mentoria programs, and the cleaned Telegram opportunity feed.
            </p>
          </div>
          <div className="profile-summary centered-profile-summary" aria-label="Onboarding profile summary">
            {interestLabels.slice(0, 5).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </motion.div>

        <div className="metric-grid centered-metric-grid" aria-label="Dashboard statistics">
          <article className="metric-card">
            <span>Active courses</span>
            <strong>{courses.length}</strong>
          </article>
          <article className="metric-card">
            <span>In progress</span>
            <strong>{inProgressCourses}</strong>
          </article>
          <article className="metric-card">
            <span>Recommended matches</span>
            <strong>{recommendedOpportunities.length}</strong>
          </article>
          <article className="metric-card">
            <span>Upcoming deadlines</span>
            <strong>{upcomingDeadlines}</strong>
          </article>
        </div>

        <DeadlineCalendar opportunities={recommendedOpportunities} />

        <div className="dashboard-columns centered-dashboard-columns">
          <section className="dashboard-panel centered-glass-panel" aria-labelledby="recommended-matches-title">
            <div className="panel-heading">
              <div>
                <span>Shortlist</span>
                <h2 id="recommended-matches-title">Recommended matches</h2>
              </div>
              <Link className="secondary-action compact-action text-action-link" to="/opportunities">
                Opportunities
              </Link>
            </div>
            <div className="match-list">
              {recommendedOpportunities.length > 0 ? (
                recommendedOpportunities.map((opportunity) => (
                  <OpportunitySummary opportunity={opportunity} key={opportunity.id} />
                ))
              ) : (
                <WorkspaceEmptyState
                  title="No matches yet"
                  message="Adjust your onboarding interests or check again after the catalog refreshes."
                />
              )}
            </div>
          </section>

          <section className="dashboard-panel dashboard-panel-soft centered-glass-panel" aria-labelledby="recommended-courses-title">
            <div className="panel-heading">
              <div>
                <span>Learning</span>
                <h2 id="recommended-courses-title">Recommended courses</h2>
              </div>
              <Link className="secondary-action compact-action text-action-link" to="/courses">
                My courses
              </Link>
            </div>
            <div className="course-progress-list">
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((course) => <CourseProgressRow course={course} key={course.id} />)
              ) : (
                <WorkspaceEmptyState
                  title="No course path yet"
                  message="Choose more interests so Mentoria can connect courses to matches."
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export function CoursesWorkspace({ profile, onLogout }: WorkspaceProps) {
  const [expandedCourseId, setExpandedCourseId] = useState(courses[0]?.id ?? "");
  const [searchReady, setSearchReady] = useState(false);

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="workspace-courses-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell course-browser-shell">
        <WorkspaceHeader
          description={`${profile.name}, your course list is live from the course catalog. New courses added to data will appear here automatically.`}
          kicker="Mentoria courses"
          title="My courses"
        >
          <button
            className={`course-search-action${searchReady ? " course-search-action-active" : ""}`}
            type="button"
            aria-pressed={searchReady}
            onClick={() => setSearchReady((current) => !current)}
          >
            <MagnifyingGlass aria-hidden="true" size={17} weight="light" />
            <span>{searchReady ? "Search ready" : "Search"}</span>
          </button>
        </WorkspaceHeader>

        <div className="course-browser-list">
          {courses.length > 0 ? (
            courses.map((course, index) => {
              const expanded = expandedCourseId === course.id;
              const previewLessons = course.lessons.slice(0, 3);

              return (
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className={`course-browser-card${expanded ? " course-browser-card-expanded" : ""}`}
                  initial={{ opacity: 0, y: 18 }}
                  key={course.id}
                  layout
                  transition={{ ...springTransition, delay: index * 0.04 }}
                >
                  <button
                    className="course-browser-main"
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedCourseId(expanded ? "" : course.id)}
                  >
                    <CourseCover course={course} layoutId={`course-cover-${course.id}`} variant="large" />
                    <span className="course-browser-copy">
                      <span>{course.track}</span>
                      <strong>{course.title}</strong>
                      <span>{course.description}</span>
                    </span>
                    <span className="course-browser-meta">
                      <span>{course.difficulty}</span>
                      <span>{course.lessons.length} lessons</span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="course-preview-panel"
                        exit={{ opacity: 0, y: -8 }}
                        initial={{ opacity: 0, y: -8 }}
                        transition={springTransition}
                      >
                        <div className="course-preview-list" aria-label={`${course.title} lesson preview`}>
                          {previewLessons.map((lesson) => (
                            <div className="course-preview-lesson" key={lesson.id}>
                              <span>{lesson.duration}</span>
                              <strong>{lesson.title}</strong>
                              <p>{lesson.description ?? lesson.assignment}</p>
                              <InlineMentorPetNotes notes={getNotesForLesson(course.id, lesson.id)} />
                            </div>
                          ))}
                        </div>
                        <div className="course-preview-actions">
                          <button className="secondary-action compact-action" type="button" onClick={() => setExpandedCourseId("")}>
                            Hide
                          </button>
                          <Link className="primary-action compact-action text-action-link" to={`/courses/${course.id}`}>
                            <span>Go to course</span>
                            <ArrowRight aria-hidden="true" size={15} weight="light" />
                          </Link>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.article>
              );
            })
          ) : (
            <WorkspaceEmptyState title="No courses yet" message="Add courses to the catalog and they will appear here." />
          )}
        </div>
      </div>
    </section>
  );
}

export function CourseDetailWorkspace({ onLogout }: { onLogout: () => void }) {
  const { courseId } = useParams();
  const course = getCourseById(courseId);

  if (!course) {
    return <Navigate replace to="/courses" />;
  }

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="course-detail-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell course-detail-shell">
        <WorkspaceHeader description={course.description} kicker={course.track} title={course.title} />
        <CourseCover course={course} layoutId={`course-cover-${course.id}`} variant="hero" />

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
                    <p>{lesson.description ?? lesson.assignment}</p>
                  </div>
                  <span className="lesson-row-play">
                    <Play aria-hidden="true" size={14} weight="fill" />
                  </span>
                </motion.article>
              </Link>
              <InlineMentorPetNotes notes={getNotesForLesson(course.id, lesson.id)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LessonWorkspace({ onLogout }: { onLogout: () => void }) {
  const { courseId, lessonId } = useParams();
  const course = getCourseById(courseId);
  const lesson = getLessonById(course, lessonId);

  if (!course || !lesson) {
    return <Navigate replace to={course ? `/courses/${course.id}` : "/courses"} />;
  }

  const notes = getNotesForLesson(course.id, lesson.id);

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="lesson-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell lesson-page-shell">
        <WorkspaceHeader
          description={lesson.description ?? lesson.assignment}
          kicker={course.title}
          title={lesson.title}
        />
        <CourseCover course={course} lesson={lesson} layoutId={`lesson-cover-${course.id}-${lesson.id}`} variant="hero" />

        <section className="lesson-video-section" aria-labelledby="lesson-video-title">
          <div className="lesson-video-heading">
            <VideoCamera aria-hidden="true" size={20} weight="light" />
            <h2 id="lesson-video-title">{lesson.videoLabel}</h2>
          </div>
          {lesson.videoUrl ? (
            <video className="lesson-video-player" controls playsInline preload="metadata">
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          ) : (
            <WorkspaceEmptyState
              title="Video not added yet"
              message="This lesson already has a video field prepared. An admin can add a video URL later."
            />
          )}
        </section>

        <section className="lesson-support-grid" aria-label="Lesson support materials">
          <article>
            <span>Assignment</span>
            <p>{lesson.assignment}</p>
          </article>
          <article>
            <span>Materials</span>
            <p>{lesson.materials.join(", ")}</p>
          </article>
          <article>
            <span>Check</span>
            <p>{lesson.quiz}</p>
          </article>
        </section>

        <section className="mentorpet-note-section" aria-labelledby="lesson-notes-title">
          <div className="lesson-video-heading">
            <NotePencil aria-hidden="true" size={20} weight="light" />
            <h2 id="lesson-notes-title">MentorPet notes</h2>
          </div>
          {notes.length > 0 ? (
            <div className="mentorpet-note-details">
              {notes.map((note) => (
                <details key={note.id}>
                  <summary>{note.title}</summary>
                  <p>{note.body}</p>
                </details>
              ))}
            </div>
          ) : (
            <WorkspaceEmptyState
              title="No MentorPet notes"
              message="Notes are a separate future function and are not generated for every lesson."
            />
          )}
        </section>
      </div>
    </section>
  );
}

export function OpportunitiesWorkspace({ profile, extraOpportunities = [], onLogout }: OpportunitiesWorkspaceProps) {
  const onboardingProfile = buildOnboardingProfile(profile);
  const allOpportunities = getOpportunityPool(extraOpportunities);
  const recommendedOpportunities = getRecommendedOpportunities(onboardingProfile, allOpportunities, allOpportunities.length);

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="workspace-opportunities-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell opportunities-shell">
        <WorkspaceHeader
          description="A centered shortlist of matches from your profile. This keeps opportunity search close to courses without turning the page into a dense dashboard."
          kicker="Opportunity search"
          title="Matches from your profile"
        />
        <div className="opportunity-grid">
          {recommendedOpportunities.length > 0 ? (
            recommendedOpportunities.map((opportunity) => (
              <a
                className="opp-glow-card"
                data-direction={(opportunity.direction || "").toLowerCase()}
                href={opportunity.applyUrl}
                target="_blank"
                rel="noreferrer"
                key={opportunity.id}
              >
                <span className="opp-glow-bg" aria-hidden="true" />
                <span className="opp-glow-scrim" aria-hidden="true" />
                <span className="opp-glow-tag">{opportunity.direction} · Grades {opportunity.grades.join(", ")}</span>
                <div className="opp-glow-content">
                  <div className="opp-glow-text">
                    <h2>{opportunity.title}</h2>
                    <p>{opportunity.category} · {opportunity.format}</p>
                  </div>
                  <span className="opp-glow-badge">{formatOpportunityDeadline(opportunity)}</span>
                </div>
              </a>
            ))
          ) : (
            <WorkspaceEmptyState title="No matches yet" message="Try broadening the profile filters or refresh the opportunity feed." />
          )}
        </div>
      </div>
    </section>
  );
}

export function MentorPetWorkspace({ profile, onLogout }: WorkspaceProps) {
  const prototypeNotes = mentorPetLessonNotes.filter((note) => note.prototypeOnly);
  const targetCourse = getCourseById(prototypeNotes[0]?.courseId);
  const targetLesson = getLessonById(targetCourse, prototypeNotes[0]?.lessonId);

  return (
    <section className="flow-screen workspace-screen centered-workspace-screen" aria-labelledby="mentorpet-workspace-title">
      <WorkspaceRail onLogout={onLogout} />
      <div className="workspace-shell centered-workspace-shell mentorpet-workspace-shell">
        <WorkspaceHeader
          description={`${profile.name}, this workspace is ready for future MentorPet notes and lesson support. The current note is a prototype data point only.`}
          kicker="MentorPet"
          title="Study companion notes"
        />

        <div className="mentorpet-workspace-panel centered-glass-panel">
          <div className="mentorpet-orb" aria-hidden="true">
            <PawPrint size={34} weight="light" />
          </div>
          <div>
            <span>Notes pipeline</span>
            <h2>Prepared for admin-managed study notes</h2>
            <p>
              MentorPet notes are separate from lessons. They can attach to one lesson, stay smaller in lists, and expand
              on the lesson page when real note authoring is connected.
            </p>
          </div>
        </div>

        <div className="mentorpet-note-overview">
          {prototypeNotes.map((note) => (
            <article className="mentorpet-overview-note" key={note.id}>
              <span>Prototype note</span>
              <h2>{note.title}</h2>
              <p>{note.body}</p>
              {targetCourse && targetLesson ? (
                <Link className="secondary-action compact-action text-action-link" to={`/courses/${targetCourse.id}/lessons/${targetLesson.id}`}>
                  Open lesson
                </Link>
              ) : null}
            </article>
          ))}
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

function CourseProgressRow({ course }: { course: Course }) {
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
          <span style={{ transform: `scaleX(${course.progress / 100})` }} />
        </div>
      </article>
    </Link>
  );
}
