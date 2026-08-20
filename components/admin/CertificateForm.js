"use client";

import Link from "next/link";
import { useState } from "react";
import CertificateFileUpload from "./CertificateFileUpload";
import { studentOptions } from "./certificateData";
import styles from "./Certificates.module.css";

export default function CertificateForm({ certificate, submitLabel = "Issue Certificate" }) {
  const [values, setValues] = useState({ certificateNumber: certificate?.certificateNumber || "", studentId: certificate?.studentId || "" });
  const [certificateFile, setCertificateFile] = useState(certificate?.certificateFile || null);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSuccess(false);
  };
  const updateFile = (file, error) => { setCertificateFile(file); setFileError(error); setErrors((current) => ({ ...current, certificateFile: "" })); setSuccess(false); };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.certificateNumber.trim()) nextErrors.certificateNumber = "This field is required.";
    if (values.certificateNumber && !/^VTECH-\d{4}-\d{5}$/.test(values.certificateNumber)) nextErrors.certificateNumber = "Use format VTECH-YYYY-NNNNN.";
    if (!values.studentId) nextErrors.studentId = "Select a student.";
    if (!certificateFile) nextErrors.certificateFile = "Certificate file is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    window.setTimeout(() => { setLoading(false); setSuccess(true); }, 500);
  };
  return <form className={styles.form} onSubmit={submit} noValidate>{success && <p className={styles.success} role="status">Certificate saved in demo mode.</p>}<section className={styles.section}><h2>Certificate Information</h2><div className={styles.formGrid}><div className={`${styles.field} ${styles.full}`}><label htmlFor="certificateNumber">Certificate Number <span className={styles.required}>*</span></label><input id="certificateNumber" name="certificateNumber" value={values.certificateNumber} onChange={update} placeholder="VTECH-2026-00125" className={styles.formMono} />{errors.certificateNumber && <span className={styles.error}>{errors.certificateNumber}</span>}</div></div></section><section className={styles.section}><h2>Student Information</h2><div className={styles.formGrid}><div className={`${styles.field} ${styles.full}`}><label htmlFor="studentId">Student <span className={styles.required}>*</span></label><select id="studentId" name="studentId" value={values.studentId} onChange={update}><option value="">Select student</option>{studentOptions.map((student) => <option key={student.id} value={student.id}>{student.name} - Enrollment: {student.enrollmentNumber} - Course: {student.course}</option>)}</select>{errors.studentId && <span className={styles.error}>{errors.studentId}</span>}</div></div></section><section className={styles.section}><h2>Certificate Document</h2><CertificateFileUpload value={certificateFile} onChange={updateFile} error={fileError || errors.certificateFile} required /></section><div className={styles.formActions}><Link href="/admin/certificates" className={styles.secondaryButton}>Cancel</Link><button type="submit" className={styles.primaryButton} disabled={loading}>{loading ? "Saving..." : submitLabel}</button></div></form>;
}
