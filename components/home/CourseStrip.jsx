import Link from "next/link";
import styles from "./CourseStrip.module.css";

const courses = [
  "DCA",
  "ADCA",
  "Web Development",
  "Python",
  "Digital Marketing",
  "Graphic Design",
  "Tally",
];

export default function CourseStrip() {
  return (
    <section className={styles.strip} aria-label="Popular courses">
      <div className={styles.wrap}>
        <div className={styles.stripInner}>
          {courses.map((course, index) => (
            <div className={styles.itemGroup} key={course}>
              <Link href="/courses" className={styles.course}>
                {course}
              </Link>

              {index < courses.length - 1 && (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}