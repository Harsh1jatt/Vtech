import Image from "next/image";
import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./Facilities.module.css";

const facilities = [
  { src: "/images/facility-lab.png", label: "Computer Lab" },
  { src: "/images/facility-practical.png", label: "Practical Training" },
  { src: "/images/facility-project.png", label: "Project Sessions" },
  { src: "/images/facility-classroom.png", label: "Learning Environment" },
];

export default function Facilities() {
  return (
    <section className={styles.facilities}>
      <div className={styles.wrap}>
        <Reveal className={styles.sectionHead}>
          <span className={styles.eyebrow}>Where you&apos;ll learn</span>
          <h2>A lab built for practice, not just lectures.</h2>
        </Reveal>

        <div className={styles.grid}>
          {facilities.map((facility, index) => (
            <Reveal
              key={facility.label}
              className={`${styles.item} ${index === 0 ? styles.itemLarge : ""}`}
              delay={index * 80}
            >
              <Image
                src={facility.src}
                alt={facility.label}
                fill
                sizes="(max-width: 900px) 50vw, 30vw"
                className={styles.img}
              />
              <span className={styles.label}>{facility.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}