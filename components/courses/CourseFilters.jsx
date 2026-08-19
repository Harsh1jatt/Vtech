"use client";

import styles from "./CourseFilters.module.css";

export default function CourseFilters({
  search = "",
  setSearch,
  level = "all",
  setLevel,
  sort = "default",
  setSort,
  levels = [],
  resultCount = 0,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.search}>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
          />

          <path d="m16 16 5 5" />
        </svg>

        <input
          type="search"
          value={search}
          placeholder="Search courses..."
          onChange={(event) =>
            setSearch?.(event.target.value)
          }
        />
      </div>

      <div className={styles.controls}>
        <label>
          <span>Level</span>

          <select
            value={level}
            onChange={(event) =>
              setLevel?.(event.target.value)
            }
          >
            <option value="all">
              All levels
            </option>

            {levels.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort</span>

          <select
            value={sort}
            onChange={(event) =>
              setSort?.(event.target.value)
            }
          >
            <option value="default">
              Recommended
            </option>

            <option value="featured">
              Featured first
            </option>

            <option value="az">
              A → Z
            </option>

            <option value="za">
              Z → A
            </option>
          </select>
        </label>
      </div>

      <div className={styles.result}>
        <strong>{resultCount}</strong>
        <span>
          {resultCount === 1
            ? "course found"
            : "courses found"}
        </span>
      </div>
    </div>
  );
}