"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  FileQuestion,
  Plus,
  Trash2,
} from "lucide-react";

import styles from "./Questions.module.css";

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) return data.message;

  switch (status) {
    case 401:
      return "Authentication required.";
    case 404:
      return "Not found.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

export default function QuestionsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadQuestions() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/exams/${id}/questions`, {
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
            "Unable to load questions."
          )
        );
        return;
      }

      setQuestions(data.questions || []);
    } catch (requestError) {
      console.error(requestError);
      setError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(questionId) {
    const confirmed = window.confirm("Delete this question?");

    if (!confirmed) return;

    setDeletingId(questionId);

    try {
      const response = await fetch(
        `/api/exams/${id}/questions/${questionId}`,
        {
          method: "DELETE",
          credentials: "include",
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
        alert(
          getApiErrorMessage(
            response.status,
            data,
            "Unable to delete question."
          )
        );
        return;
      }

      setQuestions((current) =>
        current.filter((question) => question._id !== questionId)
      );
    } catch (requestError) {
      console.error(requestError);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Link href={`/admin/exams/${id}`} className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Examination
          </Link>

          <div className={styles.eyebrow}>
            <FileQuestion size={16} />
            Question Management
          </div>

          <h1>Questions</h1>

          <p>Manage the MCQs included in this examination.</p>
        </div>

        <Link
          href={`/admin/exams/${id}/questions/new`}
          className={styles.primaryButton}
        >
          <Plus size={17} />
          Add Question
        </Link>
      </div>

      <div className={styles.infoBar}>
        <div>
          <strong>{questions.length}</strong>
          <span>Questions Added</span>
        </div>

        <p>
          Correct answers are visible only to administrators and backend
          services.
        </p>
      </div>

      <section className={styles.list}>
        {loading ? (
          <div className={styles.empty}>Loading questions...</div>
        ) : error ? (
          <div className={styles.empty}>{error}</div>
        ) : questions.length === 0 ? (
          <div className={styles.empty}>
            <FileQuestion size={28} />

            <h3>No questions added</h3>

            <p>Start adding MCQs to this examination.</p>

            <Link
              href={`/admin/exams/${id}/questions/new`}
              className={styles.primaryButton}
            >
              <Plus size={17} />
              Add First Question
            </Link>
          </div>
        ) : (
          questions.map((question, index) => (
            <article key={question._id} className={styles.questionCard}>
              <div className={styles.questionTop}>
                <div className={styles.questionNumber}>Q{index + 1}</div>

                <div className={styles.questionText}>
                  <h2>{question.question}</h2>

                  <div className={styles.options}>
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = option === question.correctAnswer;

                      return (
                        <div
                          key={optionIndex}
                          className={`${styles.option} ${
                            isCorrect ? styles.correctOption : ""
                          }`}
                        >
                          <span className={styles.optionLetter}>
                            {String.fromCharCode(65 + optionIndex)}
                          </span>

                          <span>{option}</span>

                          {isCorrect && (
                            <CheckCircle2
                              size={16}
                              className={styles.correctIcon}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.actions}>
                  <Link
                    href={`/admin/exams/${id}/questions/new?edit=${question._id}`}
                    className={styles.iconButton}
                    aria-label="Edit question"
                  >
                    <Edit3 size={16} />
                  </Link>

                  <button
                    type="button"
                    className={`${styles.iconButton} ${styles.deleteButton}`}
                    disabled={deletingId === question._id}
                    onClick={() => handleDelete(question._id)}
                    aria-label="Delete question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}