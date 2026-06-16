import { ConsoleShell } from "../components/ConsoleShell";
import { CourseCard } from "../components/CourseCard";
import { SearchIcon } from "../components/SearchIcon";
import { courses } from "../data/content";

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
        <ConsoleShell title="Course library" intro="Focused course tracks support the opportunity journey." coreClassName="product-core">
          <div className="showcase-search course-search" aria-label="Course search preview">
            <SearchIcon />
            <span>Search Mentoria courses</span>
          </div>
          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard course={course} key={course.title} />
            ))}
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}
