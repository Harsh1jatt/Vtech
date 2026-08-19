import Link from "next/link";
import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.wrap}>
        <Reveal className={styles.box}>
          <span className={styles.eyebrow}>Ready when you are</span>
          <h2>Your next skill could change your direction.</h2>
          <p>
            Talk to our team about which course fits where you want to go —
            no pressure, just a straight answer.
          </p>
          <div className={styles.actions}>
            <Link href="/courses" className={`${styles.button} ${styles.primary}`}>
              Explore Courses
            </Link>
            <Link href="/contact" className={`${styles.button} ${styles.ghost}`}>
              Talk to VTech
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}