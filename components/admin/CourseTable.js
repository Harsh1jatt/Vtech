import Link from "next/link";
import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import styles from "./Courses.module.css";

function CourseMark({ code = "" }) {
  return (
    <span className={styles.courseMark}>
      {code.slice(0, 3).toUpperCase()}
    </span>
  );
}

function displayValue(value) {
  return value || "—";
}

export default function CourseTable({ courses = [], onDelete }) {
  if (!courses.length) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>
          <Eye size={21} />
        </span>

        <h2>No courses found</h2>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Short Title</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Type</th>
              <th>Status</th>
              <th>Featured</th>
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>
                  <div className={styles.courseCell}>
                    <CourseMark code={course.shortTitle} />

                    <div className={styles.courseInfo}>
                      <strong>{course.title}</strong>
                      <small>
                        {course.shortDescription || "No description available"}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={styles.shortTitle}>
                    {displayValue(course.shortTitle)}
                  </span>
                </td>

                <td>
                  <span className={styles.categoryText}>
                    {displayValue(course.category)}
                  </span>
                </td>

                <td>
                  <span className={styles.muted}>
                    {displayValue(course.duration)}
                  </span>
                </td>

                <td>
                  <span className={styles.typeBadge}>
                    {displayValue(course.type)}
                  </span>
                </td>

                <td>
                  <StatusBadge status={course.status} />
                </td>

                <td>
                  {course.featured ? (
                    <span
                      className={styles.featuredBadge}
                      title="Featured course"
                    >
                      <Star
                        size={14}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                      <span>Yes</span>
                    </span>
                  ) : (
                    <span className={styles.notFeatured}>No</span>
                  )}
                </td>

                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/courses/${course._id}`}
                      className={styles.iconButton}
                      aria-label={`View ${course.title}`}
                      title="View course"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/courses/${course._id}/edit`}
                      className={styles.iconButton}
                      aria-label={`Edit ${course.title}`}
                      title="Edit course"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      className={`${styles.iconButton} ${styles.danger}`}
                      onClick={() => onDelete(course)}
                      aria-label={`Delete ${course.title}`}
                      title="Delete course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className={styles.mobileCards}>
        {courses.map((course) => (
          <article className={styles.mobileCard} key={course._id}>
            <div className={styles.mobileCardTop}>
              <div className={styles.courseCell}>
                <CourseMark code={course.shortTitle} />

                <div className={styles.courseInfo}>
                  <strong>{course.title}</strong>
                  <small>
                    {course.shortDescription || "No description available"}
                  </small>
                </div>
              </div>

              <StatusBadge status={course.status} />
            </div>

            <div className={styles.mobileMeta}>
              <div>
                <small>Short Title</small>
                <strong>{displayValue(course.shortTitle)}</strong>
              </div>

              <div>
                <small>Category</small>
                <strong>{displayValue(course.category)}</strong>
              </div>

              <div>
                <small>Duration</small>
                <strong>{displayValue(course.duration)}</strong>
              </div>

              <div>
                <small>Type</small>
                <strong>{displayValue(course.type)}</strong>
              </div>

              <div>
                <small>Featured</small>

                {course.featured ? (
                  <strong className={styles.mobileFeatured}>
                    <Star
                      size={13}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                    Featured
                  </strong>
                ) : (
                  <strong className={styles.mobileNotFeatured}>
                    Not featured
                  </strong>
                )}
              </div>
            </div>

            <div className={styles.mobileCardActions}>
              <Link
                href={`/admin/courses/${course._id}`}
                className={styles.actionButton}
              >
                <Eye size={15} />
                View
              </Link>

              <Link
                href={`/admin/courses/${course._id}/edit`}
                className={styles.actionButton}
              >
                <Pencil size={15} />
                Edit
              </Link>

              <button
                type="button"
                className={`${styles.actionButton} ${styles.dangerAction}`}
                onClick={() => onDelete(course)}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}