import CourseCard from "./CourseCard";
import styles from "./CourseGrid.module.css";

export default function CourseGrid({
  courses = [],
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
         <CourseCard/>
         <CourseCard/>
         <CourseCard/>
         <CourseCard/>
                 </div>
      {courses.length > 0 ? (
        <div className={styles.grid}>
          {courses.map((course) => (
            <CourseCard
              key={course.id || course.slug}
              course={course}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            ?
          </div>

          <h3>No courses found</h3>

          <p>
            Try changing your search or filters to
            find another course.
          </p>
        </div>
      )}
    </div>
  );
}