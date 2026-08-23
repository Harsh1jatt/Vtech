import styles from "./CourseDetails.module.css";
import CourseBuyButton from "./CourseBuyButton";

export default function CourseSidebar({ course }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarCard}>
        <div className={styles.sidebarMedia}>
          {course.thumbnail?.url ? (
            <img
              src={course.thumbnail.url}
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
          <p className={styles.sidebarMeta}>
            Course Duration
          </p>

          <p className={styles.sidebarValue}>
            {course.duration || "Contact for Details"}
          </p>

          <hr className={styles.sidebarDivider} />

          <p className={styles.sidebarMeta}>
            Course Fee
          </p>

          {course.price ? (
            <p className={styles.sidebarFee}>
              ₹{Number(course.price).toLocaleString("en-IN")}
            </p>
          ) : (
            <p className={styles.sidebarValue}>
              Contact for Fee
            </p>
          )}

          <CourseBuyButton course={course} />

          <p className={styles.sidebarNote}>
            Contact us on WhatsApp for admission details,
            fees, batch timings and course availability.
          </p>
        </div>
      </div>
    </aside>
  );
}