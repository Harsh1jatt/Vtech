import Link from "next/link";
import styles from "./CoursesHero.module.css";

export default function CoursesHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            Learn • Practice • Grow
          </div>

          <h1>
            Skills that move
            <span> your career forward.</span>
          </h1>

          <p>
            Explore practical, career-focused courses designed to help you
            build real skills through structured learning and hands-on
            practice.
          </p>

          <div className={styles.actions}>
            <Link href="#courses" className={styles.primaryButton}>
              Explore Courses
              <span>↓</span>
            </Link>

            <Link href="/contact" className={styles.secondaryButton}>
              Talk to Us
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.mainCard}>
            <div className={styles.cardTop}>
              <span>VTECH</span>

              <div className={styles.status}>
                <span />
                Learning
              </div>
            </div>

            <div className={styles.coursePreview}>
              <div className={styles.icon}>
                ✓
              </div>

              <div>
                <span>Featured Program</span>
                <strong>Diploma in Computer Applications</strong>
              </div>
            </div>

            <div className={styles.progress}>
              <div className={styles.progressHeader}>
                <span>Practical Learning</span>
                <strong>12 Months</strong>
              </div>

              <div className={styles.progressBar}>
                <span />
              </div>
            </div>

            <div className={styles.tags}>
              <span>MS Office</span>
              <span>Excel</span>
              <span>Web</span>
              <span>Design</span>
            </div>
          </div>

          <div className={styles.floatingCard}>
            <div className={styles.floatingIcon}>+</div>

            <div>
              <strong>Learn by doing</strong>
              <span>Practical projects</span>
            </div>
          </div>

          <div className={styles.decorCircle} />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statsInner}>
          <div>
            <strong>12+</strong>
            <span>Months Programs</span>
          </div>

          <div>
            <strong>100%</strong>
            <span>Practical Focus</span>
          </div>

          <div>
            <strong>01</strong>
            <span>Step Toward Your Goals</span>
          </div>
        </div>
      </div>
    </section>
  );
}