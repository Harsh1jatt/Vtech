"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./Students.module.css";

export default function DeleteStudentModal({ student, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);
  if (!student) return null;
  return <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}><section className={styles.modal} role="alertdialog" aria-modal="true" aria-labelledby="delete-student-title" aria-describedby="delete-student-description"><button type="button" className={styles.modalClose} onClick={onCancel} aria-label="Close delete confirmation"><X size={18} /></button><h2 id="delete-student-title">Delete Student?</h2><p id="delete-student-description">This demo action will remove <strong>{student.fullName}</strong> from the current list.</p><div className={styles.modalActions}><button type="button" ref={cancelRef} className={styles.secondaryButton} onClick={onCancel}>Cancel</button><button type="button" className={styles.dangerButton} onClick={onConfirm}>Delete Student</button></div></section></div>;
}