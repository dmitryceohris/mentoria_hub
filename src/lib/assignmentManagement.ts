import { courses } from "../data/content";
import type {
  Course,
  LessonAssignment,
  LessonAssignmentManagementConfig,
  LessonAssignmentRubricItem,
  LessonVideoSourceType
} from "../data/content";

export type AssignmentManagementItem = {
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  assignmentId: string;
  assignmentTitle: string;
  prompt: string;
  acceptsFiles: boolean;
  acceptedFileTypes: string[];
  maxFileSizeMb: number;
  submitLabel: string;
  reviewMode: LessonAssignmentManagementConfig["reviewMode"];
  visibleToMentors: boolean;
  rubric: LessonAssignmentRubricItem[];
  videoSourceType: LessonVideoSourceType;
  mentorLMNotesEnabled: boolean;
};

export type AssignmentManagementFilter = {
  courseId?: string;
  reviewMode?: AssignmentManagementItem["reviewMode"];
  visibleToMentors?: boolean;
};

// Data seam for a future mentor/admin workspace; not surfaced in the student navigation.
function getAssignmentId(assignment: LessonAssignment, lessonId: string) {
  return assignment.id ?? `${lessonId}-assignment`;
}

function getAssignmentTitle(assignment: LessonAssignment) {
  return assignment.title ?? "Lesson assignment";
}

function getAssignmentRubric(assignment: LessonAssignment, lessonId: string): LessonAssignmentRubricItem[] {
  return assignment.rubric ?? [
    {
      id: `${lessonId}-rubric-concept`,
      label: "Concept accuracy",
      description: "The answer uses the lesson concept correctly.",
      maxScore: 4,
      adminEditable: true
    },
    {
      id: `${lessonId}-rubric-evidence`,
      label: "Evidence and reasoning",
      description: "The answer explains the reasoning with enough detail for review.",
      maxScore: 4,
      adminEditable: true
    },
    {
      id: `${lessonId}-rubric-clarity`,
      label: "Clarity",
      description: "The response is organized, readable, and ready for mentor feedback.",
      maxScore: 2,
      adminEditable: true
    }
  ];
}

function getAssignmentManagementConfig(assignment: LessonAssignment): LessonAssignmentManagementConfig {
  return assignment.managementConfig ?? {
    reviewMode: "manual",
    visibleToMentors: true,
    adminEditable: true
  };
}

export function buildAssignmentManagementIndex(courseCatalog: Course[] = courses): AssignmentManagementItem[] {
  return courseCatalog.flatMap((course) =>
    course.lessons.map((lesson) => {
      const managementConfig = getAssignmentManagementConfig(lesson.assignment);

      return {
        courseId: course.id,
        courseTitle: course.title,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        assignmentId: getAssignmentId(lesson.assignment, lesson.id),
        assignmentTitle: getAssignmentTitle(lesson.assignment),
        prompt: lesson.assignment.prompt,
        acceptsFiles: lesson.assignment.acceptsFiles,
        acceptedFileTypes: lesson.assignment.acceptedFileTypes,
        maxFileSizeMb: lesson.assignment.maxFileSizeMb,
        submitLabel: lesson.assignment.submitLabel,
        reviewMode: managementConfig.reviewMode,
        visibleToMentors: managementConfig.visibleToMentors,
        rubric: getAssignmentRubric(lesson.assignment, lesson.id),
        videoSourceType: lesson.video.sourceType,
        mentorLMNotesEnabled: lesson.mentorLMNoteConfig.enabled
      };
    })
  );
}

export function filterAssignmentManagementIndex(
  items: AssignmentManagementItem[],
  filter: AssignmentManagementFilter
) {
  return items.filter((item) => {
    if (filter.courseId && item.courseId !== filter.courseId) {
      return false;
    }

    if (filter.reviewMode && item.reviewMode !== filter.reviewMode) {
      return false;
    }

    if (typeof filter.visibleToMentors === "boolean" && item.visibleToMentors !== filter.visibleToMentors) {
      return false;
    }

    return true;
  });
}

export function getAssignmentManagementItem(courseId: string, lessonId: string, courseCatalog: Course[] = courses) {
  return buildAssignmentManagementIndex(courseCatalog).find(
    (item) => item.courseId === courseId && item.lessonId === lessonId
  );
}
