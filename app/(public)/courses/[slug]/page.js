export default async function CourseDetailsPage({ params }) {
  const { slug } = await params;
  return <section><h1>Course details</h1><p>Placeholder for course: {slug}</p></section>;
}
