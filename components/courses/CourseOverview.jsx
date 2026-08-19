import styles from "./CourseOverview.module.css";

export default function CourseOverview({ course }) {
  return (
    <section className={styles.section}>
      <div className={styles.label}>
        <span />
        Course Overview
      </div>

      <h2>
        Build practical skills
        <br />
        <span>for the real world.</span>
      </h2>

      <p>{course.description}</p>
    </section>
  );
}