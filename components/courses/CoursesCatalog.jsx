"use client";

import { useMemo, useState } from "react";

import CourseCategories from "./CourseCategories";
import CourseFilters from "./CourseFilters";
import CourseGrid from "./CourseGrid";

import styles from "./CoursesCatalog.module.css";

export default function CoursesCatalog({
  courses = [],
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState("default");

  const levels = useMemo(() => {
    return [
      ...new Set(
        courses
          .map((course) => course.level)
          .filter(Boolean)
      ),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((course) => {
        const searchable = [
          course.title,
          course.shortTitle,
          course.description,
          course.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      });
    }

    if (category !== "all") {
      result = result.filter(
        (course) => course.category === category
      );
    }

    if (level !== "all") {
      result = result.filter(
        (course) => course.level === level
      );
    }

    if (sort === "featured") {
      result.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured)
      );
    }

    if (sort === "az") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sort === "za") {
      result.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [
    courses,
    search,
    category,
    level,
    sort,
  ]);

  return (
    <section
      id="courses"
      className={styles.catalog}
    >
      <CourseCategories
        courses={courses}
        value={category}
        onChange={setCategory}
      />

      <CourseFilters
        search={search}
        setSearch={setSearch}
        level={level}
        setLevel={setLevel}
        sort={sort}
        setSort={setSort}
        levels={levels}
        resultCount={filteredCourses.length}
      />

      <CourseGrid
        courses={filteredCourses}
      />
    </section>
  );
}