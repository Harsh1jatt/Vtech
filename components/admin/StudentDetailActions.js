"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import DeleteStudentModal from "./DeleteStudentModal";
import styles from "./Students.module.css";

export default function StudentDetailActions({ student }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  return <><div className={styles.detailActions}><button type="button" className={styles.secondaryButton} onClick={() => router.push(`/admin/students/${student.id}/edit`)}><Pencil size={15} /> Edit</button><button type="button" className={styles.dangerButton} onClick={() => setConfirming(true)}><Trash2 size={15} /> Delete</button></div><DeleteStudentModal student={confirming ? student : null} onCancel={() => setConfirming(false)} onConfirm={() => router.push("/admin/students")} /></>;
}