"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Loader2,
  XCircle,
  MinusCircle,
  Home,
} from "lucide-react";

import styles from "./Result.module.css";

function formatTime(seconds) {
  if (!seconds || seconds < 0) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!attemptId) {
      setError("No examination attempt was specified.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchResult = async () => {
      setLoading(true);
      setError("");

      try {
        const [attemptResponse, meResponse] = await Promise.all([
          fetch(`/api/exam-attempts/${attemptId}`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch("/api/exam/auth/me", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        let attemptData = null;

        try {
          attemptData = await attemptResponse.json();
        } catch {
          attemptData = null;
        }

        let meData = null;

        try {
          meData = await meResponse.json();
        } catch {
          meData = null;
        }

        if (attemptResponse.status === 401) {
          window.location.href = "/exam/login";
          return;
        }

        if (!attemptResponse.ok || !attemptData?.success) {
          throw new Error(
            attemptData?.message ||
              "Unable to load your examination result."
          );
        }

        const attempt = attemptData.attempt;

        const totalQuestions =
          (attempt.correctCount || 0) +
          (attempt.wrongCount || 0) +
          (attempt.unansweredCount || 0);

        const attempted =
          (attempt.correctCount || 0) + (attempt.wrongCount || 0);

        if (!cancelledResult(controller)) {
          setResult({
            examTitle: attempt.exam?.title || "Examination",
            student: {
              name: meData?.student?.fullName || "—",
              rollNumber: meData?.student?.rollNumber || "—",
              course: meData?.student?.course?.title || "—",
            },
            totalQuestions,
            attempted,
            correct: attempt.correctCount || 0,
            wrong: attempt.wrongCount || 0,
            unanswered: attempt.unansweredCount || 0,
            score: attempt.score || 0,
            percentage: attempt.percentage || 0,
            passingPercentage: attempt.exam?.passingPercentage || 0,
            result: attempt.passed ? "PASS" : "FAIL",
            timeTaken: attempt.timeTakenSeconds || 0,
            submittedAt: attempt.submittedAt,
          });
        }
      } catch (err) {
        if (err?.name === "AbortError") {
          return;
        }

        setError(
          err?.message ||
            "Something went wrong while loading your examination result."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    function cancelledResult(ctrl) {
      return ctrl.signal.aborted;
    }

    fetchResult();

    return () => {
      controller.abort();
    };
  }, [attemptId]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingCard}>
            <div className={styles.loadingIcon}>
              <Loader2 size={28} />
            </div>

            <h1>Loading Result</h1>

            <p>Please wait while we retrieve your examination result.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className={styles.page}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>
              <XCircle size={30} />
            </div>

            <h1>Result Not Available</h1>

            <p>
              {error || "We could not find the result for this examination."}
            </p>

            <Link href="/exam/dashboard" className={styles.primaryButton}>
              <Home size={18} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isPassed = result.result === "PASS";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/exam/dashboard" className={styles.logoLink}>
            <Image
              src="/images/logo.png"
              alt="VTech Institute"
              width={150}
              height={55}
              className={styles.logo}
              priority
            />
          </Link>

          <Link href="/exam/dashboard" className={styles.backButton}>
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </header>

        <section className={styles.resultHero}>
          <div
            className={`${styles.resultIcon} ${
              isPassed ? styles.resultIconSuccess : styles.resultIconFail
            }`}
          >
            {isPassed ? (
              <Award size={38} strokeWidth={2} />
            ) : (
              <XCircle size={38} strokeWidth={2} />
            )}
          </div>

          <span
            className={`${styles.resultBadge} ${
              isPassed ? styles.passBadge : styles.failBadge
            }`}
          >
            {isPassed ? "EXAM PASSED" : "EXAM NOT PASSED"}
          </span>

          <h1>Examination Result</h1>

          <p className={styles.examTitle}>{result.examTitle}</p>

          <div className={styles.score}>
            {Number(result.percentage) || 0}
            <span>%</span>
          </div>

          <p className={styles.scoreLabel}>Your Final Score</p>

          <div className={styles.passInfo}>
            Passing Percentage: <strong>{result.passingPercentage}%</strong>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FileCheck2 size={19} />
            </div>

            <div>
              <h2>Student Information</h2>
              <p>Your examination details</p>
            </div>
          </div>

          <div className={styles.studentGrid}>
            <div className={styles.infoItem}>
              <span>Student Name</span>
              <strong>{result.student?.name || "—"}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Roll Number</span>
              <strong>{result.student?.rollNumber || "—"}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Course</span>
              <strong>{result.student?.course || "—"}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Submitted On</span>
              <strong>{formatDate(result.submittedAt)}</strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Award size={19} />
            </div>

            <div>
              <h2>Performance Summary</h2>
              <p>Your examination performance</p>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.totalCard}`}>
              <div className={styles.statIcon}>
                <FileCheck2 size={20} />
              </div>

              <div>
                <span>Total Questions</span>
                <strong>{result.totalQuestions}</strong>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.correctCard}`}>
              <div className={styles.statIcon}>
                <CheckCircle2 size={20} />
              </div>

              <div>
                <span>Correct Answers</span>
                <strong>{result.correct}</strong>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.wrongCard}`}>
              <div className={styles.statIcon}>
                <XCircle size={20} />
              </div>

              <div>
                <span>Wrong Answers</span>
                <strong>{result.wrong}</strong>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.unansweredCard}`}>
              <div className={styles.statIcon}>
                <MinusCircle size={20} />
              </div>

              <div>
                <span>Unanswered</span>
                <strong>{result.unanswered}</strong>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.attemptedCard}`}>
              <div className={styles.statIcon}>
                <CheckCircle2 size={20} />
              </div>

              <div>
                <span>Attempted</span>
                <strong>{result.attempted}</strong>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.timeCard}`}>
              <div className={styles.statIcon}>
                <Clock3 size={20} />
              </div>

              <div>
                <span>Time Taken</span>
                <strong>{formatTime(result.timeTaken)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.messageCard} ${
            isPassed ? styles.successMessage : styles.failMessage
          }`}
        >
          {isPassed ? <CheckCircle2 size={25} /> : <XCircle size={25} />}

          <div>
            <h3>
              {isPassed
                ? "Congratulations! You have passed the examination."
                : "You did not achieve the required passing percentage."}
            </h3>

            <p>
              {isPassed
                ? `You scored ${result.percentage}% against the required ${result.passingPercentage}%.`
                : `You scored ${result.percentage}%. You needed at least ${result.passingPercentage}% to pass.`}
            </p>
          </div>
        </section>

        <div className={styles.actions}>
          <Link href="/exam/dashboard" className={styles.secondaryButton}>
            <Home size={18} />
            Back to Dashboard
          </Link>
        </div>

        <footer className={styles.footer}>
          <Image
            src="/images/logo.png"
            alt="VTech Institute"
            width={110}
            height={40}
            className={styles.footerLogo}
          />

          <p>VTech Institute of Information Technology</p>
        </footer>
      </div>
    </main>
  );
}