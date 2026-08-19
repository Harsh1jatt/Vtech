"use client";

import { useState } from "react";
import styles from "./CourseDetails.module.css";

export default function CourseCurriculum({ course }) {
  const [openMonth, setOpenMonth] = useState(1);

  return (
    <section className={styles.dividerSection}>
      <div>
        <p className={styles.sectionLabel}>Course Curriculum</p>

        <h2 className={styles.sectionTitle}>
          {course.duration} detailed syllabus
        </h2>

        <p className={styles.sectionDescription}>
          Explore the complete course curriculum month by month.
        </p>
      </div>

      <div className={styles.curriculumList}>
        {course.curriculum?.map((month) => {
          const isOpen = openMonth === month.month;

          return (
            <div className={styles.curriculumItem} key={month.month}>
              <button
                type="button"
                onClick={() =>
                  setOpenMonth(isOpen ? null : month.month)
                }
                className={styles.curriculumButton}
                aria-expanded={isOpen}
              >
                <div className={styles.curriculumHeading}>
                  <span className={styles.monthNumber}>
                    {String(month.month).padStart(2, "0")}
                  </span>

                  <div>
                    <p className={styles.monthLabel}>
                      Month {month.month}
                    </p>

                    <h3 className={styles.monthTitle}>
                      {month.title}
                    </h3>
                  </div>
                </div>

                <span
                  className={`${styles.chevron} ${
                    isOpen ? styles.chevronOpen : ""
                  }`}
                  aria-hidden="true"
                >
                  ↓
                </span>
              </button>

              {isOpen && (
                <div className={styles.topics}>
                  <ul className={styles.topicList}>
                    {month.topics?.map((topic, index) => (
                      <li className={styles.topic} key={topic}>
                        <span className={styles.topicNumber}>
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