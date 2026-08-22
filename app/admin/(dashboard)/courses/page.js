"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CourseFilters from "@/components/admin/CourseFilters";
import CourseTable from "@/components/admin/CourseTable";
import DeleteCourseModal from "@/components/admin/DeleteCourseModal";
import styles from "@/components/admin/Courses.module.css";

const initialFilters = { search: "", category: "", status: "", featured: "" };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadCourses = useCallback(async () => { setLoading(true); setError(""); const query = new URLSearchParams(); Object.entries(filters).forEach(([key, value]) => { if (value) query.set(key, key === "featured" ? value === "yes" ? "true" : "false" : value); }); try { const response = await fetch(`/api/admin/courses?${query}`); const result = await response.json(); if (!response.ok) throw new Error(result.message || "Unable to load courses."); setCourses(result.courses || []); } catch (loadError) { setError(loadError.message); } finally { setLoading(false); } }, [filters]);
  useEffect(() => { queueMicrotask(loadCourses); }, [loadCourses]);
  const confirmDelete = async () => { const response = await fetch(`/api/admin/courses/${courseToDelete._id}`, { method: "DELETE" }); const result = await response.json(); setCourseToDelete(null); if (!response.ok) { setError(result.message || "Unable to delete course."); return; } loadCourses(); };
  return <div><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Programme catalogue</span><h1>Courses</h1><p>Manage courses offered by VTech Institute of Information Technology.</p></div><Link href="/admin/courses/new" className={styles.primaryButton}><Plus size={17} /> Add Course</Link></div><CourseFilters filters={filters} onChange={setFilters} onClear={() => setFilters(initialFilters)} /><section className={styles.panel}>{error && <p className={styles.error} role="alert">{error}</p>}{loading ? <div className={styles.empty}><h2>Loading courses...</h2></div> : <CourseTable courses={courses} onDelete={setCourseToDelete} />}</section><DeleteCourseModal course={courseToDelete} onCancel={() => setCourseToDelete(null)} onConfirm={confirmDelete} /></div>;
}