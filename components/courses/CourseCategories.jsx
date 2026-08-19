"use client";

import styles from "./CourseCategories.module.css";

export default function CourseCategories({
  courses = [],
  value = "all",
  onChange,
}) {
  const categories = [
    ...new Set(
      courses
        .map((course) => course.category)
        .filter(Boolean)
    ),
  ];

  const items = [
    {
      value: "all",
      label: "All Courses",
    },
    ...categories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>
              Browse by category
            </span>

            <h2>Find what you want to learn</h2>
          </div>

          <p>
            Explore courses based on your interests and
            career goals.
          </p>
        </div>

        <div className={styles.categories}>
          {items.map((item) => {
            const active = value === item.value;

            return (
              <button
                key={item.value}
                type="button"
                className={`${styles.category} ${
                  active ? styles.active : ""
                }`}
                onClick={() =>
                  onChange?.(item.value)
                }
              >
                <span className={styles.icon}>
                  {active ? "✓" : "→"}
                </span>

                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}