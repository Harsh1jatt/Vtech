import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseForm from "@/components/admin/CourseForm";
import styles from "@/components/admin/Courses.module.css";

export default function NewCoursePage() {
  return <div><Link href="/admin/courses" className={styles.backLink}><ArrowLeft size={15} /> Back to courses</Link><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Programme catalogue</span><h1>Add Course</h1><p>Create a new course record.</p></div></div><CourseForm /></div>;
}