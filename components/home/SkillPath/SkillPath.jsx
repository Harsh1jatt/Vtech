"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SkillPath.module.css";

const steps = [
  {
    stage: "Start",
    title: "Computer Fundamentals",
    description: "Operating systems, files and the tools you'll use every day.",
  },
  {
    stage: "Build",
    title: "Advanced Applications",
    description: "Office tools, typing speed, and structured problem solving.",
  },
  {
    stage: "Create",
    title: "Web / Python / Design",
    description: "Pick a track and start building real, working projects.",
  },
  {
    stage: "Grow",
    title: "Career & Professional Skills",
    description: "Portfolio, interview prep and guidance on your next step.",
  },
];

export default function SkillPath() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.skillPath} ref={sectionRef}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>How your training progresses</span>
          <h2>From first click to career-ready.</h2>
          <p>
            Every student follows the same path — fundamentals first, then
            applications, real creation, and finally, professional growth.
          </p>
        </div>

        <div className={styles.track}>
          <div className={styles.line}>
            <div
              className={styles.lineFill}
              style={{ width: active ? "100%" : "0%" }}
            />
          </div>

          <div className={styles.steps}>
            {steps.map((step, index) => (
              <div
                key={step.stage}
                className={`${styles.step} ${active ? styles.stepActive : ""}`}
                style={{ transitionDelay: `${index * 150 + 150}ms` }}
              >
                <span className={styles.node} />
                <span className={styles.stage}>{step.stage}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}