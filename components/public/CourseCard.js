export default function CourseCard({ course }) {
  return <article><h2>{course?.title || "Course"}</h2></article>;
}
