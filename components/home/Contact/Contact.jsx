"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./Contact.module.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
const courseOptions = [
  "Web Development",
  "DCA",
  "ADCA",
  "Python",
  "Digital Marketing",
  "Graphic Design",
  "Advanced Excel",
  "Tally",
];

const initialState = {
  name: "",
  phone: "",
  email: "",
  course: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const next = {};

    if (form.name.trim().length < 2) {
      next.name = "Please enter your full name";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid 10-digit mobile number";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (!form.course) {
      next.course = "Please select a course";
    }

    if (form.message.trim().length < 5) {
      next.message = "Tell us a little about your enquiry";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      setStatus("idle");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setForm(initialState);
      setErrors({});
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.wrap}>
        <Reveal className={styles.info}>
          <span className={styles.eyebrow}>Get in touch</span>

          <h3>VTech Institute of Information Technology</h3>

          <div className={styles.list}>
            <div className={styles.row}>
              <span className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>

              <div>
                <div className={styles.label}>Address</div>
                <div className={styles.value}>
                  #1326, Prem Vihar, Main Road, Subhash Nagar, Ludhiana
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>

              <div>
                <div className={styles.label}>Phone</div>
                <a
                  className={styles.value}
                  href="tel:+919855260786"
                >
                  +91 98552 60786
                </a>
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 6l-10 7L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>

              <div>
                <div className={styles.label}>Email</div>
                <a
                  className={styles.value}
                  href="mailto:Vtech4186@gmail.com"
                >
                  Vtech4186@gmail.com
                </a>
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 6v6l4 2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>

              <div>
                <div className={styles.label}>Opening Hours</div>
                <div className={styles.value}>
                  Mon – Sat, 9:00 AM – 7:00 PM
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal
          as="form"
          delay={120}
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <span className={styles.eyebrow}>Enquiry Form</span>

          <h3 className={styles.formTitle}>
            Tell us what you&apos;re looking for
          </h3>

          <div className={styles.formRow}>
            <div
              className={`${styles.field} ${
                errors.name ? styles.invalid : ""
              }`}
            >
              <label htmlFor="f-name">Full Name</label>

              <input
                id="f-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
              />

              <span className={styles.err}>{errors.name}</span>
            </div>

            <div
              className={`${styles.field} ${
                errors.phone ? styles.invalid : ""
              }`}
            >
              <label htmlFor="f-phone">Phone Number</label>

              <input
                id="f-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />

              <span className={styles.err}>{errors.phone}</span>
            </div>
          </div>

          <div
            className={`${styles.field} ${
              errors.email ? styles.invalid : ""
            }`}
          >
            <label htmlFor="f-email">Email</label>

            <input
              id="f-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <span className={styles.err}>{errors.email}</span>
          </div>

          <div
            className={`${styles.field} ${
              errors.course ? styles.invalid : ""
            }`}
          >
            <label htmlFor="f-course">Select Course</label>

            <select
              id="f-course"
              name="course"
              value={form.course}
              onChange={handleChange}
            >
              <option value="">Choose a course</option>

              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <span className={styles.err}>{errors.course}</span>
          </div>

          <div
            className={`${styles.field} ${
              errors.message ? styles.invalid : ""
            }`}
          >
            <label htmlFor="f-message">Message</label>

            <textarea
              id="f-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us a bit about what you're looking for"
            />

            <span className={styles.err}>{errors.message}</span>
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Send Enquiry"}

            {status !== "loading" && (
              <ArrowRight/>
            )}
          </button>

          {status === "success" && (
            <div className={styles.success}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Thanks — your enquiry has been received. Our team will call you
              shortly.
            </div>
          )}

          {status === "error" && (
            <div className={styles.errorBanner}>
              Something went wrong. Please try again or call us directly.
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}