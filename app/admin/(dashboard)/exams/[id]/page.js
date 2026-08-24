"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Edit3,
  FileQuestion,
  Plus,
  Settings2,
  CheckCircle2,
  BarChart3,
  Repeat,
} from "lucide-react";

import styles from "./ExamDetails.module.css";

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

export default function ExamDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadExam() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/exams/${id}`, {
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
            "Unable to load this examination."
          )
        );
        return;
      }

      setExam(data.exam);
      setQuestionCount((data.questions || []).length);
    } catch (requestError) {
      console.error("Failed to load exam:", requestError);
      setError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading examination...</div>;
  }

  if (error || !exam) {
    return (
      <div className={styles.loading}>
        {error || "Examination not found."}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/admin/exams" className={styles.backLink}>
          <ArrowLeft size={16} />
          All Exams
        </Link>

        <div className={styles.actions}>
          <Link
            href={`/admin/exams/${id}/edit`}
            className={styles.secondaryButton}
          >
            <Edit3 size={16} />
            Edit Exam
          </Link>

          <Link
            href={`/admin/exams/${id}/questions/new`}
            className={styles.primaryButton}
          >
            <Plus size={17} />
            Add Question
          </Link>
        </div>
      </div>

      <section className={styles.hero}>
        <div>
          <div className={styles.eyebrow}>
            <Settings2 size={15} />
            Examination
          </div>

          <h1>{exam.title}</h1>

          {exam.description && <p>{exam.description}</p>}

          <div className={styles.meta}>
            <span
              className={`${styles.status} ${
                exam.isActive ? styles.published : styles.draft
              }`}
            >
              {exam.isActive ? "Published" : "Draft"}
            </span>
          </div>
        </div>
      </section>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FileQuestion size={20} />
          <span>Total Questions</span>
          <strong>{questionCount}</strong>
        </div>

        <div className={styles.statCard}>
          <Clock3 size={20} />
          <span>Duration</span>
          <strong>{exam.durationMinutes} min</strong>
        </div>

        <div className={styles.statCard}>
          <CheckCircle2 size={20} />
          <span>Passing</span>
          <strong>{exam.passingPercentage}%</strong>
        </div>

        <div className={styles.statCard}>
          <Repeat size={20} />
          <span>Multiple Attempts</span>
          <strong>{exam.allowMultipleAttempts ? "Yes" : "No"}</strong>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Exam Configuration</h2>
              <p>Rules currently applied to this examination.</p>
            </div>
          </div>

          <div className={styles.settingsList}>
            <div>
              <span>Duration</span>
              <strong>{exam.durationMinutes} minutes</strong>
            </div>

            <div>
              <span>Passing Percentage</span>
              <strong>{exam.passingPercentage}%</strong>
            </div>

            <div>
              <span>Multiple Attempts</span>
              <strong>{exam.allowMultipleAttempts ? "Allowed" : "Not Allowed"}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{exam.isActive ? "Published" : "Draft"}</strong>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Quick Actions</h2>
              <p>Manage this examination.</p>
            </div>
          </div>

          <div className={styles.quickActions}>
            <Link href={`/admin/exams/${id}/questions`}>
              <FileQuestion size={18} />
              <span>
                <strong>Manage Questions</strong>
                <small>Add, edit or delete MCQs</small>
              </span>
            </Link>

            <Link href={`/admin/exams/${id}/results`}>
              <BarChart3 size={18} />
              <span>
                <strong>View Results</strong>
                <small>See student examination attempts</small>
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}