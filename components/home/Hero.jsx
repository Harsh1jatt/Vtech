import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.wrap}>
        <div className={styles.heroGrid}>
          {/* ================= LEFT ================= */}
          <div className={`${styles.heroLeft} ${styles.reveal}`}>
            <span className={styles.eyebrow}>
              Computer Education • Practical Training
            </span>

            <h1>
              Learn Today.
              <br />
              <span className={styles.accentWord}>Build</span> Tomorrow.
            </h1>

            <p>
              Build practical computer skills through structured courses,
              hands-on projects and expert guidance — designed for students
              who want real, usable skills.
            </p>

            <div className={styles.heroActions}>
              <Link
                href="/courses"
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                <span>Explore Courses</span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/contact"
                className={`${styles.button} ${styles.buttonGhost}`}
              >
                Book a Visit
              </Link>
            </div>

            <div className={styles.heroTrust}>
              <div className={styles.avatarStack}>
                <span>AK</span>
                <span>RS</span>
                <span>PM</span>
                <span>+</span>
              </div>

              <p>
                <strong>500+ students</strong>{" "}
                trained at VTech since we started
              </p>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className={styles.heroRight}>
            <div className={styles.heroVisual}>
              <Image
                src="/images/hero-classroom.png"
                alt="Students practicing at computer workstations in the VTech lab"
                fill
                priority
                sizes="(max-width: 1024px) 420px, 48vw"
                className={styles.heroImage}
              />
            </div>

            <div
              className={`${styles.floatCard} ${styles.cardOne}`}
            >
              <div className={styles.cardNumber}>500+</div>
              <div className={styles.cardLabel}>
                Students Trained
              </div>
            </div>

            <div
              className={`${styles.floatCard} ${styles.cardTwo}`}
            >
              <div className={styles.cardNumber}>10+</div>
              <div className={styles.cardLabel}>
                Courses Offered
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}