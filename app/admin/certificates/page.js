"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import CertificateActionModal from "@/components/admin/CertificateActionModal";
import CertificateFilters from "@/components/admin/CertificateFilters";
import CertificateTable from "@/components/admin/CertificateTable";
import { demoCertificates, getStudentById } from "@/components/admin/certificateData";
import styles from "@/components/admin/Certificates.module.css";

const initialFilters = { search: "", status: "", course: "" };

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState(demoCertificates);
  const [filters, setFilters] = useState(initialFilters);
  const [action, setAction] = useState(null);
  const filtered = useMemo(() => certificates.map((certificate) => ({ ...certificate, student: getStudentById(certificate.studentId) })).filter((certificate) => certificate.student).filter((item) => { const student = item.student; const query = filters.search.trim().toLowerCase(); const matchesSearch = !query || [item.certificateNumber, student.fullName, student.enrollmentNumber, student.course].some((value) => value.toLowerCase().includes(query)); return matchesSearch && (!filters.status || item.status === filters.status) && (!filters.course || student.course === filters.course); }), [certificates, filters]);
  const confirm = () => { if (action.type === "delete") setCertificates((current) => current.filter((item) => item.id !== action.certificate.id)); else setCertificates((current) => current.map((item) => item.id === action.certificate.id ? { ...item, status: action.type === "revoke" ? "REVOKED" : "VALID" } : item)); setAction(null); };
  return <div><div className={styles.pageHeader}><div><span className={styles.eyebrow}>Verification records</span><h1>Certificates</h1><p>Manage issued certificates and verification records.</p></div><Link href="/admin/certificates/new" className={styles.primaryButton}><Plus size={17} /> Issue Certificate</Link></div><CertificateFilters filters={filters} onChange={setFilters} onClear={() => setFilters(initialFilters)} /><section className={styles.panel}><CertificateTable certificates={filtered} onDelete={(certificate) => setAction({ certificate, type: "delete" })} onToggle={(certificate) => setAction({ certificate, type: certificate.status === "VALID" ? "revoke" : "restore" })} />{filtered.length > 0 && <div className={styles.pagination}>Showing 1-{filtered.length} of {filtered.length} certificates</div>}</section><CertificateActionModal certificate={action?.certificate} action={action?.type} onCancel={() => setAction(null)} onConfirm={confirm} /></div>;
}
