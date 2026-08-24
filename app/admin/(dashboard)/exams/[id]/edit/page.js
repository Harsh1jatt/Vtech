"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  Save,
  ShieldCheck,
} from "lucide-react";

import styles from "../../ExamForm.module.css";

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) return data.message;

  switch (status) {
    case 400:
      return "Please check the examination details and try again.";
    case 401:
      return "Authentication required.";
    case 403:
      return "You are not authorized to perform this action.";
    case 404:
      return "This examination was not found.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

export default function EditExamPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadExam() {
    setLoading(true);
    setLoadError("");

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
        setLoadError(
          getApiErrorMessage(
            response.status,
            data,
            "Unable to load this examination."
          )
        );
        return;
      }

      const exam = data.exam;

      setForm({
        title: exam.title || "",
        description: exam.description || "",
        duration: exam.durationMinutes,
        passingPercentage: exam.passingPercentage,
        allowMultipleAttempts: Boolean(exam.allowMultipleAttempts),
        status: exam.isActive ? "Published" : "Draft",
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

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/exams/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          durationMinutes: Number(form.duration),
          passingPercentage: Number(form.passingPercentage),
          allowMultipleAttempts: form.allowMultipleAttempts === true || form.allowMultipleAttempts === "yes",
          isActive: form.status === "Published",
        }),
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
            "Unable to update examination."
          )
        );
        return;
      }

      router.push(`/admin/exams/${id}`);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className={styles.page}>Loading examination...</div>;
  }

  if (loadError || !form) {
    return <div className={styles.page}>{loadError || "Examination not found."}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href={`/admin/exams/${id}`} className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Examination
        </Link>

        <div className={styles.eyebrow}>
          <ClipboardCheck size={16} />
          Examination Management
        </div>

        <h1>Edit Examination</h1>

        <p>Update the examination configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <ClipboardCheck size={19} />
            </div>

            <div>
              <h2>Basic Information</h2>
              <p>Update the examination details.</p>
            </div>
          </div>

          <div className={styles.grid}>
            <label className={`${styles.field} ${styles.full}`}>
              <span>Examination Title *</span>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span>Description</span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <ClipboardCheck size={19} />
            </div>

            <div>
              <h2>Exam Settings</h2>
              <p>Control timing, passing and attempts.</p>
            </div>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Duration (minutes)</span>

              <input
                type="number"
                name="duration"
                min="1"
                max="1440"
                value={form.duration}
                onChange={handleChange}
              />
            </label>

            <label className={styles.field}>
              <span>Passing Percentage</span>

              <div className={styles.inputSuffix}>
                <input
                  type="number"
                  name="passingPercentage"
                  min="0"
                  max="100"
                  value={form.passingPercentage}
                  onChange={handleChange}
                />

                <span>%</span>
              </div>
            </label>

            <label className={styles.field}>
              <span>Allow Multiple Attempts</span>

              <select
                name="allowMultipleAttempts"
                value={form.allowMultipleAttempts ? "yes" : "no"}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    allowMultipleAttempts: event.target.value === "yes",
                  }))
                }
              >
                <option value="no">No — one attempt only</option>
                <option value="yes">Yes — allow re-attempts</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Status</span>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </label>
          </div>
        </section>

        <div className={styles.notice}>
          <ShieldCheck size={18} />

          <p>
            Publishing requires at least one question to already exist for
            this examination. Changing settings does not affect results
            already submitted by students.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href={`/admin/exams/${id}`} className={styles.cancelButton}>
            Cancel
          </Link>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}