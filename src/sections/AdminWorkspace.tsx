import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowsClockwise,
  Books,
  ChartBar,
  ChatCircleDots,
  CheckCircle,
  ClipboardText,
  Database as DatabaseIcon,
  FloppyDisk,
  NotePencil,
  ShieldCheck,
  SignOut,
  Trophy,
  UsersThree,
  WarningCircle
} from "@phosphor-icons/react";
import type { StudentProfile } from "./AuthFlowSections";
import {
  canEditCatalog,
  canManageStaff,
  canReviewAssignments,
  fetchAdminMemberships,
  fetchOwnAdminMembership,
  upsertAdminMembership
} from "../lib/adminAuth";
import type { AdminMembership, AdminRole, AdminStatus } from "../lib/adminAuth";
import {
  fetchAdminCatalog,
  seedCatalogFromStaticContent,
  updateCatalogCourse,
  updateCatalogLesson,
  updateCatalogMaterial,
  updateCatalogOpportunity,
  updateCatalogQuizQuestion
} from "../lib/adminCatalog";
import type {
  AdminCatalog,
  CatalogCourseRow,
  CatalogLessonRow,
  CatalogMaterialRow,
  CatalogOpportunityRow,
  CatalogQuizQuestionRow
} from "../lib/adminCatalog";
import {
  fetchAdminAssignmentQueue,
  fetchAssignmentReviewEvents,
  reviewAssignmentSubmission
} from "../lib/adminAssignments";
import type { AdminAssignmentSubmission, AssignmentReviewEventRow, AssignmentReviewStatus } from "../lib/adminAssignments";
import { courses as staticCourses, opportunities as staticOpportunities } from "../data/content";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Database, Json } from "../lib/database.types";

type Props = {
  onLogout: () => void;
  profile: StudentProfile;
};

type AdminTab = "overview" | "courses" | "opportunities" | "assignments" | "notes" | "staff";
type SaveState = "idle" | "loading" | "success" | "error";
type MentorNoteRow = Database["public"]["Tables"]["mentor_lm_lesson_notes"]["Row"];

const adminTabs: Array<{ id: AdminTab; label: string; icon: typeof ChartBar }> = [
  { id: "overview", label: "Overview", icon: ChartBar },
  { id: "courses", label: "Courses", icon: Books },
  { id: "opportunities", label: "Opportunities", icon: Trophy },
  { id: "assignments", label: "Assignments", icon: ClipboardText },
  { id: "notes", label: "MentorLM Notes", icon: ChatCircleDots },
  { id: "staff", label: "Staff", icon: UsersThree }
];

const emptyCatalog: AdminCatalog = {
  choices: [],
  courses: [],
  lessons: [],
  materials: [],
  opportunities: [],
  questions: []
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
}

function parseLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function asJson(value: unknown): Json {
  return value as Json;
}

function getBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function getNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getJsonRecord(value: Json, fallback: Record<string, unknown> = {}) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : fallback;
}

function StatusMessage({ message, state }: { message: string; state: SaveState }) {
  if (!message) {
    return null;
  }

  const Icon = state === "error" ? WarningCircle : CheckCircle;

  return (
    <p className={`admin-status-message admin-status-${state}`} role="status">
      <Icon aria-hidden="true" size={16} weight="light" />
      <span>{message}</span>
    </p>
  );
}

function Field({
  children,
  helper,
  label
}: {
  children: ReactNode;
  helper?: string;
  label: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
      {helper ? <small>{helper}</small> : null}
    </label>
  );
}

export function AdminWorkspace({ profile, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [membership, setMembership] = useState<AdminMembership | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [catalog, setCatalog] = useState<AdminCatalog>(emptyCatalog);
  const [assignments, setAssignments] = useState<AdminAssignmentSubmission[]>([]);
  const [notes, setNotes] = useState<MentorNoteRow[]>([]);
  const [reviewEvents, setReviewEvents] = useState<AssignmentReviewEventRow[]>([]);
  const [staff, setStaff] = useState<AdminMembership[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [lessonEditorTab, setLessonEditorTab] = useState<"assignment" | "basics" | "materials" | "mentorlm" | "quiz" | "video">("basics");
  const [query, setQuery] = useState("");
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const role = membership?.role;
  const catalogEditable = role ? canEditCatalog(role) : false;
  const assignmentsVisible = role ? canReviewAssignments(role) : false;
  const staffManageable = role ? canManageStaff(role) : false;
  const staticSeedCount = staticCourses.length + staticOpportunities.length;

  async function loadCatalog() {
    const data = await fetchAdminCatalog();
    setCatalog(data);
    setSelectedCourseId((current) => current || data.courses[0]?.id || "");
    setSelectedOpportunityId((current) => current || data.opportunities[0]?.id || "");
  }

  async function loadAssignments() {
    if (!assignmentsVisible) {
      setAssignments([]);
      return;
    }

    const data = await fetchAdminAssignmentQueue();
    setAssignments(data);
    setSelectedSubmissionId((current) => current ?? data[0]?.id ?? null);
  }

  async function loadNotes() {
    if (!assignmentsVisible || !supabase) {
      setNotes([]);
      return;
    }

    const { data, error } = await supabase
      .from("mentor_lm_lesson_notes")
      .select("id, student_id, course_id, lesson_id, title, body, created_by, is_hidden, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(80);

    if (error) {
      throw error;
    }

    setNotes(data ?? []);
  }

  async function loadStaff() {
    if (!staffManageable) {
      setStaff([]);
      return;
    }

    setStaff(await fetchAdminMemberships());
  }

  async function loadAdminData() {
    setSaveState("loading");
    setMessage("");

    try {
      await Promise.all([loadCatalog(), loadAssignments(), loadNotes(), loadStaff()]);
      setSaveState("success");
      setMessage("Admin workspace synced.");
    } catch (error) {
      setSaveState("error");
      setMessage(getErrorMessage(error, "Admin workspace could not load."));
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadMembership() {
      setMembershipLoading(true);

      try {
        const data = await fetchOwnAdminMembership(profile.id);
        if (!mounted) {
          return;
        }

        setMembership(data);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setMessage(getErrorMessage(error, "Admin access could not be checked."));
        setSaveState("error");
      } finally {
        if (mounted) {
          setMembershipLoading(false);
        }
      }
    }

    loadMembership();

    return () => {
      mounted = false;
    };
  }, [profile.id]);

  useEffect(() => {
    if (membership?.status === "active") {
      loadAdminData();
    }
  }, [membership?.status, membership?.role]);

  useEffect(() => {
    const lessonsForCourse = catalog.lessons.filter((lesson) => lesson.course_id === selectedCourseId);

    if (lessonsForCourse.length > 0 && !lessonsForCourse.some((lesson) => lesson.id === selectedLessonId)) {
      setSelectedLessonId(lessonsForCourse[0].id);
    }
  }, [catalog.lessons, selectedCourseId, selectedLessonId]);

  useEffect(() => {
    if (!selectedSubmissionId) {
      setReviewEvents([]);
      return;
    }

    fetchAssignmentReviewEvents(selectedSubmissionId)
      .then(setReviewEvents)
      .catch((error) => {
        setSaveState("error");
        setMessage(getErrorMessage(error, "Review history could not load."));
      });
  }, [selectedSubmissionId]);

  async function seedCatalog() {
    setSaveState("loading");
    setMessage("");

    try {
      const data = await seedCatalogFromStaticContent();
      setCatalog(data);
      setSelectedCourseId(data.courses[0]?.id ?? "");
      setSelectedOpportunityId(data.opportunities[0]?.id ?? "");
      setSaveState("success");
      setMessage("Catalog seeded from static content.");
    } catch (error) {
      setSaveState("error");
      setMessage(getErrorMessage(error, "Catalog seed failed."));
    }
  }

  if (membershipLoading) {
    return (
      <section className="admin-root admin-centered">
        <div className="admin-access-panel">
          <ShieldCheck aria-hidden="true" size={28} weight="light" />
          <h1>Checking admin access</h1>
          <p>Mentoria is verifying your staff membership.</p>
        </div>
      </section>
    );
  }

  if (!membership) {
    return (
      <section className="admin-root admin-centered">
        <div className="admin-access-panel">
          <ShieldCheck aria-hidden="true" size={30} weight="light" />
          <h1>Access restricted</h1>
          <p>This workspace is available only to active Mentoria staff accounts.</p>
          <Link className="admin-secondary-action" to="/dashboard">Return to dashboard</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-root" aria-labelledby="admin-title">
      <aside className="admin-rail">
        <div className="admin-rail-brand">
          <ShieldCheck aria-hidden="true" size={24} weight="light" />
          <div>
            <span>Mentoria Admin</span>
            <small>{membership.role.replace("_", " ")}</small>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Admin sections">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const disabled =
              (tab.id === "assignments" || tab.id === "notes") && !assignmentsVisible ||
              tab.id === "staff" && !staffManageable;

            return (
              <button
                className={`admin-nav-item${activeTab === tab.id ? " is-active" : ""}`}
                disabled={disabled}
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon aria-hidden="true" size={18} weight="light" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="admin-rail-footer">
          <Link to="/dashboard">Student workspace</Link>
          <button type="button" onClick={onLogout}>
            <SignOut aria-hidden="true" size={16} weight="light" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>Internal operations</span>
            <h1 id="admin-title">Content and assignment control</h1>
          </div>
          <button className="admin-secondary-action" type="button" onClick={loadAdminData}>
            <ArrowsClockwise aria-hidden="true" size={16} weight="light" />
            <span>Refresh</span>
          </button>
        </header>
        <StatusMessage message={message} state={saveState} />

        {activeTab === "overview" ? (
          <AdminOverview
            assignments={assignments}
            catalog={catalog}
            catalogEditable={catalogEditable}
            onSeed={seedCatalog}
            staticSeedCount={staticSeedCount}
          />
        ) : null}
        {activeTab === "courses" ? (
          <CoursesAdmin
            catalog={catalog}
            editable={catalogEditable}
            lessonEditorTab={lessonEditorTab}
            onCatalogReload={loadCatalog}
            query={query}
            selectedCourseId={selectedCourseId}
            selectedLessonId={selectedLessonId}
            setLessonEditorTab={setLessonEditorTab}
            setQuery={setQuery}
            setSelectedCourseId={setSelectedCourseId}
            setSelectedLessonId={setSelectedLessonId}
            setStatus={(state, nextMessage) => {
              setSaveState(state);
              setMessage(nextMessage);
            }}
          />
        ) : null}
        {activeTab === "opportunities" ? (
          <OpportunitiesAdmin
            catalog={catalog}
            editable={catalogEditable}
            onCatalogReload={loadCatalog}
            query={query}
            selectedOpportunityId={selectedOpportunityId}
            setQuery={setQuery}
            setSelectedOpportunityId={setSelectedOpportunityId}
            setStatus={(state, nextMessage) => {
              setSaveState(state);
              setMessage(nextMessage);
            }}
          />
        ) : null}
        {activeTab === "assignments" ? (
          <AssignmentsAdmin
            assignments={assignments}
            catalog={catalog}
            events={reviewEvents}
            filter={assignmentStatusFilter}
            onAssignmentsReload={loadAssignments}
            selectedSubmissionId={selectedSubmissionId}
            setFilter={setAssignmentStatusFilter}
            setSelectedSubmissionId={setSelectedSubmissionId}
            setStatus={(state, nextMessage) => {
              setSaveState(state);
              setMessage(nextMessage);
            }}
          />
        ) : null}
        {activeTab === "notes" ? <MentorNotesAdmin notes={notes} /> : null}
        {activeTab === "staff" ? (
          <StaffAdmin
            actorId={profile.id}
            onReload={loadStaff}
            setStatus={(state, nextMessage) => {
              setSaveState(state);
              setMessage(nextMessage);
            }}
            staff={staff}
          />
        ) : null}
      </main>
    </section>
  );
}

function AdminOverview({
  assignments,
  catalog,
  catalogEditable,
  onSeed,
  staticSeedCount
}: {
  assignments: AdminAssignmentSubmission[];
  catalog: AdminCatalog;
  catalogEditable: boolean;
  onSeed: () => void;
  staticSeedCount: number;
}) {
  const reviewedCount = assignments.filter((assignment) => assignment.review_status === "reviewed").length;

  return (
    <div className="admin-panel-grid">
      <article className="admin-metric">
        <span>Catalog courses</span>
        <strong>{catalog.courses.length}</strong>
        <small>{catalog.lessons.length} lessons in admin catalog</small>
      </article>
      <article className="admin-metric">
        <span>Opportunities</span>
        <strong>{catalog.opportunities.length}</strong>
        <small>Published, draft, and archived rows</small>
      </article>
      <article className="admin-metric">
        <span>Assignment queue</span>
        <strong>{assignments.length}</strong>
        <small>{reviewedCount} reviewed submissions</small>
      </article>
      <article className="admin-metric admin-seed-panel">
        <DatabaseIcon aria-hidden="true" size={22} weight="light" />
        <span>Static seed fallback</span>
        <strong>{staticSeedCount}</strong>
        <small>Static catalog items remain fallback; homepage preview is untouched.</small>
        <button className="admin-primary-action" disabled={!catalogEditable} type="button" onClick={onSeed}>
          <DatabaseIcon aria-hidden="true" size={16} weight="light" />
          <span>Seed admin catalog</span>
        </button>
      </article>
    </div>
  );
}

function CoursesAdmin({
  catalog,
  editable,
  lessonEditorTab,
  onCatalogReload,
  query,
  selectedCourseId,
  selectedLessonId,
  setLessonEditorTab,
  setQuery,
  setSelectedCourseId,
  setSelectedLessonId,
  setStatus
}: {
  catalog: AdminCatalog;
  editable: boolean;
  lessonEditorTab: "assignment" | "basics" | "materials" | "mentorlm" | "quiz" | "video";
  onCatalogReload: () => Promise<void>;
  query: string;
  selectedCourseId: string;
  selectedLessonId: string;
  setLessonEditorTab: (tab: "assignment" | "basics" | "materials" | "mentorlm" | "quiz" | "video") => void;
  setQuery: (query: string) => void;
  setSelectedCourseId: (id: string) => void;
  setSelectedLessonId: (id: string) => void;
  setStatus: (state: SaveState, message: string) => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCourses = catalog.courses.filter((course) =>
    [course.title, course.track, course.description].join(" ").toLowerCase().includes(normalizedQuery)
  );
  const selectedCourse = catalog.courses.find((course) => course.id === selectedCourseId) ?? catalog.courses[0];
  const lessons = selectedCourse ? catalog.lessons.filter((lesson) => lesson.course_id === selectedCourse.id) : [];
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];

  return (
    <div className="admin-split">
      <aside className="admin-list-pane">
        <div className="admin-pane-head">
          <h2>Courses</h2>
          <input value={query} placeholder="Search courses" onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="admin-row-list">
          {filteredCourses.map((course) => (
            <button
              className={`admin-row-button${selectedCourse?.id === course.id ? " is-selected" : ""}`}
              key={course.id}
              type="button"
              onClick={() => setSelectedCourseId(course.id)}
            >
              <strong>{course.title}</strong>
              <span>{course.track} · {course.status}</span>
            </button>
          ))}
        </div>
      </aside>
      <section className="admin-detail-pane">
        {selectedCourse ? (
          <>
            <CourseEditor course={selectedCourse} editable={editable} onReload={onCatalogReload} setStatus={setStatus} />
            <div className="admin-subgrid">
              <div className="admin-lesson-list">
                <h3>Lessons</h3>
                {lessons.map((lesson) => (
                  <button
                    className={`admin-row-button compact${selectedLesson?.id === lesson.id ? " is-selected" : ""}`}
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLessonId(lesson.id)}
                  >
                    <strong>{lesson.title}</strong>
                    <span>{lesson.duration} · {lesson.status}</span>
                  </button>
                ))}
              </div>
              {selectedLesson ? (
                <LessonEditor
                  catalog={catalog}
                  editable={editable}
                  lesson={selectedLesson}
                  onReload={onCatalogReload}
                  setStatus={setStatus}
                  tab={lessonEditorTab}
                  setTab={setLessonEditorTab}
                />
              ) : (
                <div className="admin-empty">Select a lesson to edit its video, assignment, materials, quiz, and MentorLM settings.</div>
              )}
            </div>
          </>
        ) : (
          <div className="admin-empty">Seed the admin catalog before editing courses.</div>
        )}
      </section>
    </div>
  );
}

function CourseEditor({
  course,
  editable,
  onReload,
  setStatus
}: {
  course: CatalogCourseRow;
  editable: boolean;
  onReload: () => Promise<void>;
  setStatus: (state: SaveState, message: string) => void;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setStatus("loading", "");

    try {
      await updateCatalogCourse(course.id, {
        description: String(form.get("description") ?? ""),
        difficulty: String(form.get("difficulty") ?? "Beginner") as CatalogCourseRow["difficulty"],
        enrollment_settings: asJson({
          adminEditable: true,
          capacity: form.get("capacity") ? getNumber(form.get("capacity"), 0) : null,
          isOpen: getBoolean(form.get("isOpen")),
          requiresApproval: getBoolean(form.get("requiresApproval"))
        }),
        status: String(form.get("status") ?? "draft") as CatalogCourseRow["status"],
        tags: asJson(parseLines(form.get("tags"))),
        title: String(form.get("title") ?? ""),
        track: String(form.get("track") ?? "")
      });
      await onReload();
      setStatus("success", "Course saved.");
    } catch (error) {
      setStatus("error", getErrorMessage(error, "Course could not be saved."));
    }
  }

  const settings = getJsonRecord(course.enrollment_settings);

  return (
    <form className="admin-editor-card" key={course.id} onSubmit={submit}>
      <div className="admin-editor-title">
        <span>Course editor</span>
        <button className="admin-primary-action" disabled={!editable} type="submit">
          <FloppyDisk aria-hidden="true" size={16} weight="light" />
          <span>Save course</span>
        </button>
      </div>
      <div className="admin-form-grid">
        <Field label="Title"><input name="title" defaultValue={course.title} /></Field>
        <Field label="Track"><input name="track" defaultValue={course.track} /></Field>
        <Field label="Difficulty">
          <select name="difficulty" defaultValue={course.difficulty}>
            <option>Beginner</option>
            <option>Intermediate</option>
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={course.status}>
            <option>draft</option>
            <option>published</option>
            <option>archived</option>
          </select>
        </Field>
        <Field label="Description"><textarea name="description" rows={3} defaultValue={course.description} /></Field>
        <Field label="Tags" helper="One tag per line.">
          <textarea name="tags" rows={3} defaultValue={Array.isArray(course.tags) ? course.tags.join("\n") : ""} />
        </Field>
        <Field label="Capacity"><input name="capacity" type="number" defaultValue={String(settings.capacity ?? "")} /></Field>
        <label className="admin-check-field"><input name="isOpen" type="checkbox" defaultChecked={settings.isOpen !== false} />Enrollment open</label>
        <label className="admin-check-field"><input name="requiresApproval" type="checkbox" defaultChecked={settings.requiresApproval === true} />Requires approval</label>
      </div>
    </form>
  );
}

function LessonEditor({
  catalog,
  editable,
  lesson,
  onReload,
  setStatus,
  setTab,
  tab
}: {
  catalog: AdminCatalog;
  editable: boolean;
  lesson: CatalogLessonRow;
  onReload: () => Promise<void>;
  setStatus: (state: SaveState, message: string) => void;
  setTab: (tab: "assignment" | "basics" | "materials" | "mentorlm" | "quiz" | "video") => void;
  tab: "assignment" | "basics" | "materials" | "mentorlm" | "quiz" | "video";
}) {
  const materials = catalog.materials.filter((material) => material.lesson_id === lesson.id);
  const questions = catalog.questions.filter((question) => question.lesson_id === lesson.id);
  const noteConfig = getJsonRecord(lesson.mentor_lm_note_config, { allowStudentSave: true, enabled: true });
  const assignmentConfig = getJsonRecord(lesson.assignment_management_config, { reviewMode: "manual", visibleToMentors: true });

  async function saveLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setStatus("loading", "");

    try {
      await updateCatalogLesson(lesson.id, {
        assignment_accepted_file_types: asJson(parseLines(form.get("assignmentAcceptedFileTypes"))),
        assignment_accepts_files: getBoolean(form.get("assignmentAcceptsFiles")),
        assignment_management_config: asJson({
          adminEditable: true,
          reviewMode: String(form.get("reviewMode") ?? "manual"),
          visibleToMentors: getBoolean(form.get("visibleToMentors"))
        }),
        assignment_max_file_size_mb: getNumber(form.get("assignmentMaxFileSizeMb"), 10),
        assignment_prompt: String(form.get("assignmentPrompt") ?? lesson.assignment_prompt),
        assignment_submit_label: String(form.get("assignmentSubmitLabel") ?? lesson.assignment_submit_label),
        assignment_title: String(form.get("assignmentTitle") ?? lesson.assignment_title),
        description: String(form.get("description") ?? lesson.description),
        duration: String(form.get("duration") ?? lesson.duration),
        mentor_lm_note_config: asJson({
          adminEditable: true,
          allowStudentSave: getBoolean(form.get("allowStudentSave")),
          enabled: getBoolean(form.get("mentorLMEnabled"))
        }),
        status: String(form.get("status") ?? lesson.status) as CatalogLessonRow["status"],
        title: String(form.get("title") ?? lesson.title),
        video_label: String(form.get("videoLabel") ?? lesson.video_label),
        video_source_type: String(form.get("videoSourceType") ?? "external") as CatalogLessonRow["video_source_type"],
        video_url: String(form.get("videoUrl") ?? "").trim() || null
      });
      await onReload();
      setStatus("success", "Lesson saved.");
    } catch (error) {
      setStatus("error", getErrorMessage(error, "Lesson could not be saved."));
    }
  }

  return (
    <div className="admin-editor-card lesson-editor" key={lesson.id}>
      <div className="admin-editor-title">
        <span>Lesson editor</span>
        <strong>{lesson.title}</strong>
      </div>
      <div className="admin-segmented">
        {["basics", "video", "assignment", "materials", "quiz", "mentorlm"].map((item) => (
          <button className={tab === item ? "is-active" : ""} key={item} type="button" onClick={() => setTab(item as typeof tab)}>
            {item}
          </button>
        ))}
      </div>
      <form className="admin-form-grid" onSubmit={saveLesson}>
        {tab === "basics" ? (
          <>
            <Field label="Lesson title"><input name="title" defaultValue={lesson.title} /></Field>
            <Field label="Duration"><input name="duration" defaultValue={lesson.duration} /></Field>
            <Field label="Status">
              <select name="status" defaultValue={lesson.status}>
                <option>draft</option>
                <option>published</option>
                <option>archived</option>
              </select>
            </Field>
            <Field label="Description"><textarea name="description" rows={4} defaultValue={lesson.description} /></Field>
          </>
        ) : null}
        {tab === "video" ? (
          <>
            <Field label="Video label"><input name="videoLabel" defaultValue={lesson.video_label} /></Field>
            <Field label="Video source type">
              <select name="videoSourceType" defaultValue={lesson.video_source_type}>
                <option>youtube</option>
                <option>telegram</option>
                <option>file</option>
                <option>external</option>
              </select>
            </Field>
            <Field label="Video URL"><input name="videoUrl" defaultValue={lesson.video_url ?? ""} /></Field>
          </>
        ) : null}
        {tab === "assignment" ? (
          <>
            <Field label="Assignment title"><input name="assignmentTitle" defaultValue={lesson.assignment_title} /></Field>
            <Field label="Submit label"><input name="assignmentSubmitLabel" defaultValue={lesson.assignment_submit_label} /></Field>
            <Field label="Max file size MB"><input name="assignmentMaxFileSizeMb" type="number" defaultValue={lesson.assignment_max_file_size_mb} /></Field>
            <Field label="Accepted file types" helper="One extension per line.">
              <textarea
                name="assignmentAcceptedFileTypes"
                rows={4}
                defaultValue={Array.isArray(lesson.assignment_accepted_file_types) ? lesson.assignment_accepted_file_types.join("\n") : ""}
              />
            </Field>
            <Field label="Prompt"><textarea name="assignmentPrompt" rows={5} defaultValue={lesson.assignment_prompt} /></Field>
            <Field label="Review mode">
              <select name="reviewMode" defaultValue={String(assignmentConfig.reviewMode ?? "manual")}>
                <option value="manual">manual</option>
                <option value="mentor-assisted">mentor-assisted</option>
              </select>
            </Field>
            <label className="admin-check-field"><input name="assignmentAcceptsFiles" type="checkbox" defaultChecked={lesson.assignment_accepts_files} />Accept files</label>
            <label className="admin-check-field"><input name="visibleToMentors" type="checkbox" defaultChecked={assignmentConfig.visibleToMentors !== false} />Visible to mentors</label>
          </>
        ) : null}
        {tab === "mentorlm" ? (
          <>
            <label className="admin-check-field"><input name="mentorLMEnabled" type="checkbox" defaultChecked={noteConfig.enabled !== false} />MentorLM notes enabled</label>
            <label className="admin-check-field"><input name="allowStudentSave" type="checkbox" defaultChecked={noteConfig.allowStudentSave !== false} />Students can save MentorLM notes</label>
          </>
        ) : null}
        {tab === "materials" ? <MaterialsEditor editable={editable} materials={materials} onReload={onReload} setStatus={setStatus} /> : null}
        {tab === "quiz" ? <QuizEditor editable={editable} questions={questions} onReload={onReload} setStatus={setStatus} /> : null}
        {tab !== "materials" && tab !== "quiz" ? (
          <button className="admin-primary-action" disabled={!editable} type="submit">
            <FloppyDisk aria-hidden="true" size={16} weight="light" />
            <span>Save lesson</span>
          </button>
        ) : null}
      </form>
    </div>
  );
}

function MaterialsEditor({
  editable,
  materials,
  onReload,
  setStatus
}: {
  editable: boolean;
  materials: CatalogMaterialRow[];
  onReload: () => Promise<void>;
  setStatus: (state: SaveState, message: string) => void;
}) {
  async function saveMaterial(event: FormEvent<HTMLFormElement>, material: CatalogMaterialRow) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading", "");

    try {
      await updateCatalogMaterial(material.id, {
        description: String(form.get("description") ?? ""),
        downloadable: getBoolean(form.get("downloadable")),
        kind: String(form.get("kind") ?? "document") as CatalogMaterialRow["kind"],
        title: String(form.get("title") ?? ""),
        url: String(form.get("url") ?? "")
      });
      await onReload();
      setStatus("success", "Material saved.");
    } catch (error) {
      setStatus("error", getErrorMessage(error, "Material could not be saved."));
    }
  }

  return (
    <div className="admin-nested-list">
      {materials.map((material) => (
        <form className="admin-inline-form" key={material.id} onSubmit={(event) => saveMaterial(event, material)}>
          <input name="title" defaultValue={material.title} aria-label="Material title" />
          <select name="kind" defaultValue={material.kind} aria-label="Material kind">
            <option>document</option>
            <option>download</option>
            <option>link</option>
          </select>
          <input name="url" defaultValue={material.url} aria-label="Material URL" />
          <input name="description" defaultValue={material.description} aria-label="Material description" />
          <label><input name="downloadable" type="checkbox" defaultChecked={material.downloadable} />Download</label>
          <button disabled={!editable} type="submit">Save</button>
        </form>
      ))}
      {materials.length === 0 ? <p className="admin-empty compact">No materials yet.</p> : null}
    </div>
  );
}

function QuizEditor({
  editable,
  onReload,
  questions,
  setStatus
}: {
  editable: boolean;
  onReload: () => Promise<void>;
  questions: CatalogQuizQuestionRow[];
  setStatus: (state: SaveState, message: string) => void;
}) {
  async function saveQuestion(event: FormEvent<HTMLFormElement>, question: CatalogQuizQuestionRow) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading", "");

    try {
      await updateCatalogQuizQuestion(question.id, {
        accepted_answers: asJson(parseLines(form.get("acceptedAnswers"))),
        correct_answer: String(form.get("correctAnswer") ?? ""),
        feedback_correct: String(form.get("feedbackCorrect") ?? ""),
        feedback_incorrect: String(form.get("feedbackIncorrect") ?? ""),
        prompt: String(form.get("prompt") ?? ""),
        type: String(form.get("type") ?? "radio") as CatalogQuizQuestionRow["type"]
      });
      await onReload();
      setStatus("success", "Quiz question saved.");
    } catch (error) {
      setStatus("error", getErrorMessage(error, "Quiz question could not be saved."));
    }
  }

  return (
    <div className="admin-nested-list">
      {questions.map((question) => (
        <form className="admin-question-form" key={question.id} onSubmit={(event) => saveQuestion(event, question)}>
          <Field label="Prompt"><textarea name="prompt" rows={2} defaultValue={question.prompt} /></Field>
          <Field label="Type">
            <select name="type" defaultValue={question.type}>
              <option>radio</option>
              <option>text</option>
            </select>
          </Field>
          <Field label="Correct answer"><input name="correctAnswer" defaultValue={question.correct_answer} /></Field>
          <Field label="Accepted text answers"><textarea name="acceptedAnswers" rows={2} defaultValue={Array.isArray(question.accepted_answers) ? question.accepted_answers.join("\n") : ""} /></Field>
          <Field label="Correct feedback"><input name="feedbackCorrect" defaultValue={question.feedback_correct} /></Field>
          <Field label="Incorrect feedback"><input name="feedbackIncorrect" defaultValue={question.feedback_incorrect} /></Field>
          <button className="admin-secondary-action" disabled={!editable} type="submit">Save question</button>
        </form>
      ))}
      {questions.length === 0 ? <p className="admin-empty compact">No quiz questions yet.</p> : null}
    </div>
  );
}

function OpportunitiesAdmin({
  catalog,
  editable,
  onCatalogReload,
  query,
  selectedOpportunityId,
  setQuery,
  setSelectedOpportunityId,
  setStatus
}: {
  catalog: AdminCatalog;
  editable: boolean;
  onCatalogReload: () => Promise<void>;
  query: string;
  selectedOpportunityId: string;
  setQuery: (query: string) => void;
  setSelectedOpportunityId: (id: string) => void;
  setStatus: (state: SaveState, message: string) => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = catalog.opportunities.filter((opportunity) =>
    [opportunity.title, opportunity.direction, opportunity.category, opportunity.location].join(" ").toLowerCase().includes(normalizedQuery)
  );
  const selected = catalog.opportunities.find((opportunity) => opportunity.id === selectedOpportunityId) ?? catalog.opportunities[0];

  async function saveOpportunity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected) {
      return;
    }

    const form = new FormData(event.currentTarget);
    setStatus("loading", "");

    try {
      await updateCatalogOpportunity(selected.id, {
        apply_url: String(form.get("applyUrl") ?? ""),
        category: String(form.get("category") ?? ""),
        deadline: String(form.get("deadline") ?? ""),
        description: String(form.get("description") ?? ""),
        direction: String(form.get("direction") ?? ""),
        format: String(form.get("format") ?? "Online") as CatalogOpportunityRow["format"],
        grades: asJson(parseLines(form.get("grades"))),
        location: String(form.get("location") ?? ""),
        requirements: String(form.get("requirements") ?? ""),
        status: String(form.get("status") ?? "draft") as CatalogOpportunityRow["status"],
        tags: asJson(parseLines(form.get("tags"))),
        title: String(form.get("title") ?? "")
      });
      await onCatalogReload();
      setStatus("success", "Opportunity saved.");
    } catch (error) {
      setStatus("error", getErrorMessage(error, "Opportunity could not be saved."));
    }
  }

  return (
    <div className="admin-split">
      <aside className="admin-list-pane">
        <div className="admin-pane-head">
          <h2>Opportunities</h2>
          <input value={query} placeholder="Search opportunities" onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="admin-row-list">
          {filtered.map((opportunity) => (
            <button
              className={`admin-row-button${selected?.id === opportunity.id ? " is-selected" : ""}`}
              key={opportunity.id}
              type="button"
              onClick={() => setSelectedOpportunityId(opportunity.id)}
            >
              <strong>{opportunity.title}</strong>
              <span>{opportunity.direction} · {opportunity.status}</span>
            </button>
          ))}
        </div>
      </aside>
      <section className="admin-detail-pane">
        {selected ? (
          <form className="admin-editor-card" key={selected.id} onSubmit={saveOpportunity}>
            <div className="admin-editor-title">
              <span>Opportunity editor</span>
              <button className="admin-primary-action" disabled={!editable} type="submit">Save opportunity</button>
            </div>
            <div className="admin-form-grid">
              <Field label="Title"><input name="title" defaultValue={selected.title} /></Field>
              <Field label="Category"><input name="category" defaultValue={selected.category} /></Field>
              <Field label="Direction"><input name="direction" defaultValue={selected.direction} /></Field>
              <Field label="Format">
                <select name="format" defaultValue={selected.format}>
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </Field>
              <Field label="Deadline"><input name="deadline" defaultValue={selected.deadline} /></Field>
              <Field label="Location"><input name="location" defaultValue={selected.location} /></Field>
              <Field label="Status">
                <select name="status" defaultValue={selected.status}>
                  <option>draft</option>
                  <option>published</option>
                  <option>archived</option>
                </select>
              </Field>
              <Field label="Apply URL"><input name="applyUrl" defaultValue={selected.apply_url} /></Field>
              <Field label="Grades" helper="One grade per line."><textarea name="grades" rows={3} defaultValue={Array.isArray(selected.grades) ? selected.grades.join("\n") : ""} /></Field>
              <Field label="Tags" helper="One tag per line."><textarea name="tags" rows={3} defaultValue={Array.isArray(selected.tags) ? selected.tags.join("\n") : ""} /></Field>
              <Field label="Description"><textarea name="description" rows={5} defaultValue={selected.description} /></Field>
              <Field label="Requirements"><textarea name="requirements" rows={4} defaultValue={selected.requirements} /></Field>
            </div>
          </form>
        ) : (
          <div className="admin-empty">Seed the admin catalog before editing opportunities.</div>
        )}
      </section>
    </div>
  );
}

function AssignmentsAdmin({
  assignments,
  catalog,
  events,
  filter,
  onAssignmentsReload,
  selectedSubmissionId,
  setFilter,
  setSelectedSubmissionId,
  setStatus
}: {
  assignments: AdminAssignmentSubmission[];
  catalog: AdminCatalog;
  events: AssignmentReviewEventRow[];
  filter: string;
  onAssignmentsReload: () => Promise<void>;
  selectedSubmissionId: number | null;
  setFilter: (filter: string) => void;
  setSelectedSubmissionId: (id: number) => void;
  setStatus: (state: SaveState, message: string) => void;
}) {
  const filteredAssignments = assignments.filter((assignment) => filter === "all" || assignment.review_status === filter);
  const selected = assignments.find((assignment) => assignment.id === selectedSubmissionId) ?? filteredAssignments[0];
  const courseTitle = selected ? catalog.courses.find((course) => course.id === selected.course_id)?.title ?? selected.course_id : "";
  const lessonTitle = selected ? catalog.lessons.find((lesson) => lesson.id === selected.lesson_id)?.title ?? selected.lesson_id : "";

  async function saveReview(form: HTMLFormElement, status: AssignmentReviewStatus) {
    if (!selected) {
      return;
    }

    const data = new FormData(form);
    setStatus("loading", "");

    try {
      await reviewAssignmentSubmission({
        feedbackText: String(data.get("feedback") ?? ""),
        score: data.get("score") ? getNumber(data.get("score"), 0) : null,
        status,
        submissionId: selected.id
      });
      await onAssignmentsReload();
      setStatus("success", "Assignment review saved.");
    } catch (error) {
      setStatus("error", getErrorMessage(error, "Assignment review could not be saved."));
    }
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveReview(event.currentTarget, "reviewed");
  }

  return (
    <div className="admin-split">
      <aside className="admin-list-pane">
        <div className="admin-pane-head">
          <h2>Queue</h2>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="reviewed">Reviewed</option>
            <option value="revision_requested">Revision requested</option>
          </select>
        </div>
        <div className="admin-row-list">
          {filteredAssignments.map((assignment) => (
            <button
              className={`admin-row-button${selected?.id === assignment.id ? " is-selected" : ""}`}
              key={assignment.id}
              type="button"
              onClick={() => setSelectedSubmissionId(assignment.id)}
            >
              <strong>{assignment.student?.name || assignment.student?.email || "Student"}</strong>
              <span>{assignment.course_id} · {assignment.review_status}</span>
            </button>
          ))}
        </div>
      </aside>
      <section className="admin-detail-pane">
        {selected ? (
          <form className="admin-editor-card" key={selected.id} onSubmit={submitReview}>
            <div className="admin-editor-title">
              <span>Assignment review</span>
              <strong>{selected.review_status.replace("_", " ")}</strong>
            </div>
            <div className="admin-submission-block">
              <span>{courseTitle}</span>
              <h2>{lessonTitle}</h2>
              <p>{selected.answer || "No text answer submitted."}</p>
              {selected.attachment_path ? <small>Attachment: {selected.attachment_name ?? selected.attachment_path}</small> : null}
            </div>
            <div className="admin-form-grid">
              <Field label="Score"><input name="score" type="number" min="0" max="10" step="0.5" defaultValue={selected.score ?? ""} /></Field>
              <Field label="Feedback"><textarea name="feedback" rows={6} defaultValue={selected.feedback_text ?? ""} /></Field>
            </div>
            <div className="admin-action-row">
              <button className="admin-primary-action" type="submit">Mark reviewed</button>
              <button
                className="admin-secondary-action"
                type="button"
                onClick={(event) => {
                  const form = event.currentTarget.form;
                  if (form) {
                    saveReview(form, "revision_requested");
                  }
                }}
              >
                Request revision
              </button>
            </div>
            <div className="admin-review-events">
              <h3>Review history</h3>
              {events.map((event) => (
                <article key={event.id}>
                  <strong>{event.event_type.replace("_", " ")}</strong>
                  <span>{new Date(event.created_at).toLocaleString()}</span>
                  {event.feedback_text ? <p>{event.feedback_text}</p> : null}
                </article>
              ))}
              {events.length === 0 ? <p>No review events yet.</p> : null}
            </div>
          </form>
        ) : (
          <div className="admin-empty">No assignment submissions yet.</div>
        )}
      </section>
    </div>
  );
}

function MentorNotesAdmin({ notes }: { notes: MentorNoteRow[] }) {
  return (
    <section className="admin-editor-card">
      <div className="admin-editor-title">
        <span>MentorLM notes</span>
        <strong>{notes.length} rows</strong>
      </div>
      <div className="admin-note-grid">
        {notes.map((note) => (
          <article key={note.id}>
            <NotePencil aria-hidden="true" size={18} weight="light" />
            <strong>{note.title}</strong>
            <span>{note.course_id} · {note.lesson_id}</span>
            <p>{note.body}</p>
          </article>
        ))}
      </div>
      {notes.length === 0 ? <p className="admin-empty compact">No MentorLM lesson notes yet.</p> : null}
    </section>
  );
}

function StaffAdmin({
  actorId,
  onReload,
  setStatus,
  staff
}: {
  actorId: string;
  onReload: () => Promise<void>;
  setStatus: (state: SaveState, message: string) => void;
  staff: AdminMembership[];
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading", "");

    try {
      await upsertAdminMembership(actorId, {
        role: String(form.get("role") ?? "mentor") as AdminRole,
        status: String(form.get("status") ?? "active") as AdminStatus,
        userId: String(form.get("userId") ?? "").trim()
      });
      await onReload();
      event.currentTarget.reset();
      setStatus("success", "Staff membership saved.");
    } catch (error) {
      setStatus("error", getErrorMessage(error, "Staff membership could not be saved."));
    }
  }

  return (
    <div className="admin-split">
      <section className="admin-editor-card">
        <div className="admin-editor-title">
          <span>Staff memberships</span>
          <strong>{staff.length} accounts</strong>
        </div>
        <div className="admin-table">
          {staff.map((member) => (
            <article key={member.user_id}>
              <strong>{member.user_id}</strong>
              <span>{member.role.replace("_", " ")} · {member.status}</span>
            </article>
          ))}
        </div>
      </section>
      <form className="admin-editor-card" onSubmit={submit}>
        <div className="admin-editor-title">
          <span>Add or update staff</span>
        </div>
        <Field label="User ID"><input name="userId" required placeholder="Supabase auth user UUID" /></Field>
        <Field label="Role">
          <select name="role" defaultValue="mentor">
            <option value="admin">admin</option>
            <option value="mentor">mentor</option>
            <option value="content_editor">content_editor</option>
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue="active">
            <option value="active">active</option>
            <option value="suspended">suspended</option>
          </select>
        </Field>
        <button className="admin-primary-action" type="submit">Save staff member</button>
      </form>
    </div>
  );
}
