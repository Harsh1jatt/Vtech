import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Student from "@/models/Student";
import { requireAdmin } from "@/lib/adminAuth";
import StudentDetailActions from "@/components/admin/StudentDetailActions";
import StatusBadge from "@/components/admin/StatusBadge";
import styles from "@/components/admin/Students.module.css";

const date = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not provided";
const Info = ({ label, value }) => <div className={styles.infoRow}><label>{label}</label><span>{value || "Not provided"}</span></div>;

export default async function StudentDetailsPage({ params }) {
  const { id } = await params;
  await requireAdmin();
  await connectToDatabase();
  const student = mongoose.Types.ObjectId.isValid(id) ? await Student.findById(id).populate("course", "title shortTitle slug") : null;
  if (!student) return <div className={styles.empty}><h2>Student not found</h2><Link href="/admin/students" className={styles.primaryButton}>Back to students</Link></div>;
  return <div><Link href="/admin/students" className={styles.backLink}><ArrowLeft size={15} /> Back to students</Link><div className={styles.detailHeader}><div><span className={styles.eyebrow}>Learner record</span><h1>Student Details</h1><p>Review academic and personal information.</p></div><StudentDetailActions student={student} /></div><section className={styles.profilePanel}><span className={styles.profileAvatar}>{student.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><h2>{student.fullName}</h2><p>{student.rollNumber}</p></div><div className={styles.profileStatus}><StatusBadge status={student.status} /></div></section><div className={styles.detailGrid}><section className={styles.detailSection}><h2>Contact Information</h2><div className={styles.infoList}><Info label="Email" value={student.email} /><Info label="Phone" value={student.phone} /><Info label="Address" value={student.address} /></div></section><section className={styles.detailSection}><h2>Personal Information</h2><div className={styles.infoList}><Info label="Date of Birth" value={date(student.dateOfBirth)} /><Info label="Father's Name" value={student.fatherName} /><Info label="Mother's Name" value={student.motherName} /></div></section><section className={styles.detailSection}><h2>Academic Information</h2><div className={styles.infoList}><Info label="Course" value={student.course?.title} /><Info label="Roll Number" value={student.rollNumber} /><Info label="Admission Date" value={date(student.admissionDate)} /><Info label="Course Start Date" value={date(student.courseStartDate)} /><Info label="Completion Date" value={date(student.courseCompletionDate)} /></div></section><section className={styles.detailSection}><h2>Notes</h2><p className={styles.notes}>{student.notes || "No notes have been added."}</p></section></div></div>;
}
