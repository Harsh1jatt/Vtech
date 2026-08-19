import { SITE_URL } from "@/config/site";

export default function sitemap() {
  return ["", "/about", "/courses", "/verify-certificate", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
