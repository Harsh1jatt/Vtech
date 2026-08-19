export default async function StudentDetailsPage({ params }) {
  const { id } = await params;
  return <section><h1>Student details</h1><p>Placeholder for student: {id}</p></section>;
}
