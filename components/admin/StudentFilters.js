"use client";

import { Search } from "lucide-react";
import { statusOptions } from "./studentData";
import styles from "./Students.module.css";

export default function StudentFilters({ filters, onChange, onClear }) {
  const update = (name, value) => onChange({ ...filters, [name]: value });
  const active = Object.values(filters).some(Boolean);
  return <div className={styles.toolbar}><div className={`${styles.field} ${styles.searchField}`}><Search size={16} className={styles.searchIcon} /><label className="srOnly" htmlFor="student-search">Search students</label><input id="student-search" value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder="Search students..." /></div><div className={styles.field}><label htmlFor="course-filter">Course</label><select id="course-filter" value={filters.course} onChange={(event) => update("course", event.target.value)}><option value="">All courses</option>{courses.map((option) => <option key={option._id} value={option._id}>{option.title}</option>)}</select></div><div className={styles.field}><label htmlFor="status-filter">Status</label><select id="status-filter" value={filters.status} onChange={(event) => update("status", event.target.value)}><option value="">All statuses</option>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></div><div className={styles.field}><label htmlFor="date-filter">Admission date</label><input id="date-filter" type="month" value={filters.admissionMonth} onChange={(event) => update("admissionMonth", event.target.value)} /></div>{active && <button type="button" className={styles.clearButton} onClick={onClear}>Clear filters</button>}</div>;
}