"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import CertificateForm from "@/components/admin/CertificateForm";
import styles from "@/components/admin/Certificates.module.css";

export default function EditCertificatePage({
  params,
}) {
  const [certificate, setCertificate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [certificateId, setCertificateId] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCertificate() {
      try {
        setLoading(true);
        setError("");

        /*
         * Next.js 16 params can be asynchronous.
         */
        const resolvedParams =
          await params;

        const id =
          resolvedParams?.id;

        if (!id) {
          throw new Error(
            "Certificate ID is missing."
          );
        }

        if (!cancelled) {
          setCertificateId(id);
        }

        /*
         * IMPORTANT:
         *
         * Use a relative browser-side request.
         * This automatically sends the admin
         * authentication cookies.
         */
        const response = await fetch(
          `/api/certificates/${encodeURIComponent(
            id
          )}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        let result = null;

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          try {
            result =
              await response.json();
          } catch (jsonError) {
            console.error(
              "Certificate API JSON parsing failed:",
              jsonError
            );
          }
        } else {
          const text =
            await response.text();

          console.error(
            "Certificate API returned non-JSON response:",
            text
          );

          throw new Error(
            `Certificate API returned an invalid response (${response.status}).`
          );
        }

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Failed to load certificate (${response.status}).`
          );
        }

        if (
          !result?.success ||
          !result?.data
        ) {
          throw new Error(
            result?.message ||
              "Certificate not found."
          );
        }

        if (!cancelled) {
          setCertificate(
            result.data
          );
        }
      } catch (requestError) {
        console.error(
          "Edit certificate fetch error:",
          requestError
        );

        if (!cancelled) {
          setCertificate(null);

          setError(
            requestError?.message ||
              "Failed to load certificate."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCertificate();

    return () => {
      cancelled = true;
    };
  }, [params]);

  if (loading) {
    return (
      <div className={styles.empty}>
        <h2>
          Loading certificate...
        </h2>

        <p>
          Please wait while the
          certificate information is
          being loaded.
        </p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className={styles.empty}>
        <h2>
          Certificate not found
        </h2>

        {error && (
          <p
            className={styles.error}
            style={{
              marginTop: "10px",
              marginBottom: "16px",
            }}
          >
            {error}
          </p>
        )}

        <Link
          href="/admin/certificates"
          className={
            styles.primaryButton
          }
        >
          Back to certificates
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/admin/certificates/${certificateId}`}
        className={styles.backLink}
      >
        <ArrowLeft size={15} />
        Back to certificate
      </Link>

      <div
        className={styles.pageHeader}
      >
        <div>
          <span
            className={styles.eyebrow}
          >
            Verification record
          </span>

          <h1>
            Edit Certificate
          </h1>

          <p>
            Update{" "}
            {
              certificate.certificateNumber
            }{" "}
            information.
          </p>
        </div>
      </div>

      <CertificateForm
        certificate={certificate}
        submitLabel="Update Certificate"
      />
    </div>
  );
}