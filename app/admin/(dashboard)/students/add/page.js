import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentForm from "@/components/admin/StudentForm";
import styles from "@/components/admin/Students.module.css";

export default function AddStudentPage() {
  return <div><Link href="/admin/students" className={styles.backLink}><ArrowLeft size={15} /> Back to students</Link><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Learner records</span><h1>Add Student</h1><p>Create a new student record.</p></div></div><StudentForm /></div>;
}
