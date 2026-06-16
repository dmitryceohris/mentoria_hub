import type { Course } from "../data/content";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="course-card">
      <div className="course-visual" aria-hidden="true" />
      <span>{course.track}</span>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </article>
  );
}
