"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import CourseFilters from "@/components/admin/CourseFilters";
import CourseTable from "@/components/admin/CourseTable";
import DeleteCourseModal from "@/components/admin/DeleteCourseModal";
import { demoCourses } from "@/components/admin/courseData";
import styles from "@/components/admin/Courses.module.css";

const initialFilters = { search: "", category: "", status: "", featured: "" };
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(demoCourses);
  const [filters, setFilters] = useState(initialFilters);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const filtered = useMemo(() => courses.filter((course) => { const query = filters.search.trim().toLowerCase(); const matchesSearch = !query || [course.name, course.shortCode, course.category].some((value) => value.toLowerCase().includes(query)); return matchesSearch && (!filters.category || course.category === filters.category) && (!filters.status || course.status === filters.status) && (!filters.featured || (filters.featured === "yes" ? course.featured : !course.featured)); }), [courses, filters]);
  const updateFilters = (next) => setFilters(next);
  const confirmDelete = () => { setCourses((current) => current.filter((course) => course.id !== courseToDelete.id)); setCourseToDelete(null); };
  return <div><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Programme catalogue</span><h1>Courses</h1><p>Manage courses offered by VTech Institute of Information Technology.</p></div><Link href="/admin/courses/new" className={styles.primaryButton}><Plus size={17} /> Add Course</Link></div><CourseFilters filters={filters} onChange={updateFilters} onClear={() => setFilters(initialFilters)} /><section className={styles.panel}><CourseTable courses={filtered} onDelete={setCourseToDelete} />{filtered.length > 0 && <div className={styles.pagination}><p>Showing 1-{filtered.length} of {filtered.length} courses</p></div>}</section><DeleteCourseModal course={courseToDelete} onCancel={() => setCourseToDelete(null)} onConfirm={confirmDelete} /></div>;
}