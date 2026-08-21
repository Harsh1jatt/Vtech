"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import DeleteCourseModal from "./DeleteCourseModal";
import styles from "./Courses.module.css";

export default function CourseDetailActions({ course }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const remove = async () => { const response = await fetch(`/api/admin/courses/${course._id}`, { method: "DELETE" }); if (response.ok) router.push("/admin/courses"); };
  return <><div className={styles.detailActions}><button type="button" className={styles.secondaryButton} onClick={() => router.push(`/admin/courses/${course._id}/edit`)}><Pencil size={15} /> Edit</button><button type="button" className={styles.dangerButton} onClick={() => setConfirming(true)}><Trash2 size={15} /> Delete</button></div><DeleteCourseModal course={confirming ? course : null} onCancel={() => setConfirming(false)} onConfirm={remove} /></>;
}