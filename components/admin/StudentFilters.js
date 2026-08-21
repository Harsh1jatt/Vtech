"use client";

import {
  CalendarDays,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import styles from "./Students.module.css";

const statusOptions = ["Active", "Inactive", "Completed"];

export default function StudentFilters({
  filters,
  onChange,
  onClear,
  courses = [],
}) {
  const updateFilter = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.course) ||
    Boolean(filters.status) ||
    Boolean(filters.admissionMonth);

  return (
    <section
      className={styles.filterPanel}
      aria-label="Student filters"
    >
      <div className={styles.filterHeader}>
        <div className={styles.filterHeading}>
          <span className={styles.filterIcon} aria-hidden="true">
            <SlidersHorizontal size={16} />
          </span>

          <div className={styles.filterHeadingText}>
            <h2>Filter students</h2>
            <p>
              Search and narrow down learner records.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
          >
            <RotateCcw size={14} />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <div
          className={`${styles.searchField} ${styles.filterControl}`}
        >
          <label
            className="srOnly"
            htmlFor="student-search"
          >
            Search students
          </label>

          <Search
            size={17}
            className={styles.searchIcon}
            aria-hidden="true"
          />

          <input
            id="student-search"
            type="search"
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            placeholder="Search by name, email or roll number..."
            autoComplete="off"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="course-filter">
            Course
          </label>

          <select
            id="course-filter"
            value={filters.course}
            onChange={(event) =>
              updateFilter("course", event.target.value)
            }
          >
            <option value="">All courses</option>

            {courses.map((course) => (
              <option
                key={course._id}
                value={course._id}
              >
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="status-filter">
            Status
          </label>

          <select
            id="status-filter"
            value={filters.status}
            onChange={(event) =>
              updateFilter("status", event.target.value)
            }
          >
            <option value="">All statuses</option>

            {statusOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="date-filter">
            Admission month
          </label>

          <div className={styles.inputWithIcon}>
            <CalendarDays
              size={15}
              className={styles.inputIcon}
              aria-hidden="true"
            />

            <input
              id="date-filter"
              type="month"
              value={filters.admissionMonth}
              onChange={(event) =>
                updateFilter(
                  "admissionMonth",
                  event.target.value
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}