"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./VerifyCertificate.module.css";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/config/site";

export default function VerifyCertificate() {
  const [certificateNumber, setCertificateNumber] =
    useState("");

  const [result, setResult] = useState(null);

  const [searched, setSearched] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showContactModal, setShowContactModal] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedNumber =
      certificateNumber.trim();

    if (!trimmedNumber) {
      setResult(null);
      setError(
        "Please enter a certificate number."
      );
      setSearched(true);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setSearched(true);

      const response = await fetch(
        `/api/certificates/verify?certificateNumber=${encodeURIComponent(
          trimmedNumber
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Certificate verification failed."
        );
      }

      if (!data.verified) {
        setResult(data.data || null);

        if (!data.data) {
          setError(
            data.message ||
              "Certificate not found."
          );
        }

        return;
      }

      setResult(data.data);
    } catch (verificationError) {
      console.error(
        "Certificate verification error:",
        verificationError
      );

      setResult(null);

      setError(
        verificationError.message ||
          "Unable to verify certificate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    result?.status === "VALID";

  const isRevoked =
    result?.status === "REVOKED";

  const isExpired =
    result?.status === "EXPIRED";

  const formattedIssueDate =
    result?.issuedOn
      ? new Date(
          result.issuedOn
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "—";

  const certificateUrl =
    result?.certificateFile?.url || "";

  const certificateFormat =
    result?.certificateFile?.format
      ?.toLowerCase() || "";

  const isPdf =
    certificateFormat === "pdf" ||
    result?.certificateFile?.resourceType ===
      "raw";

  const openContactModal = () => {
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  return (
    <main className={styles.page}>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />

        <div className={styles.container}>
          <Reveal
            className={styles.heroContent}
          >
            <span className={styles.eyebrow}>
              <ShieldCheck size={15} />
              CERTIFICATE VERIFICATION
            </span>

            <h1>
              Verify a Certificate.
              <span>
                Verify the Achievement.
              </span>
            </h1>

            <p>
              Enter a VTech certificate number
              to check certificate details and
              confirm that the certificate was
              issued by VTech Institute of
              Information Technology.
            </p>

            <div
              className={styles.heroStats}
            >
              <div>
                <ShieldCheck size={18} />
                <span>
                  Secure Verification
                </span>
              </div>

              <div>
                <BadgeCheck size={18} />
                <span>
                  Certificate Status
                </span>
              </div>

              <div>
                <Award size={18} />
                <span>
                  Verified Credentials
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          VERIFICATION
      ===================================================== */}

      <section
        className={styles.verification}
      >
        <div className={styles.container}>
          <div
            className={
              styles.verificationGrid
            }
          >
            <Reveal
              className={styles.searchPanel}
            >
              <div
                className={styles.panelHeader}
              >
                <div>
                  <span
                    className={
                      styles.panelEyebrow
                    }
                  >
                    CHECK CREDENTIAL
                  </span>

                  <h2>
                    Enter Certificate Number
                  </h2>
                </div>

                <div
                  className={styles.searchIcon}
                >
                  <Search size={20} />
                </div>
              </div>

              <p
                className={
                  styles.panelDescription
                }
              >
                Enter the unique certificate
                number printed on the student
                certificate.
              </p>

              <form
                onSubmit={handleSubmit}
                className={
                  styles.searchForm
                }
              >
                <label htmlFor="certificate-number">
                  Certificate Number
                </label>

                <div
                  className={
                    styles.inputWrapper
                  }
                >
                  <Hash size={17} />

                  <input
                    id="certificate-number"
                    type="text"
                    value={certificateNumber}
                    onChange={(event) =>
                      setCertificateNumber(
                        event.target.value
                      )
                    }
                    placeholder="e.g. VTECH-2026-00124"
                    autoComplete="off"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className={
                    styles.verifyButton
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Verifying..."
                    : "Verify Certificate"}

                  {!loading && (
                    <ArrowRight size={17} />
                  )}
                </button>
              </form>

              {error && (
                <div
                  role="alert"
                  style={{
                    marginTop: "16px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    fontSize: "14px",
                  }}
                >
                  <AlertTriangle
                    size={17}
                  />

                  <span>{error}</span>
                </div>
              )}
            </Reveal>

            {/* =================================================
                RESULT
            ================================================= */}

            <Reveal
              className={
                styles.resultPanel
              }
              delay={120}
            >
              {loading ? (
                <div
                  className={
                    styles.emptyResult
                  }
                >
                  <div>
                    <Search size={28} />
                  </div>

                  <h3>
                    Verifying Certificate...
                  </h3>

                  <p>
                    Checking the certificate
                    number against VTech
                    Institute records.
                  </p>
                </div>
              ) : searched && result ? (
                <>
                  {/* STATUS */}

                  <div
                    className={
                      styles.resultTop
                    }
                  >
                    <div
                      className={
                        isValid
                          ? styles.verifiedBadge
                          : styles.demoBadge
                      }
                    >
                      {isValid ? (
                        <>
                          <CheckCircle2
                            size={18}
                          />
                          Certificate Verified
                        </>
                      ) : isRevoked ? (
                        <>
                          <XCircle
                            size={18}
                          />
                          Certificate Revoked
                        </>
                      ) : (
                        <>
                          <AlertTriangle
                            size={18}
                          />
                          Certificate Expired
                        </>
                      )}
                    </div>

                    <span
                      className={
                        styles.demoBadge
                      }
                    >
                      {result.status}
                    </span>
                  </div>

                  {/* =================================================
                      ORIGINAL CERTIFICATE PREVIEW
                  ================================================= */}

                  {isValid &&
                  certificateUrl ? (
                    <div
                      style={{
                        marginTop: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          gap: "12px",
                          marginBottom:
                            "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "8px",
                          }}
                        >
                          <FileText
                            size={18}
                          />

                          <strong>
                            Original Certificate
                          </strong>
                        </div>
                      </div>

                      <div
                        onClick={
                          openContactModal
                        }
                        onContextMenu={(
                          event
                        ) =>
                          event.preventDefault()
                        }
                        style={{
                          position:
                            "relative",
                          width: "100%",
                          minHeight:
                            "420px",
                          overflow:
                            "hidden",
                          borderRadius:
                            "14px",
                          border:
                            "1px solid var(--border, #e5e7eb)",
                          background:
                            "#f8fafc",
                          cursor: "pointer",
                        }}
                        title="Contact VTech Institute to request access to the certificate document"
                      >
                        {isPdf ? (
                          <iframe
                            src={
                              certificateUrl
                            }
                            title="Certificate Preview"
                            style={{
                              width: "100%",
                              height:
                                "420px",
                              border:
                                "none",
                              pointerEvents:
                                "none",
                              userSelect:
                                "none",
                            }}
                          />
                        ) : (
                          <img
                            src={
                              certificateUrl
                            }
                            alt="Certificate"
                            draggable={
                              false
                            }
                            onDragStart={(
                              event
                            ) =>
                              event.preventDefault()
                            }
                            style={{
                              display:
                                "block",
                              width: "100%",
                              height:
                                "420px",
                              objectFit:
                                "contain",
                              userSelect:
                                "none",
                              pointerEvents:
                                "none",
                            }}
                          />
                        )}

                        {/* Non-interactive protective overlay */}

                        <div
                          style={{
                            position:
                              "absolute",
                            inset: 0,
                            zIndex: 2,
                            background:
                              "transparent",
                          }}
                        />

                        {/* Bottom access message */}

                        <div
                          style={{
                            position:
                              "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 3,
                            padding:
                              "14px",
                            textAlign:
                              "center",
                            background:
                              "rgba(255,255,255,0.94)",
                            backdropFilter:
                              "blur(8px)",
                            borderTop:
                              "1px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          <span
                            style={{
                              fontSize:
                                "13px",
                              fontWeight:
                                600,
                            }}
                          >
                            Click to contact
                            VTech Institute
                            for certificate
                            access
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          marginTop:
                            "10px",
                          fontSize:
                            "13px",
                          opacity: 0.7,
                        }}
                      >
                        Certificate No:{" "}
                        {
                          result.certificateNumber
                        }
                      </p>
                    </div>
                  ) : (
                    <div
                      className={
                        styles.emptyResult
                      }
                    >
                      <div>
                        <FileText
                          size={28}
                        />
                      </div>

                      <h3>
                        Certificate Document
                        Unavailable
                      </h3>

                      <p>
                        The certificate was
                        verified, but its
                        document is not
                        currently available
                        for online preview.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={
                    styles.emptyResult
                  }
                >
                  <div>
                    <Search size={28} />
                  </div>

                  <h3>
                    Enter a Certificate
                    Number
                  </h3>

                  <p>
                    Your certificate
                    verification result will
                    appear here.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          DETAILS
      ===================================================== */}

      {searched && result && (
        <section
          className={styles.details}
        >
          <div className={styles.container}>
            <Reveal
              className={
                styles.sectionHeading
              }
            >
              <span
                className={styles.eyebrow}
              >
                VERIFICATION DETAILS
              </span>

              <h2>
                Certificate
                <span>Information</span>
              </h2>

              <p>
                Here are the certificate
                details recorded by VTech
                Institute of Information
                Technology.
              </p>
            </Reveal>

            <div
              className={
                styles.detailsGrid
              }
            >
              <Reveal
                className={
                  styles.detailCard
                }
              >
                <div
                  className={
                    styles.detailIcon
                  }
                >
                  <UserRound size={19} />
                </div>

                <span>
                  Student Name
                </span>

                <strong>
                  {result.student?.name ||
                    "—"}
                </strong>
              </Reveal>

              <Reveal
                className={
                  styles.detailCard
                }
                delay={70}
              >
                <div
                  className={
                    styles.detailIcon
                  }
                >
                  <GraduationCap
                    size={19}
                  />
                </div>

                <span>Course</span>

                <strong>
                  {result.course
                    ?.shortTitle ||
                    result.course
                      ?.title ||
                    "—"}
                </strong>
              </Reveal>

              <Reveal
                className={
                  styles.detailCard
                }
                delay={140}
              >
                <div
                  className={
                    styles.detailIcon
                  }
                >
                  <CalendarDays
                    size={19}
                  />
                </div>

                <span>
                  Issue Date
                </span>

                <strong>
                  {formattedIssueDate}
                </strong>
              </Reveal>

              <Reveal
                className={
                  styles.detailCard
                }
                delay={210}
              >
                <div
                  className={
                    styles.detailIcon
                  }
                >
                  <Hash size={19} />
                </div>

                <span>
                  Certificate Number
                </span>

                <strong>
                  {
                    result.certificateNumber
                  }
                </strong>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        className={
          styles.howItWorks
        }
      >
        <div className={styles.container}>
          <Reveal
            className={
              styles.sectionHeading
            }
          >
            <span
              className={styles.eyebrow}
            >
              SIMPLE &amp; FAST
            </span>

            <h2>
              How Certificate
              <span>
                Verification Works
              </span>
            </h2>

            <p>
              Checking a VTech certificate
              is simple for employers,
              institutions and students.
            </p>
          </Reveal>

          <div className={styles.steps}>
            <Reveal
              className={styles.step}
            >
              <span
                className={
                  styles.stepNumber
                }
              >
                01
              </span>

              <div
                className={
                  styles.stepIcon
                }
              >
                <Hash size={21} />
              </div>

              <h3>
                Enter Certificate
                Number
              </h3>

              <p>
                Enter the unique
                certificate number
                printed on the
                certificate.
              </p>
            </Reveal>

            <Reveal
              className={styles.step}
              delay={100}
            >
              <span
                className={
                  styles.stepNumber
                }
              >
                02
              </span>

              <div
                className={
                  styles.stepIcon
                }
              >
                <Search size={21} />
              </div>

              <h3>Verify</h3>

              <p>
                The system checks the
                certificate number
                against the institute&apos;s
                records.
              </p>
            </Reveal>

            <Reveal
              className={styles.step}
              delay={200}
            >
              <span
                className={
                  styles.stepNumber
                }
              >
                03
              </span>

              <div
                className={
                  styles.stepIcon
                }
              >
                <BadgeCheck size={21} />
              </div>

              <h3>
                View Result
              </h3>

              <p>
                Certificate information
                and its current
                verification status are
                displayed.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className={styles.cta}>
        <div className={styles.ctaGlow} />

        <div className={styles.container}>
          <Reveal
            className={
              styles.ctaContent
            }
          >
            <span
              className={
                styles.ctaEyebrow
              }
            >
              VTECH CREDENTIALS
            </span>

            <h2>
              Have a Certificate
              <span>to Verify?</span>
            </h2>

            <p>
              Use the verification system
              above to check certificate
              information. For any questions
              regarding a certificate,
              contact VTech Institute
              directly.
            </p>

            <Link
              href="/contact"
              className={styles.ctaButton}
            >
              Contact VTech
              <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          CONTACT MODAL
      ===================================================== */}

      {showContactModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-contact-title"
          onClick={closeContactModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background:
              "rgba(0, 0, 0, 0.65)",
            backdropFilter:
              "blur(8px)",
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "440px",
              padding: "28px",
              borderRadius: "20px",
              background:
                "var(--surface, #ffffff)",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.25)",
            }}
          >
            <button
              type="button"
              onClick={
                closeContactModal
              }
              aria-label="Close"
              style={{
                position:
                  "absolute",
                top: "14px",
                right: "14px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                border: "none",
                borderRadius:
                  "50%",
                background:
                  "rgba(0,0,0,0.06)",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>

            <div
              style={{
                width: "52px",
                height: "52px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                marginBottom:
                  "16px",
                borderRadius:
                  "14px",
                background:
                  "rgba(21,128,61,0.1)",
              }}
            >
              <ShieldCheck
                size={25}
              />
            </div>

            <h2
              id="certificate-contact-title"
              style={{
                margin: "0 0 10px",
              }}
            >
              Contact VTech Institute
            </h2>

            <p
              style={{
                margin:
                  "0 0 22px",
                lineHeight: 1.6,
                opacity: 0.75,
              }}
            >
              For security and certificate
              protection, downloading or
              opening the certificate in a
              separate viewer is restricted.
              Please contact the institute
              if you need access to the
              certificate document.
            </p>

            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                  padding:
                    "13px 15px",
                  borderRadius:
                    "12px",
                  textDecoration:
                    "none",
                  border:
                    "1px solid rgba(0,0,0,0.08)",
                  color:
                    "inherit",
                }}
              >
                <Mail size={18} />

                <span>
                  {CONTACT_EMAIL}
                </span>
              </a>

              <a
                href={`tel:${CONTACT_PHONE}`}
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                  padding:
                    "13px 15px",
                  borderRadius:
                    "12px",
                  textDecoration:
                    "none",
                  border:
                    "1px solid rgba(0,0,0,0.08)",
                  color:
                    "inherit",
                }}
              >
                <Phone size={18} />

                <span>
                  {CONTACT_PHONE}
                </span>
              </a>
            </div>

            <button
              type="button"
              onClick={
                closeContactModal
              }
              style={{
                width: "100%",
                marginTop: "18px",
                padding:
                  "12px 16px",
                border: "none",
                borderRadius:
                  "11px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}