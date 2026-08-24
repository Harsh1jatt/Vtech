"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileQuestion,
  GraduationCap,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import styles from "./Rules.module.css";

export default function ExamRulesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const examId = searchParams.get("examId");

  const [accepted, setAccepted] = useState(false);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadExam = async () => {
      if (!examId) {
        setError("No examination was selected.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/exams/available", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
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

        if (!response.ok || !data?.success) {
          setError(
            data?.message || "Unable to load examination details."
          );
          return;
        }

        const matchedExam = (data.exams || []).find(
          (item) => String(item._id) === String(examId)
        );

        if (!matchedExam) {
          setError(
            "This examination is not available or no longer exists."
          );
          return;
        }

        setExam({
          id: matchedExam._id,
          title: matchedExam.title,
          subject: matchedExam.description || "Online Examination",
          questions: matchedExam.questionCount,
          duration: matchedExam.durationMinutes,
          passingPercentage: matchedExam.passingPercentage,
        });
      } catch (requestError) {
        if (requestError?.name === "AbortError") {
          return;
        }

        console.error("Rules page load error:", requestError);

        setError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExam();

    return () => {
      controller.abort();
    };
  }, [examId, router]);

  const handleStart = () => {
    if (!accepted || !exam) return;

    router.push(`/exam/${exam.id}`);
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <div className={styles.logo}>
                <GraduationCap size={22} />
              </div>
              <div>
                <strong>VTECH</strong>
                <span>Online Examination</span>
              </div>
            </div>
            <span className={styles.portalLabel}>EXAM PORTAL</span>
          </div>
        </header>
        <div className={styles.container}>
          <section className={styles.examHeader}>
            <div>
              <span className={styles.eyebrow}>EXAMINATION INSTRUCTIONS</span>
              <h1>Loading examination details...</h1>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (error || !exam) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <div className={styles.logo}>
                <GraduationCap size={22} />
              </div>
              <div>
                <strong>VTECH</strong>
                <span>Online Examination</span>
              </div>
            </div>
            <span className={styles.portalLabel}>EXAM PORTAL</span>
          </div>
        </header>
        <div className={styles.container}>
          <section className={styles.examHeader}>
            <div>
              <span className={styles.eyebrow}>EXAMINATION INSTRUCTIONS</span>
              <h1>Unable to load examination</h1>
              <p>{error || "This examination could not be found."}</p>
            </div>
          </section>
          <button
            type="button"
            className={styles.startButton}
            onClick={() => router.push("/exam/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <GraduationCap size={22} />
            </div>

            <div>
              <strong>VTECH</strong>
              <span>Online Examination</span>
            </div>
          </div>

          <span className={styles.portalLabel}>EXAM PORTAL</span>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.breadcrumb}>Examination / Instructions</div>

        <section className={styles.examHeader}>
          <div>
            <span className={styles.eyebrow}>EXAMINATION INSTRUCTIONS</span>
            <h1>{exam.title}</h1>
            <p>{exam.subject}</p>
          </div>

          <div className={styles.status}>
            <CheckCircle2 size={16} />
            Ready to Start
          </div>
        </section>

        <section className={styles.stats}>
          <div>
            <FileQuestion size={19} />
            <span>Questions</span>
            <strong>{exam.questions}</strong>
          </div>

          <div>
            <Clock3 size={19} />
            <span>Duration</span>
            <strong>{exam.duration} min</strong>
          </div>

          <div>
            <CheckCircle2 size={19} />
            <span>Passing</span>
            <strong>{exam.passingPercentage}%</strong>
          </div>

          <div>
            <BookOpen size={19} />
            <span>Type</span>
            <strong>MCQ</strong>
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.rulesCard}>
            <div className={styles.cardTitle}>
              <div className={styles.titleIcon}>
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2>Before you begin</h2>
                <p>Please read all instructions carefully.</p>
              </div>
            </div>

            <div className={styles.rulesList}>
              <div>
                <span>01</span>
                <p>
                  This examination contains{" "}
                  <strong>{exam.questions} multiple-choice questions.</strong>
                </p>
              </div>

              <div>
                <span>02</span>
                <p>
                  You have{" "}
                  <strong>{exam.duration} minutes</strong> to complete the
                  examination.
                </p>
              </div>

              <div>
                <span>03</span>
                <p>
                  You must answer at least{" "}
                  <strong>one question</strong> before submitting the exam.
                </p>
              </div>

              <div>
                <span>04</span>
                <p>
                  The examination will be automatically submitted when the
                  timer reaches zero.
                </p>
              </div>

              <div>
                <span>05</span>
                <p>
                  Once the examination is submitted,{" "}
                  <strong>you cannot change your answers.</strong>
                </p>
              </div>

              <div>
                <span>06</span>
                <p>
                  A minimum of{" "}
                  <strong>{exam.passingPercentage}%</strong> is required to
                  pass this examination.
                </p>
              </div>
            </div>

            <div className={styles.warning}>
              <AlertCircle size={18} />

              <p>
                Make sure you have a stable internet connection before
                starting the examination.
              </p>
            </div>

            <label className={styles.agreement}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />

              <span>
                I have read and understood all examination instructions.
              </span>
            </label>

            <button
              className={styles.startButton}
              onClick={handleStart}
              disabled={!accepted}
            >
              Start Examination
              <ArrowRight size={18} />
            </button>
          </section>

          <aside className={styles.summaryCard}>
            <span className={styles.summaryLabel}>EXAM SUMMARY</span>

            <h3>{exam.title}</h3>

            <div className={styles.summaryRows}>
              <div>
                <span>Total Questions</span>
                <strong>{exam.questions}</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{exam.duration} minutes</strong>
              </div>

              <div>
                <span>Passing Percentage</span>
                <strong>{exam.passingPercentage}%</strong>
              </div>

              <div>
                <span>Question Type</span>
                <strong>Multiple Choice</strong>
              </div>
            </div>

            <div className={styles.summaryNote}>
              Your result will be calculated automatically after submission.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}