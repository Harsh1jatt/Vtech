"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LogOut,
  Trophy,
} from "lucide-react";
import styles from "./Dashboard.module.css";

const formatDuration = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "--";
  }

  if (minutes < 60) {
    return `${minutes} Minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) {
    return data.message;
  }

  switch (status) {
    case 400:
      return "The request was invalid.";
    case 401:
      return "Authentication required.";
    case 403:
      return "You are not authorized to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "This request conflicts with the current examination status.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

export default function ExamDashboardPage() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);

  const [authLoading, setAuthLoading] = useState(true);
  const [examsLoading, setExamsLoading] = useState(false);

  const [authError, setAuthError] = useState("");
  const [examsError, setExamsError] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      setAuthLoading(true);
      setAuthError("");
      setExamsError("");

      try {
        const authResponse = await fetch("/api/exam/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        let authData = null;

        try {
          authData = await authResponse.json();
        } catch {
          authData = null;
        }

        if (authResponse.status === 401) {
          router.replace("/exam/login");
          return;
        }

        if (!authResponse.ok) {
          setAuthError(
            getApiErrorMessage(
              authResponse.status,
              authData,
              "Unable to verify your student session."
            )
          );
          return;
        }

        if (!authData?.success || !authData?.student) {
          setAuthError(
            "Unable to verify your student account. Please login again."
          );
          return;
        }

        setStudent(authData.student);
        setAuthLoading(false);

        setExamsLoading(true);

        const examsResponse = await fetch("/api/exams/available", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        let examsData = null;

        try {
          examsData = await examsResponse.json();
        } catch {
          examsData = null;
        }

        if (examsResponse.status === 401) {
          router.replace("/exam/login");
          return;
        }

        if (!examsResponse.ok) {
          setExamsError(
            getApiErrorMessage(
              examsResponse.status,
              examsData,
              "Unable to load available examinations."
            )
          );
          return;
        }

        if (!examsData?.success || !Array.isArray(examsData?.exams)) {
          setExamsError(
            "The server returned an invalid examination response."
          );
          return;
        }

        setExams(examsData.exams);
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Student dashboard request failed:", error);

        setAuthError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setAuthLoading(false);
          setExamsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      controller.abort();
    };
  }, [router]);

  const handleStartExam = (examId) => {
    if (!examId) {
      return;
    }

    router.push(
      `/exam/rules?examId=${encodeURIComponent(String(examId))}`
    );
  };

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    setAuthError("");

    try {
      const response = await fetch("/api/exam/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 401) {
        router.replace("/exam/login");
        return;
      }

      if (!response.ok) {
        setAuthError(
          getApiErrorMessage(
            response.status,
            data,
            "Unable to logout. Please try again."
          )
        );
        return;
      }

      router.replace("/exam/login");
    } catch (error) {
      console.error("Student logout failed:", error);

      setAuthError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  if (authLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={styles.welcome}>
            <div>
              <span className={styles.eyebrow}>
                STUDENT PORTAL
              </span>

              <h1>Checking your session...</h1>

              <p>
                Please wait while we verify your student account.
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (authError && !student) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={styles.welcome}>
            <div>
              <span className={styles.eyebrow}>
                STUDENT PORTAL
              </span>

              <h1>Unable to load portal</h1>

              <p>{authError}</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const availableExamCount = exams.length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <GraduationCap size={23} />
            </div>

            <div>
              <strong>VTECH</strong>
              <span>Online Examination</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={16} />

            <span>
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <section className={styles.welcome}>
          <div>
            <span className={styles.eyebrow}>
              STUDENT PORTAL
            </span>

            <h1>
              Welcome back,{" "}
              {student?.fullName || "Student"}
            </h1>

            <p>
              Choose an available examination below to begin your assessment.
            </p>
          </div>

          <div className={styles.studentBadge}>
            <span>Roll Number</span>

            <strong>
              {student?.rollNumber || "--"}
            </strong>
          </div>
        </section>

        {authError && student && (
          <div role="alert" className={styles.error}>
            {authError}
          </div>
        )}

        {examsError && (
          <div role="alert" className={styles.error}>
            {examsError}
          </div>
        )}

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOpen size={19} />
            </div>

            <div>
              <span>Available Exams</span>

              <strong>
                {examsLoading ? "..." : availableExamCount}
              </strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle2 size={19} />
            </div>

            <div>
              <span>Completed</span>
              <strong>--</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Trophy size={19} />
            </div>

            <div>
              <span>Latest Score</span>
              <strong>--</strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>Available Examinations</h2>

              <p>
                Examinations currently available for you.
              </p>
            </div>
          </div>

          {examsLoading ? (
            <div>
              Loading available examinations...
            </div>
          ) : examsError ? (
            <div>
              Unable to load examinations.
            </div>
          ) : exams.length === 0 ? (
            <div>
              No examinations are currently available.
            </div>
          ) : (
            <div className={styles.examGrid}>
              {exams.map((exam) => (
                <article
                  key={String(exam._id)}
                  className={styles.examCard}
                >
                  <div className={styles.examTop}>
                    <div className={styles.examIcon}>
                      <BookOpen size={21} />
                    </div>

                    <span className={styles.available}>
                      Available
                    </span>
                  </div>

                  <h3>{exam.title}</h3>

                  <p className={styles.subject}>
                    {exam.description || "Online Examination"}
                  </p>

                  <div className={styles.examMeta}>
                    <span>
                      <BookOpen size={15} />
                      {exam.questionCount} Questions
                    </span>

                    <span>
                      <Clock3 size={15} />
                      {formatDuration(exam.durationMinutes)}
                    </span>
                  </div>

                  <div className={styles.examBottom}>
                    <span>
                      Pass:{" "}
                      <strong>
                        {exam.passingPercentage}%
                      </strong>
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleStartExam(exam._id)
                      }
                    >
                      Start Exam
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>Previous Results</h2>

              <p>
                Your recently completed examinations.
              </p>
            </div>
          </div>

          <div className={styles.resultsCard}>
            <div className={styles.resultRow}>
              <div className={styles.resultTitle}>
                <div className={styles.resultIcon}>
                  <Trophy size={18} />
                </div>

                <div>
                  <strong>
                    No previous results available
                  </strong>

                  <span>
                    Completed examination results will appear here.
                  </span>
                </div>
              </div>

              <div className={styles.resultScore}>
                <strong>--</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}