"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileQuestion,
  MinusCircle,
  UserRound,
  XCircle,
} from "lucide-react";

import styles from "./AttemptDetails.module.css";

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) return data.message;

  switch (status) {
    case 401:
      return "Authentication required.";
    case 404:
      return "This attempt was not found.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

function formatTime(seconds) {
  if (!seconds) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(
    2,
    "0"
  )}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusMeta = {
  correct: { label: "CORRECT", className: "correctStatus", Icon: CheckCircle2 },
  wrong: { label: "WRONG", className: "wrongStatus", Icon: XCircle },
  unanswered: { label: "SKIPPED", className: "skippedStatus", Icon: MinusCircle },
};

export default function AttemptDetailsPage({ params }) {
  const { id, attemptId } = use(params);
  const router = useRouter();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAttempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, attemptId]);

  async function loadAttempt() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/exams/${id}/results/${attemptId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

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
          getApiErrorMessage(response.status, data, "Unable to load attempt.")
        );
        return;
      }

      setAttempt(data.attempt);
    } catch (requestError) {
      console.error(requestError);
      setError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading attempt details...</div>;
  }

  if (error || !attempt) {
    return <div className={styles.loading}>{error || "Attempt not found."}</div>;
  }

  const totalQuestions =
    (attempt.correctCount || 0) +
    (attempt.wrongCount || 0) +
    (attempt.unansweredCount || 0);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href={`/admin/exams/${id}/results`} className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Results
        </Link>

        <span
          className={`${styles.resultBadge} ${
            attempt.passed ? styles.pass : styles.fail
          }`}
        >
          {attempt.passed ? "PASS" : "FAIL"}
        </span>
      </div>

      <section className={styles.studentCard}>
        <div className={styles.studentAvatar}>
          <UserRound size={25} />
        </div>

        <div className={styles.studentInfo}>
          <div className={styles.eyebrow}>Student Examination Attempt</div>

          <h1>{attempt.student?.fullName || "—"}</h1>

          <div className={styles.studentMeta}>
            <span>
              Roll No: <strong>{attempt.student?.rollNumber || "—"}</strong>
            </span>

            <span>
              Exam: <strong>{attempt.exam?.title || "—"}</strong>
            </span>

            {attempt.autoSubmitted && (
              <span>
                <strong>Auto-submitted (time expired)</strong>
              </span>
            )}
          </div>
        </div>
      </section>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FileQuestion size={19} />
          <span>Total</span>
          <strong>{totalQuestions}</strong>
        </div>

        <div className={styles.statCard}>
          <CheckCircle2 size={19} />
          <span>Correct</span>
          <strong>{attempt.correctCount}</strong>
        </div>

        <div className={styles.statCard}>
          <XCircle size={19} />
          <span>Wrong</span>
          <strong>{attempt.wrongCount}</strong>
        </div>

        <div className={styles.statCard}>
          <MinusCircle size={19} />
          <span>Skipped</span>
          <strong>{attempt.unansweredCount}</strong>
        </div>

        <div className={styles.statCard}>
          <CheckCircle2 size={19} />
          <span>Percentage</span>
          <strong>{attempt.percentage}%</strong>
        </div>

        <div className={styles.statCard}>
          <Clock3 size={19} />
          <span>Time Taken</span>
          <strong>{formatTime(attempt.timeTakenSeconds)}</strong>
        </div>
      </div>

      <section className={styles.detailsCard}>
        <div className={styles.detailsHeader}>
          <div>
            <h2>Attempt Information</h2>
            <p>Timing and examination submission details.</p>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div>
            <span>Started At</span>
            <strong>{formatDate(attempt.startedAt)}</strong>
          </div>

          <div>
            <span>Submitted At</span>
            <strong>{formatDate(attempt.submittedAt)}</strong>
          </div>

          <div>
            <span>Passing Percentage</span>
            <strong>{attempt.exam?.passingPercentage}%</strong>
          </div>

          <div>
            <span>Score</span>
            <strong>
              {attempt.score} / {totalQuestions}
            </strong>
          </div>
        </div>
      </section>

      <section className={styles.questionsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Question Analysis</h2>
            <p>Student answers compared with the original correct answers.</p>
          </div>
        </div>

        <div className={styles.questions}>
          {(attempt.answers || []).map((item, index) => {
            const meta = statusMeta[item.status] || statusMeta.unanswered;
            const StatusIcon = meta.Icon;

            return (
              <article key={item.questionId} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <span className={styles.questionNumber}>
                    Q{index + 1}
                  </span>

                  <span
                    className={`${styles.status} ${styles[meta.className]}`}
                  >
                    <StatusIcon size={14} />
                    {meta.label}
                  </span>
                </div>

                <h3>{item.question}</h3>

                <div className={styles.options}>
                  {(item.options || []).map((option, optionIndex) => {
                    const isStudentAnswer = item.selectedAnswer === option;
                    const isCorrectAnswer = item.correctAnswer === option;

                    let optionClass = styles.option;

                    if (isCorrectAnswer) {
                      optionClass += ` ${styles.correctOption}`;
                    } else if (isStudentAnswer && !isCorrectAnswer) {
                      optionClass += ` ${styles.wrongOption}`;
                    }

                    return (
                      <div key={optionIndex} className={optionClass}>
                        <span className={styles.optionLetter}>
                          {String.fromCharCode(65 + optionIndex)}
                        </span>

                        <span className={styles.optionText}>{option}</span>

                        <div className={styles.answerLabels}>
                          {isStudentAnswer && (
                            <span className={styles.studentLabel}>
                              Student Answer
                            </span>
                          )}

                          {isCorrectAnswer && (
                            <span className={styles.correctLabel}>
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {item.status === "unanswered" && (
                  <div className={styles.skippedNotice}>
                    <MinusCircle size={15} />
                    Student did not answer this question.
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}