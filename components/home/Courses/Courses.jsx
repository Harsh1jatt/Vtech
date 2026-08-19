import Link from "next/link";
import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./Courses.module.css";

const featured = {
  slug: "web-development",
  title: "Web Development",
  description:
    "HTML, CSS, JavaScript and real project builds — from your first page to a full portfolio site.",
};

const courses = [
  {
    slug: "dca",
    title: "DCA",
    description: "Diploma in Computer Applications — the essentials, done properly.",
  },
  {
    slug: "adca",
    title: "ADCA",
    description: "Advanced diploma for deeper, career-ready computer skills.",
  },
  {
    slug: "python",
    title: "Python",
    description: "Programming logic, syntax and small real-world projects.",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    description: "SEO, social media and running campaigns that actually convert.",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    description: "Visual design fundamentals using industry-standard tools.",
  },
  {
    slug: "advanced-excel",
    title: "Advanced Excel",
    description: "Formulas, pivot tables and dashboards for real office work.",
  },
  {
    slug: "tally",
    title: "Tally",
    description: "Accounting and billing software used across small businesses.",
  },
];

export default function Courses() {
  return (
    <section className={styles.courses} id="courses">
      <div className={styles.wrap}>
        <Reveal className={styles.sectionHead}>
          <span className={styles.eyebrow}>What you can learn</span>
          <h2>Courses built for real skill, not just certificates.</h2>
          <p>
            Every course pairs classroom fundamentals with practical, hands-on
            lab time — so what you learn is what you can actually do.
          </p>
        </Reveal>

        <div className={styles.layout}>
          <Reveal className={styles.featured} delay={80}>
            <Link href={`/courses/${featured.slug}`} className={styles.featuredLink}>
              <span className={styles.tag}>Most Popular</span>
              <span className={styles.numMark}>01</span>
              <h3>{featured.title}</h3>
              <p>{featured.description}</p>
              <span className={styles.featuredCta}>
                Learn more
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </Reveal>

          <Reveal className={styles.list} delay={140}>
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className={styles.row}
              >
                <div>
                  <h4>{course.title}</h4>
                  <p>{course.description}</p>
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M7 7h10v10"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}