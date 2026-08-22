"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import CourseForm from "@/components/admin/CourseForm";
import styles from "@/components/admin/Courses.module.css";

export default function EditCoursePage() {
  const params = useParams();
  const id = params?.id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/courses/${id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load course."
          );
        }

        setCourse(result.course);
      } catch (error) {
        console.error("Load course error:", error);
        setError(
          error.message || "Unable to load course."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.empty}>
        <h2>Loading course...</h2>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={styles.empty}>
        <h2>Course not found</h2>

        {error && <p>{error}</p>}

        <Link
          href="/admin/courses"
          className={styles.primaryButton}
        >
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/admin/courses/${id}`}
        className={styles.backLink}
      >
        <ArrowLeft size={15} />
        Back to course
      </Link>

      <div className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>
            Programme record
          </span>

          <h1>Edit Course</h1>

          <p>
            Update {course.title} information.
          </p>
        </div>
      </div>

      <CourseForm
        course={course}
        submitLabel="Update Course"
      />
    </div>
  );
}