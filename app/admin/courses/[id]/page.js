import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminAuth";

import CourseDetailActions from "@/components/admin/CourseDetailActions";
import StatusBadge from "@/components/admin/StatusBadge";
import styles from "@/components/admin/Courses.module.css";

export default async function CourseDetailsPage({ params }) {
  const { id } = await params;

  await requireAdmin();
  await connectToDatabase();

  const courseDoc = mongoose.Types.ObjectId.isValid(id)
    ? await Course.findById(id).lean()
    : await Course.findOne({ slug: id }).lean();

  if (!courseDoc) {
    return (
      <div className={styles.empty}>
        <h2>Course not found</h2>

        <Link
          href="/admin/courses"
          className={styles.primaryButton}
        >
          Back to courses
        </Link>
      </div>
    );
  }

  // Convert MongoDB values into plain JSON-safe values
  const course = {
    ...courseDoc,
    _id: courseDoc._id.toString(),
    createdAt: courseDoc.createdAt?.toISOString?.() || null,
    updatedAt: courseDoc.updatedAt?.toISOString?.() || null,

    thumbnail: courseDoc.thumbnail
      ? {
          url: courseDoc.thumbnail.url || "",
          publicId: courseDoc.thumbnail.publicId || "",
        }
      : {
          url: "",
          publicId: "",
        },

    highlights: Array.isArray(courseDoc.highlights)
      ? [...courseDoc.highlights]
      : [],

    skills: Array.isArray(courseDoc.skills)
      ? [...courseDoc.skills]
      : [],

    curriculum: Array.isArray(courseDoc.curriculum)
      ? courseDoc.curriculum.map((item) => ({
          month: item.month,
          title: item.title,
          topics: Array.isArray(item.topics) ? [...item.topics] : [],
        }))
      : [],

    projects: Array.isArray(courseDoc.projects)
      ? courseDoc.projects.map((project) => ({
          title: project.title,
          description: project.description || "",
        }))
      : [],
  };

  return (
    <div>
      <Link
        href="/admin/courses"
        className={styles.backLink}
      >
        <ArrowLeft size={15} />
        Back to courses
      </Link>

      <div className={styles.detailHeader}>
        <div>
          <span className={styles.eyebrow}>
            Programme record
          </span>

          <h1>Course Details</h1>

          <p>
            Review programme information and curriculum.
          </p>
        </div>

        <CourseDetailActions course={course} />
      </div>

      <section className={styles.hero}>
        <span className={styles.heroMark}>
          {(course.shortTitle || course.title || "")
            .slice(0, 3)
            .toUpperCase()}
        </span>

        <div>
          <h2>{course.title}</h2>
          <p>{course.shortTitle}</p>
        </div>

        <div className={styles.heroStatus}>
          <StatusBadge status={course.status} />
        </div>
      </section>

      <div className={styles.detailGrid}>
        <section className={`${styles.section} ${styles.full}`}>
          <h2>Description</h2>

          <p className={styles.notes}>
            {course.description}
          </p>
        </section>

        <section className={styles.section}>
          <h2>Course Overview</h2>

          <div className={styles.overview}>
            <span>
              <label>Duration</label>
              <strong>{course.duration}</strong>
            </span>

            <span>
              <label>Type</label>
              <strong>{course.type}</strong>
            </span>

            <span>
              <label>Category</label>
              <strong>{course.category}</strong>
            </span>

            <span>
              <label>Level</label>
              <strong>{course.level || "—"}</strong>
            </span>

            <span>
              <label>Fees</label>
              <strong>{course.fees || "Contact for Fee"}</strong>
            </span>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Course Highlights</h2>

          {course.highlights.length > 0 ? (
            <ul className={styles.list}>
              {course.highlights.map((item, index) => (
                <li key={`${item}-${index}`}>
                  <Check
                    size={14}
                    className={styles.check}
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p>No highlights added.</p>
          )}
        </section>

        <section className={styles.section}>
          <h2>Skills</h2>

          {course.skills.length > 0 ? (
            <ul className={styles.list}>
              {course.skills.map((item, index) => (
                <li key={`${item}-${index}`}>
                  <Check
                    size={14}
                    className={styles.check}
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills added.</p>
          )}
        </section>

        <section className={styles.section}>
          <h2>Curriculum</h2>

          {course.curriculum.length > 0 ? (
            <ol className={styles.curriculum}>
              {course.curriculum.map((item, index) => (
                <li key={`${item.month}-${index}`}>
                  <strong>
                    Month {item.month}: {item.title}
                  </strong>

                  {item.topics?.length > 0 && (
                    <div>
                      {item.topics.join(", ")}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <p>No curriculum added.</p>
          )}
        </section>

        <section className={styles.section}>
          <h2>Projects</h2>

          {course.projects.length > 0 ? (
            <ul className={styles.list}>
              {course.projects.map((project, index) => (
                <li key={`${project.title}-${index}`}>
                  <div>
                    <strong>{project.title}</strong>

                    {project.description && (
                      <p>{project.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects added.</p>
          )}
        </section>

        <section className={styles.section}>
          <h2>Course Image</h2>

          {course.thumbnail?.url ? (
            <img
              src={course.thumbnail.url}
              alt={course.title}
              width="300"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "12px",
              }}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              No thumbnail uploaded
            </div>
          )}
        </section>
      </div>
    </div>
  );
}