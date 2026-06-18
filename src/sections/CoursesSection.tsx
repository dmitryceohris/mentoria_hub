import { ConsoleShell } from "../components/ConsoleShell";
import { CourseCard } from "../components/CourseCard";
import { previewCourses } from "../data/previewContent";

export function CoursesSection() {
  return (
    <section className="product-section courses-section" id="courses" aria-labelledby="courses-title">
      <div className="match-copy product-copy">
        <h2 id="courses-title">Free courses that support the journey</h2>
        <p>
          Mentoria courses sit beside opportunity search, so students can prepare for language tests, science tracks, and
          applications in one place.
        </p>
      </div>

      <div className="product-console" aria-label="Mentoria courses preview">
        <ConsoleShell coreClassName="product-core">
          <p className="course-preview-copy">Try out one of our best courses!</p>
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
