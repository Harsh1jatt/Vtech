import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentForm from "@/components/admin/StudentForm";
import { getStudentById } from "@/components/admin/studentData";
import styles from "@/components/admin/Students.module.css";

export default async function EditStudentPage({ params }) {
  const { id } = await params;
  const student = getStudentById(id);
  if (!student) return <div className={styles.empty}><h2>Student not found</h2><Link href="/admin/students" className={styles.primaryButton}>Back to students</Link></div>;
  return <div><Link href={`/admin/students/${id}`} className={styles.backLink}><ArrowLeft size={15} /> Back to student</Link><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Learner record</span><h1>Edit Student</h1><p>Update {student.fullName}&apos;s information.</p></div></div><StudentForm student={student} submitLabel="Update Student" /></div>;
}