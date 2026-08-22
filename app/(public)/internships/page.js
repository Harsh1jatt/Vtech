import InternshipsPage from "@/components/internships/InternshipsPage";
import { SITE_NAME } from "@/config/site";

export const metadata = {
  title: `Internships | ${SITE_NAME}`,
  description:
    `Explore internship opportunities at ${SITE_NAME} and gain practical experience through hands-on learning and real-world projects.`,
};

export default function Internships() {
  return <InternshipsPage />;
}
