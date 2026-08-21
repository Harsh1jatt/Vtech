"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import CourseForm from "@/components/admin/CourseForm";
import styles from "@/components/admin/Courses.module.css";

export default function EditCoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.resolve(params).then(({ id }) => fetch(`/api/admin/courses/${id}`).then((response) => response.json()).then((result) => setCourse(result.course)).finally(() => setLoading(false))); }, [params]);
  if (loading) return <div className={styles.empty}><h2>Loading course...</h2></div>;
  if (!course) return <div className={styles.empty}><h2>Course not found</h2><Link href="/admin/courses" className={styles.primaryButton}>Back to courses</Link></div>;
  return <div><Link href={`/admin/courses/${id}`} className={styles.backLink}><ArrowLeft size={15} /> Back to course</Link><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Programme record</span><h1>Edit Course</h1><p>Update {course.name} information.</p></div></div><CourseForm course={course} submitLabel="Update Course" /></div>;
}