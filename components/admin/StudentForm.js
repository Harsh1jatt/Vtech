"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { statusOptions } from "./studentData";
import styles from "./Students.module.css";

const initialValues = { fullName: "", fatherName: "", motherName: "", dateOfBirth: "", phone: "", email: "", address: "", course: "", rollNumber: "", admissionDate: "", courseStartDate: "", courseCompletionDate: "", status: "Active", notes: "" };

export default function StudentForm({ student, submitLabel = "Save Student" }) {
  const router = useRouter();
  const [values, setValues] = useState(student ? { ...initialValues, ...student, course: student.course?._id || student.course || "" } : initialValues);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/courses?limit=100")
      .then((response) => response.json())
      .then((result) => setCourses(result.courses || []))
      .catch(() => setErrors({ course: "Unable to load courses." }))
      .finally(() => setLoadingCourses(false));
  }, []);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSuccess("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    ["fullName", "phone", "course", "rollNumber", "admissionDate", "status"].forEach((field) => { if (!String(values[field] || "").trim()) nextErrors[field] = "This field is required."; });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    setSuccess("");
    const response = await fetch(student?._id ? `/api/admin/students/${student._id}` : "/api/admin/students", { method: student?._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json();
    setSubmitting(false);
    if (!response.ok) {
      setErrors(result.errors || { form: result.message || "Unable to save student." });
      return;
    }
    setSuccess(result.message || "Student saved successfully.");
    if (!student?._id) router.push(`/admin/students/${result.student._id}`);
  };

  const field = (name, label, type = "text", required = false, placeholder = "") => <div className={styles.field}><label htmlFor={name}>{label} {required && <span className={styles.required}>*</span>}</label><input id={name} name={name} type={type} value={values[name]} onChange={update} placeholder={placeholder} required={required} />{errors[name] && <span className={styles.error}>{errors[name]}</span>}</div>;

  return <form className={styles.form} onSubmit={submit} noValidate>
    {(success || errors.form) && <p className={success ? styles.success : styles.error} role="status">{success || errors.form}</p>}
    <section className={styles.formSection}><h2>Personal Information</h2><div className={styles.formGrid}>{field("fullName", "Full Name", "text", true, "Enter full name")}{field("fatherName", "Father's Name", "text", false, "Enter father's name")}{field("motherName", "Mother's Name", "text", false, "Enter mother's name")}{field("dateOfBirth", "Date of Birth", "date")}</div></section>
    <section className={styles.formSection}><h2>Contact Information</h2><div className={styles.formGrid}>{field("phone", "Phone", "tel", true, "+91 00000 00000")}{field("email", "Email", "email", false, "student@example.com")}<div className={`${styles.field} ${styles.full}`}><label htmlFor="address">Address</label><textarea id="address" name="address" value={values.address} onChange={update} placeholder="Enter current address" /></div></div></section>
    <section className={styles.formSection}><h2>Academic Information</h2><div className={styles.formGrid}>{<div className={styles.field}><label htmlFor="course">Course <span className={styles.required}>*</span></label><select id="course" name="course" value={values.course} onChange={update} disabled={loadingCourses}><option value="">{loadingCourses ? "Loading courses..." : "Select course"}</option>{courses.map((option) => <option key={option._id} value={option._id}>{option.title}</option>)}</select>{errors.course && <span className={styles.error}>{errors.course}</span>}</div>}{field("rollNumber", "Roll Number", "text", true, "VTECH-2026-000")}{field("admissionDate", "Admission Date", "date", true)}{field("courseStartDate", "Course Start Date", "date")}{field("courseCompletionDate", "Course Completion Date", "date")}{<div className={styles.field}><label htmlFor="status">Status <span className={styles.required}>*</span></label><select id="status" name="status" value={values.status} onChange={update}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></div>}<div className={`${styles.field} ${styles.full}`}><label htmlFor="notes">Notes</label><textarea id="notes" name="notes" value={values.notes} onChange={update} placeholder="Add academic or administrative notes" /></div></div></section>
    <div className={styles.formActions}><Link href="/admin/students" className={styles.secondaryButton}>Cancel</Link><button type="submit" className={styles.primaryButton} disabled={submitting}>{submitting ? "Saving..." : submitLabel}</button></div>
  </form>;
}
