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
  const course = mongoose.Types.ObjectId.isValid(id) ? await Course.findById(id) : await Course.findOne({ slug: id });
  if (!course) return <div className={styles.empty}><h2>Course not found</h2><Link href="/admin/courses" className={styles.primaryButton}>Back to courses</Link></div>;
  return <div><Link href="/admin/courses" className={styles.backLink}><ArrowLeft size={15} /> Back to courses</Link><div className={styles.detailHeader}><div><span className={styles.eyebrow}>Programme record</span><h1>Course Details</h1><p>Review programme information and curriculum.</p></div><CourseDetailActions course={course} /></div><section className={styles.hero}><span className={styles.heroMark}>{course.shortTitle.slice(0, 3)}</span><div><h2>{course.title}</h2><p>{course.shortTitle}</p></div><div className={styles.heroStatus}><StatusBadge status={course.status} /></div></section><div className={styles.detailGrid}><section className={`${styles.section} ${styles.full}`}><h2>Description</h2><p className={styles.notes}>{course.description}</p></section><section className={styles.section}><h2>Course Overview</h2><div className={styles.overview}><span><label>Duration</label><strong>{course.duration}</strong></span><span><label>Type</label><strong>{course.type}</strong></span><span><label>Category</label><strong>{course.category}</strong></span></div></section><section className={styles.section}><h2>Course Highlights</h2><ul className={styles.list}>{course.highlights.map((item) => <li key={item}><Check size={14} className={styles.check} />{item}</li>)}</ul></section><section className={styles.section}><h2>Curriculum</h2><ol className={styles.curriculum}>{course.curriculum.map((item) => <li key={item.month}><strong>Month {item.month}: {item.title}</strong><div>{item.topics.join(", ")}</div></li>)}</ol></section><section className={styles.section}><h2>Course Image</h2><div className={styles.imagePlaceholder}>{course.thumbnail?.url || "No thumbnail uploaded"}</div></section></div></div>;
}