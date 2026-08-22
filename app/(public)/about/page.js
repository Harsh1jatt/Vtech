import AboutPage from "@/components/about/AboutPage";
import { SITE_NAME } from "@/config/site";

export const metadata = {
  title: `About ${SITE_NAME} | Ludhiana`,
  description:
    `Learn about ${SITE_NAME} in Ludhiana, our practical learning approach, career-focused training and commitment to building real digital skills.`,
};

export default function About() {
  return <AboutPage />;
}