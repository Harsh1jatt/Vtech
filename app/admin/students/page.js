"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import DeleteStudentModal from "@/components/admin/DeleteStudentModal";
import StudentFilters from "@/components/admin/StudentFilters";
import StudentTable from "@/components/admin/StudentTable";
import { demoStudents } from "@/components/admin/studentData";
import styles from "@/components/admin/Students.module.css";

const initialFilters = { search: "", course: "", status: "", admissionMonth: "" };
const pageSize = 10;

export default function StudentsPage() {
  const [students, setStudents] = useState(demoStudents);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const filteredStudents = useMemo(() => students.filter((student) => {
    const query = filters.search.trim().toLowerCase();
    const matchesSearch = !query || [student.fullName, student.enrollmentNumber, student.phone, student.email].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (!filters.course || student.course === filters.course) && (!filters.status || student.status === filters.status) && (!filters.admissionMonth || student.admissionDate.startsWith(filters.admissionMonth));
  }), [students, filters]);
  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const visibleStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  const updateFilters = (nextFilters) => { setFilters(nextFilters); setPage(1); };
  const clearFilters = () => updateFilters(initialFilters);
  const confirmDelete = () => { setStudents((current) => current.filter((student) => student.id !== studentToDelete.id)); setStudentToDelete(null); };

  return <div>
    <div className={styles.pageHeader}><div><span className={styles.eyebrow}>Learner records</span><h1>Students</h1><p>Manage student records, admissions and academic information.</p></div><Link href="/admin/students/new" className={styles.primaryButton}><Plus size={17} /> Add Student</Link></div>
    <StudentFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />
    <section className={styles.panel}><StudentTable students={visibleStudents} onDelete={setStudentToDelete} />{filteredStudents.length > 0 && <div className={styles.pagination}><p>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredStudents.length)} of {filteredStudents.length} students</p><div className={styles.pageButtons}><button type="button" className={styles.pageButton} onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Previous</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button type="button" key={number} className={`${styles.pageButton} ${number === page ? styles.activePage : ""}`} onClick={() => setPage(number)} aria-label={`Go to page ${number}`}>{number}</button>)}<button type="button" className={styles.pageButton} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount}>Next</button></div></div>}</section>
    <DeleteStudentModal student={studentToDelete} onCancel={() => setStudentToDelete(null)} onConfirm={confirmDelete} />
  </div>;
}
