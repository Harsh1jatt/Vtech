import Link from "next/link";
import styles from "./CourseHeader.module.css";

export default function CourseHeader({ course }) {
  return (
    <section className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/courses">
            Courses
          </Link>

          <span aria-hidden="true">/</span>

          <span>{course.title}</span>
        </nav>

        <div className={styles.content}>
          <div className={styles.badges}>
            <span className={styles.category}>
              {course.category}
            </span>

            {course.level && (
              <span className={styles.level}>{course.level}</span>
            )}

            <span className={styles.duration}>{course.duration}</span>
          </div>

          <h1>{course.title}</h1>

          <p>{course.description}</p>
        </div>

        <div className={styles.bottom}>
          <div>
            <span>Course type</span>
            <strong>{course.type}</strong>
          </div>

          <div>
            <span>Duration</span>
            <strong>{course.duration}</strong>
          </div>

          <div>
            <span>Category</span>
            <strong>{course.category}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}