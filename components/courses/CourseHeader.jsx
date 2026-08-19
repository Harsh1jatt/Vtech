import Link from "next/link";
import styles from "./CourseHeader.module.css";
export default function CourseHeader({ course }) {
  return (
    <section className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/courses" className="transition hover:text-gray-950">
            Courses
          </Link>

          <span>/</span>

          <span className="truncate text-gray-900">{course.title}</span>
        </div>

        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gray-950 px-3 py-1.5 text-xs font-semibold text-white">
              {course.category}
            </span>

            <span className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
              {course.level}
            </span>

            <span className="text-sm text-gray-500">
              {course.duration}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
            {course.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            {course.description}
          </p>
        </div>
      </div>
    </section>
  );
}