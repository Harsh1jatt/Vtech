import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";

import CertificateDetailActions from "@/components/admin/CertificateDetailActions";
import StatusBadge from "@/components/admin/StatusBadge";

import styles from "@/components/admin/Certificates.module.css";

import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";

async function getCertificate(id) {
  try {
    if (!id) {
      return null;
    }

    await connectDB();

    const certificate = await Certificate.findById(id)
      .populate({
        path: "student",
        populate: {
          path: "course",
        },
      })
      .lean();

    if (!certificate) {
      return null;
    }

    /*
     * Convert MongoDB ObjectIds / Dates into
     * serializable values for the Server Component.
     */
    return JSON.parse(JSON.stringify(certificate));
  } catch (error) {
    console.error("Certificate fetch error:", error);
    return null;
  }
}

export default async function CertificateDetailPage({ params }) {
  const { id } = await params;

  const certificate = await getCertificate(id);

  if (!certificate) {
    return (
      <div>
        <Link
          href="/admin/certificates"
          className={styles.backLink}
        >
          <ArrowLeft size={15} />
          Back to certificates
        </Link>

        <section className={styles.empty}>
          <h2>Certificate not found</h2>

          <p>
            The certificate you are looking for does not exist.
          </p>
        </section>
      </div>
    );
  }

  const student = certificate.student;
  const course = student?.course;

  return (
    <div>
      <Link
        href="/admin/certificates"
        className={styles.backLink}
      >
        <ArrowLeft size={15} />
        Back to certificates
      </Link>

      <div className={styles.detailHeader}>
        <div>
          <span className={styles.eyebrow}>
            Verification record
          </span>

          <h1>Certificate Details</h1>

          <p>
            View certificate information and verification status.
          </p>
        </div>

        <div className={styles.detailActions}>
          <CertificateDetailActions
            certificate={certificate}
          />
        </div>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroMark}>
          <FileText size={22} />
        </div>

        <div>
          <h2>
            {certificate.certificateNumber}
          </h2>

          <p>
            {course?.title || "Course Certificate"}
          </p>
        </div>

        <div className={styles.heroStatus}>
          <StatusBadge
            status={certificate.status}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Certificate Information</h2>

        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <label>Certificate Number</label>

            <span className={styles.certificateNumber}>
              {certificate.certificateNumber}
            </span>
          </div>

          <div className={styles.infoRow}>
            <label>Status</label>

            <span>
              <StatusBadge
                status={certificate.status}
              />
            </span>
          </div>

          <div className={styles.infoRow}>
            <label>Issued On</label>

            <span>
              {certificate.createdAt
                ? new Date(
                    certificate.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "—"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Student Information</h2>

        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <label>Student Name</label>

            <span>
              {student?.fullName || "—"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <label>Roll Number</label>

            <span>
              {student?.rollNumber || "—"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <label>Phone</label>

            <span>
              {student?.phone || "—"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <label>Email</label>

            <span>
              {student?.email || "—"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <label>Course</label>

            <span>
              {course?.title || "—"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <label>Course Short Title</label>

            <span>
              {course?.shortTitle || "—"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Certificate Document</h2>

        {certificate.certificateFile?.url ? (
          <div className={styles.verification}>
            <div>
              <span className={styles.verificationCode}>
                {certificate.certificateFile.originalName ||
                  "Certificate Document"}
              </span>

              <p className={styles.notes}>
                Certificate document
              </p>
            </div>

            <a
              href={certificate.certificateFile.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              <ExternalLink size={15} />
              View Certificate
            </a>
          </div>
        ) : (
          <p className={styles.notes}>
            No certificate document has been uploaded.
          </p>
        )}
      </section>
    </div>
  );
}