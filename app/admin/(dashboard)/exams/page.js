"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardCheck,
  Clock3,
  FileQuestion,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  Eye,
} from "lucide-react";

import styles from "./Exams.module.css";

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) return data.message;

  switch (status) {
    case 401:
      return "Authentication required.";
    case 403:
      return "You are not authorized to perform this action.";
    case 409:
      return "This request conflicts with the current state.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

export default function ExamsPage() {
  const router = useRouter();

  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadExams();
  }, []);

  async function loadExams() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/exams", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok || !data?.success) {
        setError(
          getApiErrorMessage(
            response.status,
            data,
            "Unable to load examinations."
          )
        );
        return;
      }

      setExams(data.exams || []);
    } catch (requestError) {
      console.error("Failed to load exams:", requestError);
      setError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(examId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this examination?"
    );

    if (!confirmed) return;

    setDeletingId(examId);

    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: "DELETE",
        credentials: "include",
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok || !data?.success) {
        alert(
          getApiErrorMessage(
            response.status,
            data,
            "Unable to delete this examination."
          )
        );
        return;
      }

      setExams((current) => current.filter((exam) => exam._id !== examId));
    } catch (requestError) {
      console.error("Failed to delete exam:", requestError);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = (exam.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Published" && exam.isActive) ||
      (statusFilter === "Draft" && !exam.isActive);

    return matchesSearch && matchesStatus;
  });

  const publishedCount = exams.filter((exam) => exam.isActive).length;
  const draftCount = exams.filter((exam) => !exam.isActive).length;
  const totalQuestions = exams.reduce(
    (total, exam) => total + (exam.questionCount || 0),
    0
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            <ClipboardCheck size={16} />
            Examination Management
          </div>

          <h1>Exams</h1>

          <p>Create, manage and monitor online examinations for students.</p>
        </div>

        <Link href="/admin/exams/new" className={styles.primaryButton}>
          <Plus size={18} />
          Create Exam
        </Link>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ClipboardCheck size={20} />
          </div>

          <div>
            <span>Total Exams</span>
            <strong>{exams.length}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Eye size={20} />
          </div>

          <div>
            <span>Published</span>
            <strong>{publishedCount}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Pencil size={20} />
          </div>

          <div>
            <span>Draft</span>
            <strong>{draftCount}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <FileQuestion size={20} />
          </div>

          <div>
            <span>Total Questions</span>
            <strong>{totalQuestions}</strong>
          </div>
        </div>
      </div>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} />

            <input
              type="search"
              placeholder="Search exams..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className={styles.filter}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.loadingDot} />
            <p>Loading examinations...</p>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ClipboardCheck size={24} />
            </div>
            <h3>Unable to load examinations</h3>
            <p>{error}</p>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <ClipboardCheck size={24} />
            </div>

            <h3>No examinations found</h3>

            <p>Try changing your search or create a new examination.</p>

            <Link href="/admin/exams/new" className={styles.primaryButton}>
              <Plus size={17} />
              Create Exam
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Examination</th>
                  <th>Questions</th>
                  <th>Duration</th>
                  <th>Passing</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredExams.map((exam) => (
                  <tr key={exam._id}>
                    <td>
                      <Link
                        href={`/admin/exams/${exam._id}`}
                        className={styles.examName}
                      >
                        {exam.title}
                      </Link>

                      {exam.description && (
                        <span className={styles.courseName}>
                          {exam.description}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={styles.tableValue}>
                        {exam.questionCount || 0}
                      </span>
                    </td>

                    <td>
                      <span className={styles.metaValue}>
                        <Clock3 size={14} />
                        {exam.durationMinutes} min
                      </span>
                    </td>

                    <td>
                      <span className={styles.passValue}>
                        {exam.passingPercentage}%
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          exam.isActive ? styles.published : styles.draft
                        }`}
                      >
                        {exam.isActive ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className={styles.actionCell}>
                      <button
                        type="button"
                        className={styles.menuButton}
                        onClick={() =>
                          setMenuOpen(menuOpen === exam._id ? null : exam._id)
                        }
                        aria-label="Exam actions"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {menuOpen === exam._id && (
                        <div className={styles.actionMenu}>
                          <Link
                            href={`/admin/exams/${exam._id}`}
                            onClick={() => setMenuOpen(null)}
                          >
                            <Eye size={15} />
                            View
                          </Link>

                          <Link
                            href={`/admin/exams/${exam._id}/edit`}
                            onClick={() => setMenuOpen(null)}
                          >
                            <Pencil size={15} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={deletingId === exam._id}
                            onClick={() => {
                              setMenuOpen(null);
                              handleDelete(exam._id);
                            }}
                          >
                            <Trash2 size={15} />
                            {deletingId === exam._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}