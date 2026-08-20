"use client";

import { Search } from "lucide-react";
import { courseCategories, courseStatuses } from "./courseData";
import styles from "./Courses.module.css";

export default function CourseFilters({ filters, onChange, onClear }) {
  const update = (name, value) => onChange({ ...filters, [name]: value });
  const active = Object.values(filters).some(Boolean);
  return <div className={styles.toolbar}><div className={`${styles.field} ${styles.searchField}`}><Search size={16} className={styles.searchIcon} /><label htmlFor="course-search">Search courses</label><input id="course-search" value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder="Search courses..." /></div><div className={styles.field}><label htmlFor="category-filter">Category</label><select id="category-filter" value={filters.category} onChange={(event) => update("category", event.target.value)}><option value="">All categories</option>{courseCategories.map((option) => <option key={option}>{option}</option>)}</select></div><div className={styles.field}><label htmlFor="course-status-filter">Status</label><select id="course-status-filter" value={filters.status} onChange={(event) => update("status", event.target.value)}><option value="">All statuses</option>{courseStatuses.map((option) => <option key={option}>{option}</option>)}</select></div><div className={styles.field}><label htmlFor="featured-filter">Featured</label><select id="featured-filter" value={filters.featured} onChange={(event) => update("featured", event.target.value)}><option value="">All courses</option><option value="yes">Featured</option><option value="no">Not featured</option></select></div>{active && <button type="button" className={styles.clearButton} onClick={onClear}>Clear filters</button>}</div>;
}