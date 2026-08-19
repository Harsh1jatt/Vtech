import { courses } from "@/config/courses";

export const metadata = { title: "Courses" };

export default function CoursesPage() {
  return <section><h1>Courses</h1><p>{courses.length} course configuration placeholder.</p></section>;
}
