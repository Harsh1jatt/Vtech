"use client";

import styles from "./CourseDetails.module.css";

export default function CourseBuyButton({ course }) {
  const handleBuyCourse = () => {
    const whatsappNumber =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

    if (!whatsappNumber) {
      console.error(
        "NEXT_PUBLIC_WHATSAPP_NUMBER is not configured."
      );
      return;
    }

    const {
      title,
      shortTitle,
      category,
      level,
      duration,
      type,
      price,
    } = course || {};

    const message = `Hello VTech Institute,

I am interested in enrolling in the following course:

📚 Course: ${title || "N/A"}
${shortTitle ? `🏷️ Short Name: ${shortTitle}\n` : ""}${category ? `📂 Category: ${category}\n` : ""}${level ? `📊 Level: ${level}\n` : ""}${duration ? `⏱️ Duration: ${duration}\n` : ""}${type ? `🎓 Type: ${type}\n` : ""}${price ? `💰 Course Fee: ₹${Number(price).toLocaleString("en-IN")}\n` : ""}

Please share the admission/enrollment process and confirm the course availability.

Thank you.`;

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      type="button"
      className={styles.sidebarCta}
      onClick={handleBuyCourse}
    >
      <span>Buy Course on WhatsApp</span>

      <span
        className={styles.sidebarCtaIcon}
        aria-hidden="true"
      >
        ↗
      </span>
    </button>
  );
}