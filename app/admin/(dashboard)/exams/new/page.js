"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  Clock3,
  Save,
  ShieldCheck,
} from "lucide-react";

import styles from "../ExamForm.module.css";

const initialForm = {
  title: "",
  description: "",
  duration: 60,
  passingPercentage: 40,
  allowMultipleAttempts: false,
};

const getApiErrorMessage = (status, data, fallback) => {
  if (data?.message) return data.message;

  switch (status) {
    case 400:
      return "Please check the examination details and try again.";
    case 401:
      return "Authentication required.";
    case 403:
      return "You are not authorized to perform this action.";
    case 500:
      return "Something went wrong on the server.";
    default:
      return fallback;
  }
};

export default function NewExamPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    if (!form.title.trim()) {
      alert("Please enter an examination title.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          durationMinutes: Number(form.duration),
          passingPercentage: Number(form.passingPercentage),
          allowMultipleAttempts: Boolean(form.allowMultipleAttempts),
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
            "Unable to create examination."
          )
        );
        return;
      }

      router.push(`/admin/exams/${data.exam._id}`);
    } catch (error) {
      console.error("Failed to create exam:", error);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/exams" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Exams
          </Link>

          <div className={styles.eyebrow}>
            <ClipboardCheck size={16} />
            Examination Management
          </div>

          <h1>Create Examination</h1>

          <p>Configure the basic settings for a new student examination.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <ClipboardCheck size={19} />
            </div>

            <div>
              <h2>Basic Information</h2>
              <p>Enter the main details of the examination.</p>
            </div>
          </div>

          <div className={styles.grid}>
            <label className={`${styles.field} ${styles.full}`}>
              <span>
                Examination Title <b>*</b>
              </span>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. ADCA Final Examination"
                required
              />
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span>Description</span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description of this examination..."
                rows={4}
              />
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <Clock3 size={19} />
            </div>

            <div>
              <h2>Exam Settings</h2>
              <p>Set the rules students will follow.</p>
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

              <small>
                Students can only take this exam once unless enabled.
              </small>
            </label>
          </div>
        </section>

        <div className={styles.notice}>
          <ShieldCheck size={18} />

          <p>
            This examination will be created as a Draft. Add at least one
            question before publishing it — you can publish from the Edit
            screen afterward.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/exams" className={styles.cancelButton}>
            Cancel
          </Link>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            <Save size={17} />
            {saving ? "Creating..." : "Create Examination"}
          </button>
        </div>
      </form>
    </div>
  );
}