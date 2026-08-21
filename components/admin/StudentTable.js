import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import styles from "./Students.module.css";

function Avatar({ name = "" }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return <span className={styles.avatar}>{initials}</span>;
}

function formatDate(date) {
  if (!date) return "—";

  const value = date.slice(0, 10);
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

export default function StudentTable({ students = [], onDelete }) {
  if (!students.length) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>
          <Eye size={21} />
        </span>

        <h2>No students found</h2>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / Tablet table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll Number</th>
              <th>Course</th>
              <th>Phone</th>
              <th>Admission Date</th>
              <th>Status</th>
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  <div className={styles.studentCell}>
                    <Avatar name={student.fullName} />

                    <div className={styles.studentInfo}>
                      <strong>{student.fullName}</strong>
                      {/* <small>{student.email || "No email provided"}</small> */}
                    </div>
                  </div>
                </td>

                <td>
                  <span className={styles.muted}>
                    {student.rollNumber || "—"}
                  </span>
                </td>

                <td>
                  <span className={styles.courseName}>
                    {student.course?.title || "Unknown course"}
                  </span>
                </td>

                <td>
                  <span className={styles.muted}>
                    {student.phone || "—"}
                  </span>
                </td>

                <td>
                  <span className={styles.muted}>
                    {formatDate(student.admissionDate)}
                  </span>
                </td>

                <td>
                  <StatusBadge status={student.status} />
                </td>

                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/admin/students/${student._id}`}
                      className={styles.iconButton}
                      aria-label={`View ${student.fullName}`}
                      title="View student"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/students/${student._id}/edit`}
                      className={styles.iconButton}
                      aria-label={`Edit ${student.fullName}`}
                      title="Edit student"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      className={`${styles.iconButton} ${styles.danger}`}
                      onClick={() => onDelete(student)}
                      aria-label={`Delete ${student.fullName}`}
                      title="Delete student"
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

      {/* Mobile cards */}
      <div className={styles.mobileCards}>
        {students.map((student) => (
          <article className={styles.mobileCard} key={student._id}>
            <div className={styles.mobileCardTop}>
              <div className={styles.studentCell}>
                <Avatar name={student.fullName} />

                <div className={styles.studentInfo}>
                  <strong>{student.fullName}</strong>
                  {/* <small>{student.email || "No email provided"}</small> */}
                </div>
              </div>

              <StatusBadge status={student.status} />
            </div>

            <div className={styles.mobileMeta}>
              <div>
                <small>Course</small>
                <strong>
                  {student.course?.title || "Unknown course"}
                </strong>
              </div>

              <div>
                <small>Roll Number</small>
                <strong>{student.rollNumber || "—"}</strong>
              </div>

              <div>
                <small>Phone</small>
                <strong>{student.phone || "—"}</strong>
              </div>

              <div>
                <small>Admission</small>
                <strong>{formatDate(student.admissionDate)}</strong>
              </div>
            </div>

            <div className={styles.mobileCardActions}>
              <Link
                href={`/admin/students/${student._id}`}
                className={styles.actionButton}
              >
                <Eye size={15} />
                View
              </Link>

              <Link
                href={`/admin/students/${student._id}/edit`}
                className={styles.actionButton}
              >
                <Pencil size={15} />
                Edit
              </Link>

              <button
                type="button"
                className={`${styles.actionButton} ${styles.dangerAction}`}
                onClick={() => onDelete(student)}
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