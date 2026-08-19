import { notFound } from "next/navigation";

import { getCourseBySlug } from "@/config/courses";

import {
  CourseHeader,
  CourseDetails,
  CourseSidebar,
} from "@/components/courses";

export default async function CoursePage({ params }) {
  const { slug } = await params;

  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <CourseHeader course={course} />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <CourseDetails course={course} />

          <CourseSidebar course={course} />
        </div>
      </section>
    </main>
  );
}