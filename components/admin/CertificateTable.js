import Link from "next/link";

import {
  Eye,
  FileText,
  Pencil,
  RotateCcw,
  ShieldOff,
  Trash2,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import styles from "./Certificates.module.css";

function getStudentName(student) {
  return student?.fullName || "Unknown student";
}

function getRollNumber(student) {
  return student?.rollNumber || "—";
}

function getCourseName(student) {
  return (
    student?.course?.shortTitle ||
    student?.course?.title ||
    "—"
  );
}

function getCertificateId(certificate) {
  return certificate?._id || certificate?.id;
}

export default function CertificateTable({
  certificates,
  onDelete,
  onToggle,
}) {
  if (!certificates.length) {
    return (
      <div className={styles.empty}>
        <h2>No certificates found</h2>

        <p>
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Certificate Number</th>
              <th>Student</th>
              <th>Course</th>
              <th>Status</th>
              <th>Certificate File</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {certificates.map((item) => {
              const certificateId =
                getCertificateId(item);

              const studentName =
                getStudentName(item.student);

              const rollNumber =
                getRollNumber(item.student);

              const courseName =
                getCourseName(item.student);

              return (
                <tr key={certificateId}>
                  <td
                    className={
                      styles.certificateNumber
                    }
                  >
                    {item.certificateNumber}
                  </td>

                  <td>
                    <div
                      className={
                        styles.studentCell
                      }
                    >
                      <strong>
                        {studentName}
                      </strong>

                      <small>
                        Roll No: {rollNumber}
                      </small>
                    </div>
                  </td>

                  <td>
                    {courseName}
                  </td>

                  <td>
                    <StatusBadge
                      status={item.status}
                    />
                  </td>

                  <td>
                    {item.certificateFile ? (
                      <FileText
                        size={16}
                        aria-label="Certificate file available"
                      />
                    ) : (
                      <span
                        className={
                          styles.muted
                        }
                      >
                        Not added
                      </span>
                    )}
                  </td>

                  <td>
                    <div
                      className={
                        styles.actions
                      }
                    >
                      <Link
                        href={`/admin/certificates/${certificateId}`}
                        className={
                          styles.iconButton
                        }
                        aria-label={`View ${item.certificateNumber}`}
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        href={`/admin/certificates/${certificateId}/edit`}
                        className={
                          styles.iconButton
                        }
                        aria-label={`Edit ${item.certificateNumber}`}
                      >
                        <Pencil size={16} />
                      </Link>

                      {item.status !==
                        "EXPIRED" && (
                        <button
                          type="button"
                          className={
                            styles.iconButton
                          }
                          onClick={() =>
                            onToggle(item)
                          }
                          aria-label={
                            item.status ===
                            "VALID"
                              ? `Revoke ${item.certificateNumber}`
                              : `Restore ${item.certificateNumber}`
                          }
                        >
                          {item.status ===
                          "VALID" ? (
                            <ShieldOff
                              size={16}
                            />
                          ) : (
                            <RotateCcw
                              size={16}
                            />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.danger}`}
                        onClick={() =>
                          onDelete(item)
                        }
                        aria-label={`Delete ${item.certificateNumber}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className={styles.mobileCards}>
        {certificates.map((item) => {
          const certificateId =
            getCertificateId(item);

          const studentName =
            getStudentName(item.student);

          const rollNumber =
            getRollNumber(item.student);

          const courseName =
            getCourseName(item.student);

          return (
            <article
              className={styles.mobileCard}
              key={certificateId}
            >
              <div
                className={
                  styles.mobileCardTop
                }
              >
                <span
                  className={
                    styles.certificateNumber
                  }
                >
                  {item.certificateNumber}
                </span>

                <StatusBadge
                  status={item.status}
                />
              </div>

              <div
                className={
                  styles.mobileMeta
                }
              >
                <span>
                  <small>
                    Student
                  </small>

                  <strong>
                    {studentName}
                  </strong>
                </span>

                <span>
                  <small>
                    Roll Number
                  </small>

                  <strong>
                    {rollNumber}
                  </strong>
                </span>

                <span>
                  <small>
                    Course
                  </small>

                  <strong>
                    {courseName}
                  </strong>
                </span>

                <span>
                  <small>
                    File
                  </small>

                  <strong>
                    {item.certificateFile
                      ? "Available"
                      : "Not added"}
                  </strong>
                </span>
              </div>

              <div
                className={
                  styles.mobileCardActions
                }
              >
                <Link
                  href={`/admin/certificates/${certificateId}`}
                  className={
                    styles.iconButton
                  }
                >
                  <Eye size={15} />
                  View
                </Link>

                <Link
                  href={`/admin/certificates/${certificateId}/edit`}
                  className={
                    styles.iconButton
                  }
                >
                  <Pencil size={15} />
                  Edit
                </Link>

                {item.status !==
                  "EXPIRED" && (
                  <button
                    type="button"
                    className={
                      styles.iconButton
                    }
                    onClick={() =>
                      onToggle(item)
                    }
                  >
                    {item.status ===
                    "VALID" ? (
                      <ShieldOff
                        size={15}
                      />
                    ) : (
                      <RotateCcw
                        size={15}
                      />
                    )}

                    {item.status ===
                    "VALID"
                      ? "Revoke"
                      : "Restore"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}