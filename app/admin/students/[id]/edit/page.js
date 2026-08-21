"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import StudentForm from "@/components/admin/StudentForm";
import styles from "@/components/admin/Students.module.css";

export default function EditStudentPage({ params }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.resolve(params).then(({ id }) => fetch(`/api/admin/students/${id}`).then((response) => response.json()).then((result) => setStudent(result.student)).finally(() => setLoading(false))); }, [params]);
  if (loading) return <div className={styles.empty}><h2>Loading student...</h2></div>;
  if (!student) return <div className={styles.empty}><h2>Student not found</h2><Link href="/admin/students" className={styles.primaryButton}>Back to students</Link></div>;
  return <div><Link href={`/admin/students/${id}`} className={styles.backLink}><ArrowLeft size={15} /> Back to student</Link><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Learner record</span><h1>Edit Student</h1><p>Update {student.fullName}&apos;s information.</p></div></div><StudentForm student={student} submitLabel="Update Student" /></div>;
}