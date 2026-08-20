import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseForm from "@/components/admin/CourseForm";
import { getCourseById } from "@/components/admin/courseData";
import styles from "@/components/admin/Courses.module.css";

export default async function EditCoursePage({ params }) {
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) return <div className={styles.empty}><h2>Course not found</h2><Link href="/admin/courses" className={styles.primaryButton}>Back to courses</Link></div>;
  return <div><Link href={`/admin/courses/${id}`} className={styles.backLink}><ArrowLeft size={15} /> Back to course</Link><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Programme record</span><h1>Edit Course</h1><p>Update {course.name} information.</p></div></div><CourseForm course={course} submitLabel="Update Course" /></div>;
}