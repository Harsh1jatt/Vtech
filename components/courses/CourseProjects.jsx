const projects = [
  "MS Word practical",
  "MS Excel practical",
  "PowerPoint presentation",
  "Database project",
  "Website project",
  "Graphic-design project",
  "Final integrated project",
];

export default function CourseProjects({ course }) {
  return (
    <section className="border-t border-gray-200 pt-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
        Practical Learning
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
        Projects & Practical Work
      </h2>

      <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
        Apply what you learn through practical assignments and real-world
        projects throughout the course.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <div
            key={project}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Project {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="mt-2 font-semibold text-gray-900">
              {project}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}