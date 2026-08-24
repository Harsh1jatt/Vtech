"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  GraduationCap,
  Send,
} from "lucide-react";
import styles from "./Exam.module.css";

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) {
    return data.message;
  }

  switch (status) {
    case 400:
      return "The request was invalid.";
    case 401:
      return "Authentication required.";
    case 404:
      return "This examination was not found.";
    case 409:
      return "This examination is not available to attempt right now.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();

  const examId = params.examId;

  const [examTitle, setExamTitle] = useState("");
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const startExam = async () => {
      if (!examId) return;

      setPageLoading(true);
      setLoadError("");

      try {
        const response = await fetch(`/api/exams/${examId}/start`, {
          method: "POST",
          credentials: "include",
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
          setLoadError(
            getApiErrorMessage(
              response.status,
              data,
              "Unable to start this examination."
            )
          );
          return;
        }

        setExamTitle(data.exam?.title || "Examination");
        setAttemptId(data.attemptId);
        setQuestions(
          (data.questions || []).map((q) => ({
            id: q._id,
            question: q.question,
            options: q.options,
          }))
        );
        setTimeLeft(
          Number.isFinite(data.remainingSeconds)
            ? data.remainingSeconds
            : 0
        );
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Start exam request failed:", error);

        setLoadError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setPageLoading(false);
        }
      }
    };

    startExam();

    return () => {
      controller.abort();
    };
  }, [examId, router]);

  const question = questions[currentQuestion];

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return ((currentQuestion + 1) / questions.length) * 100;
  }, [currentQuestion, questions.length]);

  useEffect(() => {
    if (pageLoading || loadError || !attemptId) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, pageLoading, loadError, attemptId]);

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleAnswer = (optionText) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionText,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const handleSubmit = async (autoSubmitted = false) => {
    if (submitting) return;

    if (answeredCount === 0 && !autoSubmitted) {
      alert("Please answer at least one question before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/exams/${examId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          attemptId,
          answers: Object.entries(answers).map(
            ([questionId, selectedAnswer]) => ({
              questionId,
              selectedAnswer,
            })
          ),
        }),
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
        throw new Error(
          getApiErrorMessage(
            response.status,
            data,
            "Unable to submit examination."
          )
        );
      }

      router.replace(
        `/exam/${examId}/result?attemptId=${data.attemptId}`
      );
    } catch (error) {
      console.error("Exam submission error:", error);

      alert(
        error?.message ||
          "Something went wrong while submitting the examination."
      );

      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.topInfo}>
            <div>
              <span className={styles.examLabel}>ONLINE EXAMINATION</span>
              <h1>Preparing your examination...</h1>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loadError || !question) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.topInfo}>
            <div>
              <span className={styles.examLabel}>ONLINE EXAMINATION</span>
              <h1>Unable to load examination</h1>
              <p>{loadError || "No questions were found for this exam."}</p>
            </div>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
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
              <GraduationCap size={21} />
            </div>

            <div>
              <strong>VTECH</strong>
              <span>{examTitle}</span>
            </div>
          </div>

          <div
            className={`${styles.timer} ${
              timeLeft <= 60 ? styles.timerDanger : ""
            }`}
          >
            <Clock3 size={17} />
            <div>
              <span>TIME REMAINING</span>
              <strong>{formatTime(timeLeft)}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.topInfo}>
          <div>
            <span className={styles.examLabel}>ONLINE EXAMINATION</span>
            <h1>{examTitle}</h1>
          </div>

          <div className={styles.progressText}>
            Question <strong>{currentQuestion + 1}</strong> of{" "}
            <strong>{questions.length}</strong>
          </div>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={styles.layout}>
          <section className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <span>Question {currentQuestion + 1}</span>

              {answers[question.id] !== undefined && (
                <span className={styles.answered}>Answered</span>
              )}
            </div>

            <h2>{question.question}</h2>

            <div className={styles.options}>
              {question.options.map((option, index) => {
                const selected = answers[question.id] === option;

                return (
                  <label
                    key={`${question.id}-${index}`}
                    className={`${styles.option} ${
                      selected ? styles.optionSelected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={selected}
                      onChange={() => handleAnswer(option)}
                    />

                    <span className={styles.optionLetter}>
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className={styles.optionText}>{option}</span>
                  </label>
                );
              })}
            </div>

            <div className={styles.navigation}>
              <button
                className={styles.secondaryButton}
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  className={styles.submitButton}
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Exam
                  <Send size={16} />
                </button>
              ) : (
                <button
                  className={styles.primaryButton}
                  onClick={handleNext}
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              )}
            </div>
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.questionMap}>
              <div className={styles.sidebarHeading}>
                <div>
                  <h3>Questions</h3>
                  <p>
                    {answeredCount} of {questions.length} answered
                  </p>
                </div>

                <Flag size={17} />
              </div>

              <div className={styles.questionGrid}>
                {questions.map((item, index) => {
                  const answered = answers[item.id] !== undefined;
                  const active = index === currentQuestion;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`${styles.questionNumber} ${
                        active ? styles.questionActive : ""
                      } ${answered ? styles.questionAnswered : ""}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className={styles.legend}>
                <span>
                  <i className={styles.dotCurrent} />
                  Current
                </span>

                <span>
                  <i className={styles.dotAnswered} />
                  Answered
                </span>

                <span>
                  <i className={styles.dotPending} />
                  Unanswered
                </span>
              </div>
            </div>

            <div className={styles.infoBox}>
              <AlertTriangle size={17} />

              <p>
                Your exam will be automatically submitted when the timer
                reaches zero.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {showSubmitModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <Send size={20} />
            </div>

            <h2>Submit Examination?</h2>

            <p>
              You have answered{" "}
              <strong>{answeredCount}</strong> of{" "}
              <strong>{questions.length}</strong> questions.
            </p>

            <div className={styles.modalStats}>
              <div>
                <span>Answered</span>
                <strong>{answeredCount}</strong>
              </div>

              <div>
                <span>Unanswered</span>
                <strong>{unansweredCount}</strong>
              </div>
            </div>

            <p className={styles.modalWarning}>
              Once submitted, you will not be able to change your answers.
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                className={styles.confirmButton}
                onClick={() => handleSubmit(false)}
                disabled={submitting || answeredCount === 0}
              >
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}