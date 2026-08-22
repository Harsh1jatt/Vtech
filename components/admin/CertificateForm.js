"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import CertificateFileUpload from "./CertificateFileUpload";
import styles from "./Certificates.module.css";

export default function CertificateForm({
  certificate = null,
  submitLabel = "Issue Certificate",
}) {
  const isEdit = Boolean(
    certificate?._id ||
      certificate?.id
  );

  const certificateId =
    certificate?._id ||
    certificate?.id ||
    "";

  /*
   * Normalize MongoDB ObjectId into
   * a plain string for client-side usage.
   */
  const normalizedCertificateId =
    certificateId?.toString() || "";

  /*
   * Existing Cloudinary certificate file
   * is converted into the structure expected
   * by CertificateFileUpload.
   */
  const existingCertificateFile =
    certificate?.certificateFile
      ? {
          url:
            certificate.certificateFile
              .url || "",
          publicId:
            certificate.certificateFile
              .publicId || "",
          name:
            certificate.certificateFile
              .originalName ||
            "Certificate document",
          type:
            certificate.certificateFile
              .resourceType === "raw"
              ? "application/pdf"
              : certificate.certificateFile
                    .format === "png"
                ? "image/png"
                : certificate.certificateFile
                      .format === "jpg" ||
                    certificate.certificateFile
                      .format === "jpeg"
                  ? "image/jpeg"
                  : "application/octet-stream",
          size: 0,
          previewUrl:
            certificate.certificateFile
              .url || null,
          resourceType:
            certificate.certificateFile
              .resourceType || "",
          format:
            certificate.certificateFile
              .format || "",
          isExisting: true,
        }
      : null;

  const [values, setValues] =
    useState({
      certificateNumber:
        certificate?.certificateNumber ||
        "",

      studentId:
        certificate?.student?._id
          ?.toString() ||
        certificate?.studentId
          ?.toString() ||
        "",
    });

  const [students, setStudents] =
    useState([]);

  const [studentsLoading, setStudentsLoading] =
    useState(true);

  const [certificateFile, setCertificateFile] =
    useState(
      existingCertificateFile
    );

  const [errors, setErrors] =
    useState({});

  const [fileError, setFileError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [apiError, setApiError] =
    useState("");

  /* =====================================================
     Load students
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchStudents() {
      try {
        setStudentsLoading(true);
        setApiError("");

        const response =
          await fetch(
            "/api/students?status=Completed&limit=100",
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
          result =
            await response.json();
        } else {
          const text =
            await response.text();

          throw new Error(
            text ||
              "Students API returned an invalid response."
          );
        }

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              "Failed to load students."
          );
        }

        if (!cancelled) {
          setStudents(
            result.students || []
          );
        }
      } catch (error) {
        console.error(
          "Fetch students error:",
          error
        );

        if (!cancelled) {
          setStudents([]);

          setApiError(
            error?.message ||
              "Failed to load students."
          );
        }
      } finally {
        if (!cancelled) {
          setStudentsLoading(
            false
          );
        }
      }
    }

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     Update form
  ===================================================== */

  const update = (event) => {
    const {
      name,
      value,
    } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setApiError("");
    setSuccess("");
  };

  /* =====================================================
     Update file
  ===================================================== */

  const updateFile = (
    file,
    error
  ) => {
    setCertificateFile(file);
    setFileError(error || "");

    setErrors((current) => ({
      ...current,
      certificateFile: "",
    }));

    setApiError("");
    setSuccess("");
  };

  /* =====================================================
     Submit
  ===================================================== */

  const submit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (
      !values.certificateNumber.trim()
    ) {
      nextErrors.certificateNumber =
        "Certificate number is required.";
    }

    if (!values.studentId) {
      nextErrors.studentId =
        "Select a student.";
    }

    /*
     * File is required only while issuing.
     *
     * During edit the existing Cloudinary
     * file can remain unchanged.
     */
    if (
      !isEdit &&
      !certificateFile
    ) {
      nextErrors.certificateFile =
        "Certificate file is required.";
    }

    if (fileError) {
      nextErrors.certificateFile =
        fileError;
    }

    setErrors(nextErrors);
    setApiError("");
    setSuccess("");

    if (
      Object.keys(nextErrors).length >
      0
    ) {
      return;
    }

    /* ===================================================
       FormData
    =================================================== */

    const formData =
      new FormData();

    formData.append(
      "certificateNumber",
      values.certificateNumber.trim()
    );

    formData.append(
      "studentId",
      values.studentId
    );

    /*
     * Preserve existing status while editing.
     *
     * For new certificates the default is VALID.
     */
    formData.append(
      "status",
      certificate?.status ||
        "VALID"
    );

    /*
     * Only append an actual NEW File.
     *
     * Existing Cloudinary file is an object,
     * not a browser File.
     */
    if (
      certificateFile?.file instanceof
      File
    ) {
      formData.append(
        "certificateFile",
        certificateFile.file
      );
    }

    try {
      setLoading(true);

      const url = isEdit
        ? `/api/certificates/${encodeURIComponent(
            normalizedCertificateId
          )}`
        : "/api/certificates";

      const method = isEdit
        ? "PUT"
        : "POST";

      console.log(
        `${method} ${url}`
      );

      const response =
        await fetch(url, {
          method,
          credentials: "include",
          body: formData,
        });

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
        } catch (error) {
          console.error(
            "JSON parsing failed:",
            error
          );
        }
      } else {
        const text =
          await response.text();

        console.error(
          "Non-JSON response from:",
          url,
          text
        );
      }

      /* =================================================
         HTTP error
      ================================================= */

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Request failed with status ${response.status}.`
        );
      }

      /* =================================================
         Invalid response
      ================================================= */

      if (!result) {
        throw new Error(
          "The server returned an empty or invalid response. Check the terminal for the API error."
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Operation failed."
        );
      }

      /* =================================================
         SUCCESS
      ================================================= */

      setSuccess(
        result.message ||
          (isEdit
            ? "Certificate updated successfully."
            : "Certificate issued successfully.")
      );

      /*
       * Return to certificate list.
       */
      window.setTimeout(() => {
        window.location.href =
          "/admin/certificates";
      }, 700);
    } catch (error) {
      console.error(
        "Certificate submit error:",
        error
      );

      setApiError(
        error?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <form
      className={styles.form}
      onSubmit={submit}
      noValidate
    >
      {apiError && (
        <p
          className={styles.error}
          role="alert"
          style={{
            background:
              "#fbe9e8",
            border:
              "1px solid #efc7c4",
            borderRadius: "8px",
            padding:
              "11px 13px",
          }}
        >
          {apiError}
        </p>
      )}

      {success && (
        <p
          className={styles.success}
          role="status"
        >
          {success}
        </p>
      )}

      {/* =================================================
          Certificate Information
      ================================================= */}

      <section
        className={styles.section}
      >
        <h2>
          Certificate Information
        </h2>

        <div
          className={
            styles.formGrid
          }
        >
          <div
            className={`${styles.field} ${styles.full}`}
          >
            <label htmlFor="certificateNumber">
              Certificate Number{" "}
              <span
                className={
                  styles.required
                }
              >
                *
              </span>
            </label>

            <input
              id="certificateNumber"
              name="certificateNumber"
              value={
                values.certificateNumber
              }
              onChange={update}
              placeholder="Enter certificate number"
              className={
                styles.formMono
              }
              disabled={loading}
              autoComplete="off"
            />

            {errors.certificateNumber && (
              <span
                className={
                  styles.error
                }
              >
                {
                  errors.certificateNumber
                }
              </span>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          Student Information
      ================================================= */}

      <section
        className={styles.section}
      >
        <h2>
          Student Information
        </h2>

        <div
          className={
            styles.formGrid
          }
        >
          <div
            className={`${styles.field} ${styles.full}`}
          >
            <label htmlFor="studentId">
              Student{" "}
              <span
                className={
                  styles.required
                }
              >
                *
              </span>
            </label>

            <select
              id="studentId"
              name="studentId"
              value={
                values.studentId
              }
              onChange={update}
              disabled={
                loading ||
                studentsLoading
              }
            >
              <option value="">
                {studentsLoading
                  ? "Loading completed students..."
                  : "Select student"}
              </option>

              {students.map(
                (student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {
                      student.fullName
                    }
                    {" - Roll No: "}
                    {
                      student.rollNumber
                    }
                    {" - Course: "}
                    {student.course
                      ?.title ||
                      "N/A"}
                  </option>
                )
              )}
            </select>

            {errors.studentId && (
              <span
                className={
                  styles.error
                }
              >
                {
                  errors.studentId
                }
              </span>
            )}

            {!studentsLoading &&
              students.length ===
                0 &&
              !apiError && (
                <span
                  className={
                    styles.error
                  }
                >
                  No completed
                  students found.
                </span>
              )}
          </div>
        </div>
      </section>

      {/* =================================================
          Certificate Document
      ================================================= */}

      <section
        className={styles.section}
      >
        <h2>
          Certificate Document
        </h2>

        <CertificateFileUpload
          value={certificateFile}
          onChange={updateFile}
          error={
            fileError ||
            errors.certificateFile
          }
          required={!isEdit}
        />

        {isEdit &&
          certificateFile?.url &&
          !(
            certificateFile?.file instanceof
            File
          ) && (
            <p
              className={
                styles.notes
              }
            >
              Existing certificate
              document will remain
              unchanged unless you
              select a new file.
            </p>
          )}
      </section>

      {/* =================================================
          Actions
      ================================================= */}

      <div
        className={
          styles.formActions
        }
      >
        <Link
          href="/admin/certificates"
          className={
            styles.secondaryButton
          }
        >
          Cancel
        </Link>

        <button
          type="submit"
          className={
            styles.primaryButton
          }
          disabled={
            loading ||
            studentsLoading
          }
        >
          {loading
            ? isEdit
              ? "Updating Certificate..."
              : "Issuing Certificate..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
}