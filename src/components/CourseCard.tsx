import type { Course } from "../data/content";

type CourseCardProps = {
  course: Course;
  showTrack?: boolean;
};

export function CourseCard({ course, showTrack = true }: CourseCardProps) {
  return (
    <article className="course-card">
      <div
        className="course-visual"
        style={course.coverUrl ? { backgroundImage: `url(${course.coverUrl})` } : undefined}
        aria-hidden="true"
      />
      {showTrack ? <span>{course.track}</span> : null}
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </article>
  );
}
