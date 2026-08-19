import Link from "next/link";

export default function CourseSidebar({ course }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="aspect-video overflow-hidden bg-gray-100">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Course Image
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500">Course Duration</p>

          <p className="mt-1 text-lg font-semibold text-gray-950">
            {course.duration}
          </p>

          <div className="my-6 border-t border-gray-100" />

          <p className="text-sm text-gray-500">Course Fee</p>

          {course.price ? (
            <p className="mt-1 text-3xl font-bold text-gray-950">
              ₹{course.price.toLocaleString("en-IN")}
            </p>
          ) : (
            <p className="mt-1 text-lg font-semibold text-gray-950">
              Contact for Fee
            </p>
          )}

          <Link
            href="/contact"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Enquire About This Course
          </Link>

          <p className="mt-4 text-center text-xs leading-5 text-gray-500">
            Contact us for admission details, fees and course availability.
          </p>
        </div>
      </div>
    </aside>
  );
}