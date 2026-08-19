import CourseOverview from "./CourseOverview";
import CourseHighlights from "./CourseHighlights";
import CourseCurriculum from "./CourseCurriculum";
import CourseProjects from "./CourseProjects";

import styles from "./CourseDetails.module.css";

export default function CourseDetails({ course }) {
  return (
    <div className={styles.details}>
      <CourseOverview course={course} />

      <CourseHighlights course={course} />

      <CourseCurriculum course={course} />

      <CourseProjects course={course} />
    </div>
  );
}