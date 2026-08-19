"use client";

import { useState } from "react";

export default function CourseCurriculum({ course }) {
  const [openMonth, setOpenMonth] = useState(1);

  return (
    <section className="border-t border-gray-200 pt-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Course Curriculum
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          12-Month Detailed Syllabus
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Explore the complete course curriculum month by month.
        </p>
      </div>

      <div className="mt-8 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {course.curriculum?.map((month) => {
          const isOpen = openMonth === month.month;

          return (
            <div key={month.month}>
              <button
                type="button"
                onClick={() =>
                  setOpenMonth(isOpen ? null : month.month)
                }
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-gray-50 sm:px-6"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-900">
                    {String(month.month).padStart(2, "0")}
                  </span>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Month {month.month}
                    </p>

                    <h3 className="mt-1 font-semibold text-gray-950">
                      {month.title}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-xl text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ↓
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 sm:px-6">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {month.topics?.map((topic, index) => (
                      <li
                        key={topic}
                        className="flex gap-3 text-sm leading-6 text-gray-700"
                      >
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-medium text-gray-500 ring-1 ring-gray-200">
                          {index + 1}
                        </span>

                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}