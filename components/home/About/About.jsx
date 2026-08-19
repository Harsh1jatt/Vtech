import Image from "next/image";
import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./About.module.css";

const points = [
  "Practical Sessions",
  "Experienced Faculty",
  "Project-Based Learning",
  "Career Guidance",
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.wrap}>
        <Reveal className={styles.image}>
          <Image
            src="/images/about-training.png"
            alt="Faculty guiding a student through a practical exercise"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            className={styles.img}
          />
        </Reveal>

        <Reveal className={styles.content} delay={120}>
          <span className={styles.eyebrow}>About VTech</span>
          <h2>More than a computer class.</h2>
          <p>
            VTech Institute of Information Technology was built around one
            idea — students should leave knowing how to actually use
            technology, not just recognise it. Our sessions stay practical,
            our faculty stay involved, and every course ends with something
            you&apos;ve built yourself.
          </p>

          <ul className={styles.checklist}>
            {points.map((point) => (
              <li key={point}>
                <span className={styles.tick}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}