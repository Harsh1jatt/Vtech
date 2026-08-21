"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import StudentForm from "@/components/admin/StudentForm";
import styles from "@/components/admin/Students.module.css";

export default function EditStudentPage() {
  const params = useParams();
  const id = params?.id;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadStudent() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/admin/students/${id}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load student."
          );
        }

        setStudent(result.student);
      } catch (error) {
        console.error(
          "Load student error:",
          error
        );

        setError(
          error.message ||
            "Unable to load student."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.empty}>
        <h2>Loading student...</h2>
      </div>
    );
  }

  if (!student) {
    return (
      <div className={styles.empty}>
        <h2>Student not found</h2>

        {error && <p>{error}</p>}

        <Link
          href="/admin/students"
          className={styles.primaryButton}
        >
          Back to students
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/admin/students/${id}`}
        className={styles.backLink}
      >
        <ArrowLeft size={15} />
        Back to student
      </Link>

      <div className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>
            Learner record
          </span>

          <h1>Edit Student</h1>

          <p>
            Update {student.fullName}&apos;s information.
          </p>
        </div>
      </div>

      <StudentForm
        student={student}
        submitLabel="Update Student"
      />
    </div>
  );
}