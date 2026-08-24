"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileQuestion,
  Save,
} from "lucide-react";

import styles from "../QuestionForm.module.css";

const emptyForm = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
};

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) return data.message;

  switch (status) {
    case 400:
      return "Please check the question details and try again.";
    case 401:
      return "Authentication required.";
    case 404:
      return "This question or examination was not found.";
    case 409:
      return "A question with this order already exists.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

export default function QuestionFormPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setForm(emptyForm);
      setLoading(false);
      return;
    }

    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, editId]);

  async function loadQuestion() {
    setLoading(true);
    setLoadError("");

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
        setLoadError(
          getApiErrorMessage(response.status, data, "Unable to load question.")
        );
        return;
      }

      const existing = (data.questions || []).find(
        (item) => item._id === editId
      );

      if (!existing) {
        setLoadError("This question could not be found.");
        return;
      }

      const correctIndex = existing.options.indexOf(existing.correctAnswer);

      setForm({
        question: existing.question,
        options: existing.options,
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      });
    } catch (requestError) {
      console.error(requestError);
      setLoadError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateOption(index, value) {
    setForm((current) => {
      const options = [...current.options];
      options[index] = value;

      return {
        ...current,
        options,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    if (!form.question.trim()) {
      alert("Please enter the question.");
      return;
    }

    if (form.options.some((option) => !option.trim())) {
      alert("Please fill all four options.");
      return;
    }

    setSaving(true);

    const payload = {
      question: form.question.trim(),
      options: form.options.map((option) => option.trim()),
      correctAnswer: form.options[form.correctAnswer].trim(),
    };

    try {
      const url = isEditMode
        ? `/api/exams/${id}/questions/${editId}`
        : `/api/exams/${id}/questions`;

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
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
          getApiErrorMessage(response.status, data, "Unable to save question.")
        );
        return;
      }

      router.push(`/admin/exams/${id}/questions`);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className={styles.page}>Loading question...</div>;
  }

  if (loadError) {
    return <div className={styles.page}>{loadError}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link
          href={`/admin/exams/${id}/questions`}
          className={styles.backLink}
        >
          <ArrowLeft size={16} />
          Back to Questions
        </Link>

        <div className={styles.eyebrow}>
          <FileQuestion size={16} />
          Question Management
        </div>

        <h1>{isEditMode ? "Edit Question" : "Add Question"}</h1>

        <p>
          {isEditMode
            ? "Update this multiple-choice question."
            : "Create a multiple-choice question for this examination."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <FileQuestion size={19} />
            </div>

            <div>
              <h2>Question</h2>
              <p>Enter the question students will see.</p>
            </div>
          </div>

          <label className={styles.field}>
            <span>Question *</span>

            <textarea
              value={form.question}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  question: event.target.value,
                }))
              }
              placeholder="Enter your question..."
              rows={5}
              required
            />
          </label>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <CheckCircle2 size={19} />
            </div>

            <div>
              <h2>Answer Options</h2>
              <p>Select exactly one correct answer.</p>
            </div>
          </div>

          <div className={styles.options}>
            {form.options.map((option, index) => (
              <div
                key={index}
                className={`${styles.option} ${
                  form.correctAnswer === index ? styles.selected : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.radio}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      correctAnswer: index,
                    }))
                  }
                  aria-label={`Mark option ${String.fromCharCode(
                    65 + index
                  )} as correct`}
                >
                  {form.correctAnswer === index && <span />}
                </button>

                <span className={styles.letter}>
                  {String.fromCharCode(65 + index)}
                </span>

                <input
                  value={option}
                  onChange={(event) => updateOption(index, event.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  required
                />

                {form.correctAnswer === index && (
                  <span className={styles.correctLabel}>Correct</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className={styles.securityNotice}>
          <CheckCircle2 size={18} />

          <p>
            The selected correct answer will be stored on the server. It
            will not be sent to students during the examination.
          </p>
        </div>

        <div className={styles.actions}>
          <Link
            href={`/admin/exams/${id}/questions`}
            className={styles.cancelButton}
          >
            Cancel
          </Link>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Question"}
          </button>
        </div>
      </form>
    </div>
  );
}