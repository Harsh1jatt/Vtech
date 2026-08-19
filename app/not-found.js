import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <section className={styles.container}>
        <div className={styles.card}>
          <div className={styles.codeTop}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.fileName}>404.jsx</span>
          </div>

          <div className={styles.content}>
            <div className={styles.errorNumber}>
              <span>4</span>
              <div className={styles.zero}>
                <div className={styles.zeroInner}>
                  <span>?</span>
                </div>
              </div>
              <span>4</span>
            </div>

            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              PAGE NOT FOUND
            </div>

            <h1>
              Looks like this
              <br />
              <span>page skipped class.</span>
            </h1>

            <p>
              The page you&apos;re looking for doesn&apos;t exist, has been
              moved, or took a little break from the internet.
            </p>

            <div className={styles.actions}>
              <Link href="/" className={styles.primaryButton}>
                <span>←</span>
                Back to Home
              </Link>

              <Link href="/contact" className={styles.secondaryButton}>
                Contact Us
              </Link>
            </div>
          </div>

          <div className={styles.codeBottom}>
            <span>VTECH</span>
            <span>Institute of Information Technology</span>
          </div>
        </div>

        <div className={styles.floatingCard}>
          <span className={styles.terminalIcon}>&gt;_</span>

          <div>
            <strong>Error 404</strong>
            <small>Route not found</small>
          </div>
        </div>

        <div className={styles.decorOne}>{"{ }"}</div>
        <div className={styles.decorTwo}>{"</>"}</div>
        <div className={styles.decorThree}>01</div>
      </section>
    </main>
  );
}