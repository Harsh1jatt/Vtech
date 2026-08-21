"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DeleteStudentModal from "@/components/admin/DeleteStudentModal";
import StudentFilters from "@/components/admin/StudentFilters";
import StudentTable from "@/components/admin/StudentTable";
import styles from "@/components/admin/Students.module.css";

const initialFilters = { search: "", course: "", status: "", admissionMonth: "" };
const pageSize = 10;

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    Object.entries(filters).forEach(([key, value]) => { if (value) query.set(key === "admissionMonth" ? "admissionDate" : key, value); });
    try {
      const response = await fetch(`/api/admin/students?${query}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load students.");
      setStudents(result.students || []);
      setPagination(result.pagination || { page, limit: pageSize, total: 0, totalPages: 0 });
    } catch (loadError) { setError(loadError.message); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { queueMicrotask(loadStudents); }, [loadStudents]);
  useEffect(() => { queueMicrotask(() => fetch("/api/admin/courses?limit=100").then((response) => response.json()).then((result) => setCourses(result.courses || []))); }, []);

  const updateFilters = (nextFilters) => { setFilters(nextFilters); setPage(1); };
  const clearFilters = () => updateFilters(initialFilters);
  const confirmDelete = async () => { const response = await fetch(`/api/admin/students/${studentToDelete._id}`, { method: "DELETE" }); const result = await response.json(); setStudentToDelete(null); if (!response.ok) { setError(result.message || "Unable to delete student."); return; } loadStudents(); };

  return <div>
    <div className={styles.pageHeader}><div><span className={styles.eyebrow}>Learner records</span><h1>Students</h1><p>Manage student records, admissions and academic information.</p></div><Link href="/admin/students/new" className={styles.primaryButton}><Plus size={17} /> Add Student</Link></div>
    <StudentFilters filters={filters} courses={courses} onChange={updateFilters} onClear={clearFilters} />
    <section className={styles.panel}>{error && <p className={styles.error} role="alert">{error}</p>}{loading ? <div className={styles.empty}><h2>Loading students...</h2></div> : <StudentTable students={students} onDelete={setStudentToDelete} />}{pagination.total > 0 && <div className={styles.pagination}><p>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, pagination.total)} of {pagination.total} students</p><div className={styles.pageButtons}><button type="button" className={styles.pageButton} onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Previous</button>{Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((number) => <button type="button" key={number} className={`${styles.pageButton} ${number === page ? styles.activePage : ""}`} onClick={() => setPage(number)} aria-label={`Go to page ${number}`}>{number}</button>)}<button type="button" className={styles.pageButton} onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))} disabled={page === pagination.totalPages}>Next</button></div></div>}</section>
    <DeleteStudentModal student={studentToDelete} onCancel={() => setStudentToDelete(null)} onConfirm={confirmDelete} />
  </div>;
}
