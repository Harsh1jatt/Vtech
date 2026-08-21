import { notFound } from "next/navigation";
import { headers } from "next/headers";

import {
  CourseHeader,
  CourseDetails,
  CourseSidebar,
} from "@/components/courses";

import styles from "@/components/courses/CourseDetails.module.css";

export default async function CoursePage({ params }) {
  const { slug } = await params;

  const requestHeaders = await headers();

  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host");

  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    "http";

  if (!host) {
    notFound();
  }

  const apiUrl = `${protocol}://${host}/api/courses/${encodeURIComponent(
    slug
  )}`;

  let response;

  try {
    response = await fetch(apiUrl, {
      cache: "no-store",
    });
  } catch (error) {
    console.error(
      "Course API request failed:",
      error
    );

    throw error;
  }

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }

    console.error(
      `Course API returned ${response.status}`
    );

    throw new Error(
      "Failed to load course."
    );
  }

  const data = await response.json();

  if (!data.success || !data.course) {
    notFound();
  }

  const course = data.course;

  return (
    <main className={styles.page}>
      <CourseHeader course={course} />

      <section className={styles.contentSection}>
        <div className={styles.layout}>
          <CourseDetails course={course} />

          <CourseSidebar course={course} />
        </div>
      </section>
    </main>
  );
}