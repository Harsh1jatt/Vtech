import styles from "./CourseHighlights.module.css";

export default function CourseHighlights({ course }) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <div>
          <span>01</span>
          <h2>What you&apos;ll learn</h2>
        </div>

        <p>
          A practical curriculum focused on skills you can actually use.
        </p>
      </div>

      <div className={styles.highlights}>
        {course.highlights?.map((item, index) => (
          <div className={styles.item} key={item}>
            <div className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </div>

            <div>
              <h3>{item}</h3>
              <span>Included in the program</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.skills}>
        <h3>Major Skills</h3>

        <div className={styles.skillList}>
          {course.skills?.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
    </section>
  );
}