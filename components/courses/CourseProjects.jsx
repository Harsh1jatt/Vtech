import styles from "./CourseDetails.module.css";

const fallbackProjects = [
  {
    title: "MS Word practical",
    description:
      "Create and format professional documents using MS Word.",
  },
  {
    title: "MS Excel practical",
    description:
      "Work with formulas, functions, tables, and practical spreadsheets.",
  },
  {
    title: "PowerPoint presentation",
    description:
      "Create structured and professional presentations.",
  },
  {
    title: "Database project",
    description:
      "Build and manage a practical database project.",
  },
  {
    title: "Website project",
    description:
      "Create a functional website using practical web development skills.",
  },
  {
    title: "Graphic-design project",
    description:
      "Create practical designs using graphic design tools.",
  },
  {
    title: "Final integrated project",
    description:
      "Combine the skills learned throughout the course into one final project.",
  },
];

export default function CourseProjects({ course }) {
  const projects =
    Array.isArray(course?.projects) &&
    course.projects.length > 0
      ? course.projects
      : fallbackProjects;

  return (
    <section className={styles.dividerSection}>
      <p className={styles.sectionLabel}>
        Practical Learning
      </p>

      <h2 className={styles.sectionTitle}>
        Projects & Practical Work
      </h2>

      <p className={styles.sectionDescription}>
        Apply what you learn through practical assignments
        and real-world projects throughout the course.
      </p>

      <div className={styles.projects}>
        {projects.map((project, index) => {
          const title =
            typeof project === "string"
              ? project
              : project?.title || "Practical Project";

          const description =
            typeof project === "string"
              ? ""
              : project?.description || "";

          return (
            <div
              className={styles.project}
              key={`${title}-${index}`}
            >
              <span className={styles.projectLabel}>
                Project{" "}
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className={styles.projectTitle}>
                {title}
              </h3>

              {description && (
                <p className={styles.projectDescription}>
                  {description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}