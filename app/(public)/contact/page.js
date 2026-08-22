import Contact from "@/components/contact/Contact";
import { SITE_NAME } from "@/config/site";

export const metadata = {
  title: `Contact ${SITE_NAME} | Ludhiana`,
  description:
    `Get in touch with ${SITE_NAME} in Ludhiana for course enquiries, admissions, computer training and career-focused learning.`,
};

export default function ContactPage() {
  return <Contact />;
}
