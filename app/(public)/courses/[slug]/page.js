import { notFound } from "next/navigation";

import { getCourseBySlug } from "@/config/courses";

import {
  CourseHeader,
  CourseDetails,
  CourseSidebar,
} from "@/components/courses";
import styles from "@/components/courses/CourseDetails.module.css";

export default async function CoursePage({ params }) {
  const { slug } = await params;

  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

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