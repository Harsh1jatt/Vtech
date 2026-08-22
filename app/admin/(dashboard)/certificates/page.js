"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import CertificateActionModal from "@/components/admin/CertificateActionModal";
import CertificateFilters from "@/components/admin/CertificateFilters";
import CertificateTable from "@/components/admin/CertificateTable";

import styles from "@/components/admin/Certificates.module.css";

const initialFilters = {
  search: "",
  status: "",
  course: "",
};

const PAGE_SIZE = 20;

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);

  const [filters, setFilters] = useState(initialFilters);

  const [courses, setCourses] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [action, setAction] = useState(null);

  /*
   * Fetch certificates from the backend.
   */
  const fetchCertificates = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (filters.search.trim()) {
          params.set(
            "search",
            filters.search.trim()
          );
        }

        if (filters.status) {
          params.set("status", filters.status);
        }

        if (filters.course) {
          params.set("course", filters.course);
        }

        params.set("page", page.toString());
        params.set("limit", PAGE_SIZE.toString());

        const response = await fetch(
          `/api/certificates?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch certificates."
          );
        }

        setCertificates(result.data || []);

        setPagination(
          result.pagination || {
            page,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (fetchError) {
        console.error(
          "Fetch certificates error:",
          fetchError
        );

        setError(
          fetchError.message ||
            "Failed to load certificates."
        );

        setCertificates([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  /*
   * Fetch courses used by the filter.
   *
   * We derive the available courses from the returned
   * certificate records initially.
   */
  useEffect(() => {
    const courseMap = new Map();

    certificates.forEach((certificate) => {
      const course = certificate?.student?.course;

      if (course?._id) {
        courseMap.set(course._id, course);
      }
    });

    setCourses(
      Array.from(courseMap.values())
    );
  }, [certificates]);

  /*
   * Reload whenever filters change.
   */
  useEffect(() => {
    fetchCertificates(1);
  }, [fetchCertificates]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const goToPage = (page) => {
    if (page < 1) return;

    if (
      pagination.totalPages &&
      page > pagination.totalPages
    ) {
      return;
    }

    fetchCertificates(page);
  };

const confirm = async () => {
  if (!action?.certificate) {
    setAction(null);
    return;
  }

  try {
    setLoading(true);
    setError("");

    const certificateId = action.certificate._id;

    /* =========================
       DELETE CERTIFICATE
    ========================= */
    if (action.type === "delete") {
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
    }

    /* =========================
       REVOKE / RESTORE
    ========================= */
    else if (
      action.type === "revoke" ||
      action.type === "restore"
    ) {
      const status =
        action.type === "revoke"
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
              action.type === "revoke"
                ? "revoke"
                : "restore"
            } certificate.`
        );
      }
    }

    /* =========================
       REFRESH
    ========================= */

    setAction(null);

    await fetchCertificates(
      pagination.page || 1
    );
  } catch (actionError) {
    console.error(
      "Certificate action error:",
      actionError
    );

    setError(
      actionError.message ||
        "Failed to perform certificate action."
    );

    setAction(null);
  } finally {
    setLoading(false);
  }
};

  const hasCertificates = certificates.length > 0;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>
            Verification records
          </span>

          <h1>Certificates</h1>

          <p>
            Manage issued certificates and verification
            records.
          </p>
        </div>

        <Link
          href="/admin/certificates/new"
          className={styles.primaryButton}
        >
          <Plus size={17} />
          Issue Certificate
        </Link>
      </div>

      <CertificateFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
        courses={courses}
      />

      <section className={styles.panel}>
        {loading ? (
          <div className={styles.empty}>
            <h2>Loading certificates...</h2>

            <p>
              Fetching certificate records from the
              database.
            </p>
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <h2>Unable to load certificates</h2>

            <p>{error}</p>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() =>
                fetchCertificates(
                  pagination.page || 1
                )
              }
            >
              Try Again
            </button>
          </div>
        ) : !hasCertificates ? (
          <div className={styles.empty}>
            <h2>No certificates found</h2>

            <p>
              No certificate records match the current
              filters.
            </p>

            <Link
              href="/admin/certificates/new"
              className={styles.primaryButton}
            >
              <Plus size={17} />
              Issue Certificate
            </Link>
          </div>
        ) : (
          <>
            <CertificateTable
              certificates={certificates}
              onDelete={(certificate) =>
                setAction({
                  certificate,
                  type: "delete",
                })
              }
              onToggle={(certificate) =>
                setAction({
                  certificate,
                  type:
                    certificate.status === "VALID"
                      ? "revoke"
                      : "restore",
                })
              }
            />

            <div className={styles.pagination}>
              <div>
                Showing{" "}
                {Math.min(
                  (pagination.page - 1) *
                    pagination.limit +
                    1,
                  pagination.total
                )}
                -
                {Math.min(
                  pagination.page *
                    pagination.limit,
                  pagination.total
                )}{" "}
                of {pagination.total} certificates
              </div>

              {pagination.totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={
                      pagination.page <= 1
                    }
                    onClick={() =>
                      goToPage(
                        pagination.page - 1
                      )
                    }
                  >
                    Previous
                  </button>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0 8px",
                    }}
                  >
                    Page {pagination.page} of{" "}
                    {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={
                      pagination.page >=
                      pagination.totalPages
                    }
                    onClick={() =>
                      goToPage(
                        pagination.page + 1
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <CertificateActionModal
        certificate={action?.certificate}
        action={action?.type}
        onCancel={() => setAction(null)}
        onConfirm={confirm}
      />
    </div>
  );
}