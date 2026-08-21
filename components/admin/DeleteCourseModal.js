"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./Students.module.css";

export default function DeleteCourseModal({ course, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);
  if (!course) return null;
  return <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}><section className={styles.modal} role="alertdialog" aria-modal="true" aria-labelledby="delete-course-title" aria-describedby="delete-course-description"><button type="button" className={styles.modalClose} onClick={onCancel} aria-label="Close delete confirmation"><X size={18} /></button><h2 id="delete-course-title">Delete Course?</h2><p id="delete-course-description">This will permanently remove <strong>{course.title}</strong>.</p><div className={styles.modalActions}><button type="button" ref={cancelRef} className={styles.secondaryButton} onClick={onCancel}>Cancel</button><button type="button" className={styles.dangerButton} onClick={onConfirm}>Delete Course</button></div></section></div>;
}