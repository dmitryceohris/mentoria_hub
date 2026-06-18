import { ConsoleShell } from "../components/ConsoleShell";
import { CourseCard } from "../components/CourseCard";
import { previewCourses } from "../data/previewContent";
import { useT } from "../lib/i18n";

export function CoursesSection() {
  const t = useT();

  return (
    <section className="product-section courses-section" id="courses" aria-labelledby="courses-title">
      <div className="match-copy product-copy">
        <h2 id="courses-title">{t.public.coursesTitle}</h2>
        <p>{t.public.coursesCopy}</p>
      </div>

      <div className="product-console" aria-label={t.public.coursesPreview}>
        <ConsoleShell coreClassName="product-core">
          <p className="course-preview-copy">{t.public.tryCourse}</p>
          <div className="course-grid">
            {previewCourses.map((course) => (
              <CourseCard course={course} key={course.id} showTrack={false} />
            ))}
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}
