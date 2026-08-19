"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Stats.module.css";

const stats = [
  { value: 500, suffix: "+", label: "Students Trained" },
  { value: 10, suffix: "+", label: "Courses" },
  { value: 5, suffix: "+", label: "Years" },
  { value: 95, suffix: "%", label: "Satisfaction" },
];

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame;
    let start = null;

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatItem({ stat, active }) {
  const value = useCountUp(stat.value, active);
  return (
    <div className={styles.item}>
      <div className={styles.number}>
        {value}
        {stat.suffix}
      </div>
      <div className={styles.label}>{stat.label}</div>
    </div>
  );
}

export default function Stats() {
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
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.stats} ref={sectionRef}>
      <div className={styles.wrap}>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}