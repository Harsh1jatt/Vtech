"use client";

import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DeleteStudentModal from "@/components/admin/DeleteStudentModal";
import StudentFilters from "@/components/admin/StudentFilters";
import StudentTable from "@/components/admin/StudentTable";
import styles from "@/components/admin/Students.module.css";

const initialFilters = {
  search: "",
  course: "",
  status: "",
  admissionMonth: "",
};

const pageSize = 10;

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    const query = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query.set(
          key === "admissionMonth" ? "admissionDate" : key,
          value
        );
      }
    });

    try {
      const response = await fetch(
        `/api/admin/students?${query}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load students."
        );
      }

      setStudents(result.students || []);

      setPagination(
        result.pagination || {
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        }
      );
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    queueMicrotask(loadStudents);
  }, [loadStudents]);

  useEffect(() => {
    queueMicrotask(() => {
      fetch("/api/admin/courses?limit=100")
        .then((response) => response.json())
        .then((result) => {
          setCourses(result.courses || []);
        })
        .catch(() => {
          setCourses([]);
        });
    });
  }, []);

  const updateFilters = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!studentToDelete?._id) return;

    try {
      const response = await fetch(
        `/api/admin/students/${studentToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      setStudentToDelete(null);

      if (!response.ok) {
        setError(
          result.message || "Unable to delete student."
        );
        return;
      }

      loadStudents();
    } catch (deleteError) {
      setStudentToDelete(null);
      setError(
        deleteError.message || "Unable to delete student."
      );
    }
  };

  const showingStart =
    pagination.total > 0
      ? (page - 1) * pageSize + 1
      : 0;

  const showingEnd = Math.min(
    page * pageSize,
    pagination.total
  );

  return (
    <div className={styles.studentsPage}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeading}>
          <span className={styles.eyebrow}>
            Learner records
          </span>

          <div className={styles.titleRow}>
            <div className={styles.titleIcon}>
              <Users size={20} />
            </div>

            <h1>Students</h1>
          </div>

          <p>
            Manage student records, admissions and academic
            information.
          </p>
        </div>

        <Link
          href="/admin/students/new"
          className={styles.primaryButton}
        >
          <Plus size={17} />
          Add Student
        </Link>
      </div>

      <StudentFilters
        filters={filters}
        courses={courses}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>All students</h2>

            <p>
              {pagination.total === 0
                ? "No student records available."
                : `${pagination.total} student${
                    pagination.total === 1 ? "" : "s"
                  } found`}
            </p>
          </div>

          {pagination.total > 0 && (
            <span className={styles.recordCount}>
              {showingStart}-{showingEnd} of{" "}
              {pagination.total}
            </span>
          )}
        </div>

        {error && (
          <div
            className={styles.error}
            role="alert"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
            <h2>Loading students...</h2>
            <p>Fetching the latest learner records.</p>
          </div>
        ) : (
          <StudentTable
            students={students}
            onDelete={setStudentToDelete}
          />
        )}

        {!loading && pagination.total > 0 && (
          <div className={styles.pagination}>
            <p>
              Showing{" "}
              <strong>
                {showingStart}-{showingEnd}
              </strong>{" "}
              of{" "}
              <strong>{pagination.total}</strong>{" "}
              students
            </p>

            <div className={styles.pageButtons}>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                disabled={page === 1}
              >
                Previous
              </button>

              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1
              ).map((number) => (
                <button
                  type="button"
                  key={number}
                  className={`${styles.pageButton} ${
                    number === page
                      ? styles.activePage
                      : ""
                  }`}
                  onClick={() => setPage(number)}
                  aria-label={`Go to page ${number}`}
                  aria-current={
                    number === page
                      ? "page"
                      : undefined
                  }
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                className={styles.pageButton}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      pagination.totalPages,
                      current + 1
                    )
                  )
                }
                disabled={
                  page === pagination.totalPages
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <DeleteStudentModal
        student={studentToDelete}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}