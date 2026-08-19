import Link from "next/link";
import styles from "./CourseDetails.module.css";

export default function CourseSidebar({ course }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarCard}>
        <div className={styles.sidebarMedia}>
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className={styles.sidebarImage}
            />
          ) : (
            <div className={styles.sidebarPlaceholder}>
              Course Image
            </div>
          )}
        </div>

        <div className={styles.sidebarBody}>
          <p className={styles.sidebarMeta}>Course Duration</p>

          <p className={styles.sidebarValue}>{course.duration}</p>

          <hr className={styles.sidebarDivider} />

          <p className={styles.sidebarMeta}>Course Fee</p>

          {course.price ? (
            <p className={styles.sidebarFee}>
              ₹{course.price.toLocaleString("en-IN")}
            </p>
          ) : (
            <p className={styles.sidebarValue}>Contact for Fee</p>
          )}

          <Link
            href="/contact"
            className={styles.sidebarCta}
          >
            Enquire About This Course
          </Link>

          <p className={styles.sidebarNote}>
            Contact us for admission details, fees and course availability.
          </p>
        </div>
      </div>
    </aside>
  );
}