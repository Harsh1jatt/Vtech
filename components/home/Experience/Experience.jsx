import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./Experience.module.css";

const cards = [
  {
    key: "learn",
    variant: "c1",
    title: "Learn",
    description:
      'Structured lessons that build from the ground up, taught by faculty who explain the "why," not just the steps.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "practice",
    variant: "c2",
    title: "Practice",
    description:
      "Hands-on exercises in the lab, right after every concept — so nothing stays purely theoretical.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18V5l12-2v13M9 9l12-2M6 21a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "create",
    variant: "c3",
    title: "Create",
    description:
      "Real projects you can show — a website, a spreadsheet model, a design portfolio — built by you, start to finish.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 16.4l-6.3 4.6L8 13.8 2 9.2h7.6z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Experience() {
  return (
    <section className={styles.experience}>
      <div className={styles.wrap}>
        <Reveal className={styles.sectionHead}>
          <span className={styles.eyebrow}>Student Experience</span>
          <h2>What learning at VTech feels like.</h2>
          <p>
            Three stages, one steady rhythm — you learn it, you practice it,
            then you make something real with it.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {cards.map((card, index) => (
            <Reveal
              key={card.key}
              className={`${styles.card} ${styles[card.variant]}`}
              delay={index * 100}
            >
              <div className={styles.icon}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}