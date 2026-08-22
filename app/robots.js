import { SITE_URL } from "@/config/site";

export default function robots() {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/contact",
          "/courses",
          "/internships",
          "/verify-certificate",
        ],
        disallow: [
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}