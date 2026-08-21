import Link from "next/link";
import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import styles from "./Courses.module.css";

function CourseMark({ code = "" }) { return <span className={styles.courseMark}>{code.slice(0, 3)}</span>; }

export default function CourseTable({ courses, onDelete }) {
  if (!courses.length) return <div className={styles.empty}><span className={styles.emptyIcon}><Eye size={21} /></span><h2>No courses found</h2><p>Try changing your search or filters.</p></div>;
  return <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Course</th><th>Short Title</th><th>Category</th><th>Duration</th><th>Type</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{courses.map((course) => <tr key={course._id}><td><div className={styles.courseCell}><CourseMark code={course.shortTitle} /><span><strong>{course.title}</strong><small>{course.shortDescription}</small></span></div></td><td className={styles.muted}>{course.shortTitle}</td><td>{course.category}</td><td className={styles.muted}>{course.duration}</td><td>{course.type}</td><td><StatusBadge status={course.status} /></td><td>{course.featured ? <Star size={16} fill="currentColor" color="var(--color-primary)" aria-label="Featured" /> : <span className={styles.muted}>No</span>}</td><td><div className={styles.actions}><Link href={`/admin/courses/${course._id}`} className={styles.iconButton} aria-label={`View ${course.title}`} title="View"><Eye size={16} /></Link><Link href={`/admin/courses/${course._id}/edit`} className={styles.iconButton} aria-label={`Edit ${course.title}`} title="Edit"><Pencil size={16} /></Link><button type="button" className={`${styles.iconButton} ${styles.danger}`} onClick={() => onDelete(course)} aria-label={`Delete ${course.title}`} title="Delete"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>;
}