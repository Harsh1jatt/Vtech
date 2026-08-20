"use client";

import { Search } from "lucide-react";
import { certificateStatuses, courseOptions } from "./certificateData";
import styles from "./Certificates.module.css";

export default function CertificateFilters({ filters, onChange, onClear }) {
  const update = (name, value) => onChange({ ...filters, [name]: value });
  const active = Object.values(filters).some(Boolean);
  return <div className={styles.toolbar}><div className={`${styles.field} ${styles.searchField}`}><Search size={16} className={styles.searchIcon} /><label htmlFor="certificate-search">Search certificates</label><input id="certificate-search" value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder="Search number, student, enrollment or course..." /></div><div className={styles.field}><label htmlFor="certificate-status">Status</label><select id="certificate-status" value={filters.status} onChange={(event) => update("status", event.target.value)}><option value="">All statuses</option>{certificateStatuses.map((item) => <option key={item}>{item}</option>)}</select></div><div className={styles.field}><label htmlFor="certificate-course">Course</label><select id="certificate-course" value={filters.course} onChange={(event) => update("course", event.target.value)}><option value="">All courses</option>{courseOptions.map((item) => <option key={item}>{item}</option>)}</select></div>{active && <button type="button" className={styles.clearButton} onClick={onClear}>Clear filters</button>}</div>;
}
