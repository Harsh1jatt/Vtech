import styles from "./CourseDetails.module.css";

const fallbackProjects = [
  "MS Word practical",
  "MS Excel practical",
  "PowerPoint presentation",
  "Database project",
  "Website project",
  "Graphic-design project",
  "Final integrated project",
];

export default function CourseProjects({ course }) {
  const projects =
    course.projects?.length > 0 ? course.projects : fallbackProjects;

  return (
    <section className={styles.dividerSection}>
      <p className={styles.sectionLabel}>Practical Learning</p>

      <h2 className={styles.sectionTitle}>
        Projects & Practical Work
      </h2>

      <p className={styles.sectionDescription}>
        Apply what you learn through practical assignments and real-world
        projects throughout the course.
      </p>

      <div className={styles.projects}>
        {projects.map((project, index) => (
          <div className={styles.project} key={project}>
            <span className={styles.projectLabel}>
              Project {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className={styles.projectTitle}>
              {project}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}