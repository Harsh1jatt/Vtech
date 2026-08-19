export default function CourseGrid({ courses = [] }) {
  return <section aria-label="Courses">{courses.map((course) => <div key={course.slug}>{course.title}</div>)}</section>;
}
