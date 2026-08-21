"use client";

import { useEffect, useState } from "react";

import CoursesHero from "@/components/courses/CoursesHero";
import CoursesCatalog from "@/components/courses/CoursesCatalog";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/courses", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load courses."
          );
        }

        setCourses(data.courses || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setError(
          error.message || "Unable to load courses."
        );
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <main>
      <CoursesHero />

      {loading ? (
        <section
          style={{
            minHeight: "300px",
            display: "grid",
            placeItems: "center",
            padding: "60px 20px",
          }}
        >
          <p>Loading courses...</p>
        </section>
      ) : error ? (
        <section
          style={{
            minHeight: "300px",
            display: "grid",
            placeItems: "center",
            padding: "60px 20px",
          }}
        >
          <p>{error}</p>
        </section>
      ) : (
        <CoursesCatalog courses={courses} />
      )}
    </main>
  );
}