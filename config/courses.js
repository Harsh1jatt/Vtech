export const courses = [];

export function getCourseBySlug(slug) {
  return courses.find((course) => course.slug === slug);
}
