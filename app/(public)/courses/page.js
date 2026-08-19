import { courses } from "@/config/courses";

import CoursesHero from "@/components/courses/CoursesHero";
import CoursesCatalog from "@/components/courses/CoursesCatalog";

export default function CoursesPage() {
  return (
    <main>
      <CoursesHero />
      <CoursesCatalog courses={courses} />
    </main>
  );
}