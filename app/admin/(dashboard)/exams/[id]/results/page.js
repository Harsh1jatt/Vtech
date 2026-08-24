"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  Search,
  Users,
  XCircle,
  Eye,
} from "lucide-react";

import styles from "./Results.module.css";

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) return data.message;

  switch (status) {
    case 401:
      return "Authentication required.";
    case 404:
      return "This examination was not found.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

function formatTime(seconds) {
  if (!seconds) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(
    2,
    "0"
  )}`;
}

export default function ResultsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadResults() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/exams/${id}/results`, {
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
          getApiErrorMessage(response.status, data, "Unable to load results.")
        );
        return;
      }

      setResults(data.attempts || []);
    } catch (requestError) {
      console.error(requestError);
      setError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredResults = results.filter((attempt) => {
    const name = attempt.student?.fullName || "";
    const rollNumber = attempt.student?.rollNumber || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      rollNumber.toLowerCase().includes(search.toLowerCase());

    const resultLabel = attempt.passed ? "PASS" : "FAIL";

    const matchesFilter = filter === "All" || resultLabel === filter;

    return matchesSearch && matchesFilter;
  });

  const passed = results.filter((item) => item.passed).length;
  const failed = results.filter((item) => !item.passed).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Link href={`/admin/exams/${id}`} className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Examination
          </Link>

          <div className={styles.eyebrow}>
            <BarChart3 size={16} />
            Examination Results
          </div>

          <h1>Student Results</h1>

          <p>Review all student attempts for this examination.</p>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <Users size={20} />
          <div>
            <span>Total Attempts</span>
            <strong>{results.length}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <CheckCircle2 size={20} />
          <div>
            <span>Passed</span>
            <strong>{passed}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <XCircle size={20} />
          <div>
            <span>Failed</span>
            <strong>{failed}</strong>
          </div>
        </div>
      </div>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={17} />

            <input
              type="search"
              placeholder="Search student or roll number..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className={styles.filter}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All Results</option>
            <option value="PASS">Passed</option>
            <option value="FAIL">Failed</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.empty}>Loading results...</div>
        ) : error ? (
          <div className={styles.empty}>{error}</div>
        ) : filteredResults.length === 0 ? (
          <div className={styles.empty}>
            <BarChart3 size={28} />

            <h3>No results found</h3>

            <p>No student attempts match your current filters.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Attempted</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                  <th>Skipped</th>
                  <th>Score</th>
                  <th>Time</th>
                  <th>Result</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((attempt) => {
                  const attempted =
                    (attempt.correctCount || 0) + (attempt.wrongCount || 0);

                  return (
                    <tr key={attempt.id}>
                      <td>
                        <strong className={styles.studentName}>
                          {attempt.student?.fullName || "—"}
                        </strong>

                        <span className={styles.rollNumber}>
                          {attempt.student?.rollNumber || "—"}
                        </span>
                      </td>

                      <td>{attempted}</td>

                      <td className={styles.correct}>
                        {attempt.correctCount}
                      </td>

                      <td className={styles.wrong}>{attempt.wrongCount}</td>

                      <td className={styles.skipped}>
                        {attempt.unansweredCount}
                      </td>

                      <td>
                        <strong>{attempt.percentage}%</strong>
                      </td>

                      <td>
                        <span className={styles.time}>
                          <Clock3 size={13} />
                          {formatTime(attempt.timeTakenSeconds)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.result} ${
                            attempt.passed ? styles.pass : styles.fail
                          }`}
                        >
                          {attempt.passed ? "PASS" : "FAIL"}
                        </span>
                      </td>

                      <td>
                        <Link
                          href={`/admin/exams/${id}/results/${attempt.id}`}
                          className={styles.viewButton}
                        >
                          <Eye size={15} />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}