"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  RotateCcw,
  ShieldOff,
  Trash2,
} from "lucide-react";

import CertificateActionModal from "./CertificateActionModal";
import styles from "./Certificates.module.css";

export default function CertificateDetailActions({
  certificate,
}) {
  const router = useRouter();

  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle =
    certificate.status === "VALID"
      ? "revoke"
      : certificate.status === "REVOKED"
        ? "restore"
        : null;

  const handleConfirm = async () => {
    if (!action || !certificate?._id) {
      setAction(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const certificateId = certificate._id;

      /* =========================
         DELETE
      ========================= */

      if (action === "delete") {
        const response = await fetch(
          `/api/certificates/${certificateId}`,
          {
            method: "DELETE",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to delete certificate."
          );
        }

        setAction(null);

        router.push("/admin/certificates");
        router.refresh();

        return;
      }

      /* =========================
         REVOKE / RESTORE
      ========================= */

      if (
        action === "revoke" ||
        action === "restore"
      ) {
        const status =
          action === "revoke"
            ? "REVOKED"
            : "VALID";

        const response = await fetch(
          `/api/certificates/${certificateId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
            body: JSON.stringify({
              status,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              `Failed to ${
                action === "revoke"
                  ? "revoke"
                  : "restore"
              } certificate.`
          );
        }

        setAction(null);

        router.refresh();
      }
    } catch (actionError) {
      console.error(
        "Certificate action error:",
        actionError
      );

      setError(
        actionError.message ||
          "Failed to perform certificate action."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.detailActions}>
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={loading}
          onClick={() =>
            router.push(
              `/admin/certificates/${certificate._id}/edit`
            )
          }
        >
          <Pencil size={15} />
          Edit
        </button>

        {toggle && (
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={loading}
            onClick={() => setAction(toggle)}
          >
            {toggle === "revoke" ? (
              <ShieldOff size={15} />
            ) : (
              <RotateCcw size={15} />
            )}

            {toggle === "revoke"
              ? "Revoke"
              : "Restore"}
          </button>
        )}

        <button
          type="button"
          className={styles.dangerButton}
          disabled={loading}
          onClick={() => setAction("delete")}
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            marginTop: "8px",
            color: "var(--danger, #dc2626)",
            fontSize: "13px",
          }}
        >
          {error}
        </p>
      )}

      <CertificateActionModal
        certificate={action ? certificate : null}
        action={action}
        onCancel={() => {
          if (!loading) {
            setAction(null);
          }
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}