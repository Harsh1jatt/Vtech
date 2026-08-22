import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CertificateForm from "@/components/admin/CertificateForm";
import styles from "@/components/admin/Certificates.module.css";

export default function NewCertificatePage() {
  return (
    <div>
      <Link
        href="/admin/certificates"
        className={styles.backLink}
      >
        <ArrowLeft size={15} />
        Back to certificates
      </Link>

      <div className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>
            Verification records
          </span>

          <h1>Issue Certificate</h1>

          <p>
            Create a new certificate record for a
            completed course.
          </p>
        </div>
      </div>

      <CertificateForm />
    </div>
  );
}