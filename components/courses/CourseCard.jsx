import Link from "next/link";
import styles from "./CourseCard.module.css";

export default function CourseCard({ course }) {
  if (!course) return null;

  const {
    slug,
    title,
    shortTitle,
    description,
    shortDescription,
    category,
    level,
    duration,
    type,
    thumbnail,
    image,
    featured,
    highlights = [],
    skills = [],
  } = course;

  const previewItems =
    highlights.length > 0
      ? highlights
      : skills;

  // API thumbnail structure:
  // thumbnail: { url, publicId }
  const imageUrl =
    thumbnail?.url ||
    image ||
    "";

  // ================= BUY COURSE =================

  const handleBuyCourse = () => {
    const whatsappNumber =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

    if (!whatsappNumber) {
      console.error(
        "NEXT_PUBLIC_WHATSAPP_NUMBER is not configured."
      );
      return;
    }

    const message = `Hello VTech Institute,

I am interested in enrolling in the following course:

📚 Course: ${title || "N/A"}
${shortTitle ? `🏷️ Short Name: ${shortTitle}\n` : ""}${category ? `📂 Category: ${category}\n` : ""}${level ? `📊 Level: ${level}\n` : ""}${duration ? `⏱️ Duration: ${duration}\n` : ""}${type ? `🎓 Type: ${type}\n` : ""}

Please share the admission/enrollment process and fee details.

Thank you.`;

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <article className={styles.card}>
      {/* ================= IMAGE ================= */}

      <div className={styles.media}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Course"}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>
              {shortTitle?.slice(0, 2) || "CR"}
            </span>
          </div>
        )}

        <div className={styles.overlay} />

        {featured && (
          <span className={styles.featured}>
            <span className={styles.star}>★</span>
            Featured
          </span>
        )}

        {category && (
          <span className={styles.category}>
            {category}
          </span>
        )}
      </div>

      {/* ================= CONTENT ================= */}

      <div className={styles.content}>
        <div className={styles.heading}>
          {shortTitle && (
            <span className={styles.shortTitle}>
              {shortTitle}
            </span>
          )}

          <h3>{title}</h3>
        </div>

        <p className={styles.description}>
          {shortDescription ||
            description ||
            "Develop practical skills through structured learning and hands-on projects."}
        </p>

        {/* ================= META ================= */}

        <div className={styles.meta}>
          {duration && (
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>
                ◷
              </span>

              <div>
                <small>Duration</small>
                <strong>{duration}</strong>
              </div>
            </div>
          )}

          {level && (
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>
                ◈
              </span>

              <div>
                <small>Level</small>
                <strong>{level}</strong>
              </div>
            </div>
          )}

          {type && (
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>
                ✓
              </span>

              <div>
                <small>Type</small>
                <strong>{type}</strong>
              </div>
            </div>
          )}
        </div>

        {/* ================= SKILLS ================= */}

        {previewItems.length > 0 && (
          <div className={styles.skills}>
            {previewItems
              .slice(0, 3)
              .map((item) => (
                <span key={item}>
                  {item}
                </span>
              ))}

            {previewItems.length > 3 && (
              <span className={styles.more}>
                +{previewItems.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ================= FOOTER ================= */}

        <div className={styles.footer}>
          <span className={styles.learn}>
            Explore course
          </span>

          <div className={styles.actions}>
            {slug ? (
              <Link
                href={`/courses/${slug}`}
                className={styles.button}
                aria-label={`View ${title}`}
              >
                <span>View Course</span>

                <span
                  className={styles.arrow}
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ) : (
              <span className={styles.button}>
                <span>View Course</span>

                <span
                  className={styles.arrow}
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            )}

            <button
              type="button"
              className={styles.buyButton}
              onClick={handleBuyCourse}
            >
              <span>Buy Course</span>

              <span
                className={styles.whatsappIcon}
                aria-hidden="true"
              >
                ↗
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}