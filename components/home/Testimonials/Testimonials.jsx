"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    initial: "RS",
    name: "R. Sharma",
    course: "Web Development",
    quote:
      "The web development course was the first time coding actually made sense to me. Faculty stayed back after class whenever I got stuck — that made all the difference.",
  },
  {
    initial: "PM",
    name: "P. Mehta",
    course: "ADCA",
    quote:
      "I joined for the ADCA course with almost no computer background. Six months later I was helping my own family set up spreadsheets and presentations.",
  },
  {
    initial: "AK",
    name: "A. Kumar",
    course: "Tally",
    quote:
      "Practical, no-nonsense teaching. The Tally classes gave me exactly the skills my job interview asked about — I started work two weeks after finishing.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const goTo = (index) => {
    setCurrent((index + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const pause = () => clearInterval(intervalRef.current);
  const resume = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
  };

  return (
    <section className={styles.testimonials} id="reviews">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <Reveal className={styles.headText}>
            <span className={styles.eyebrow}>Student Reviews</span>
            <h2>Told by the people who studied here.</h2>
          </Reveal>

          <div className={styles.controls}>
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => goTo(current - 1)}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next review"
              onClick={() => goTo(current + 1)}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <Reveal
          className={styles.trackWrap}
          delay={100}
        >
          <div
            className={styles.trackViewport}
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <div
              className={styles.track}
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div className={styles.slide} key={t.name}>
                  <div className={styles.card}>
                    <span className={styles.quoteMark} aria-hidden="true">
                      &ldquo;
                    </span>
                    <p className={styles.quote}>{t.quote}</p>
                    <div className={styles.footer}>
                      <span className={styles.avatar}>{t.initial}</span>
                      <div>
                        <strong>{t.name}</strong>
                        <span>{t.course}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.dots}>
            {testimonials.map((t, index) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Go to review ${index + 1}`}
                className={index === current ? styles.dotActive : ""}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}