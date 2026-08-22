import { SITE_URL } from "@/config/site";
import connectToDatabase from "@/lib/db";
import Course from "@/models/Course";

export default async function sitemap() {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/courses",
    "/internships",
    "/verify-certificate",
  ];

  let coursePages = [];

  try {
    await connectToDatabase();

    const courses = await Course.find({ status: "Active" })
      .select("slug updatedAt")
      .lean();

    coursePages = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap course query failed:", error);
  }

  const pages = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  return [...pages, ...coursePages];
}