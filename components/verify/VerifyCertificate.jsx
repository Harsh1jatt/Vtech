"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Hash,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./VerifyCertificate.module.css";

const DEMO_CERTIFICATE = {
  certificateNo: "VTECH-2026-00124",
  studentName: "Harshdeep Singh",
  course: "Advanced Diploma in Computer Applications",
  courseShort: "ADCA",
  issueDate: "18 August 2026",
  duration: "12 Months",
  status: "Verified",
  institute: "VTech Institute of Information Technology",
};

export default function VerifyCertificate() {
  const [certificateNumber, setCertificateNumber] = useState(
    DEMO_CERTIFICATE.certificateNo
  );
  const [result, setResult] = useState(DEMO_CERTIFICATE);
  const [searched, setSearched] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!certificateNumber.trim()) {
      setResult(null);
      setSearched(true);
      return;
    }

    // Dummy verification for client demonstration.
    // Replace this later with the real API/database request.
    setResult({
      ...DEMO_CERTIFICATE,
      certificateNo: certificateNumber.trim().toUpperCase(),
    });

    setSearched(true);
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
          <Reveal className={styles.heroContent}>
            <span className={styles.eyebrow}>
              <ShieldCheck size={15} />
              CERTIFICATE VERIFICATION
            </span>

            <h1>
              Verify a Certificate.
              <span>Verify the Achievement.</span>
            </h1>

            <p>
              Enter a VTech certificate number to check certificate details
              and confirm that the certificate was issued by VTech Institute
              of Information Technology.
            </p>

            <div className={styles.heroStats}>
              <div>
                <ShieldCheck size={18} />
                <span>Secure Verification</span>
              </div>

              <div>
                <BadgeCheck size={18} />
                <span>Certificate Status</span>
              </div>

              <div>
                <Award size={18} />
                <span>Verified Credentials</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          VERIFICATION
      ===================================================== */}

      <section className={styles.verification}>
        <div className={styles.container}>
          <div className={styles.verificationGrid}>
            <Reveal className={styles.searchPanel}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.panelEyebrow}>
                    CHECK CREDENTIAL
                  </span>

                  <h2>Enter Certificate Number</h2>
                </div>

                <div className={styles.searchIcon}>
                  <Search size={20} />
                </div>
              </div>

              <p className={styles.panelDescription}>
                Enter the unique certificate number printed on the student
                certificate.
              </p>

              <form onSubmit={handleSubmit} className={styles.searchForm}>
                <label htmlFor="certificate-number">
                  Certificate Number
                </label>

                <div className={styles.inputWrapper}>
                  <Hash size={17} />

                  <input
                    id="certificate-number"
                    type="text"
                    value={certificateNumber}
                    onChange={(event) =>
                      setCertificateNumber(event.target.value)
                    }
                    placeholder="e.g. VTECH-2026-00124"
                    autoComplete="off"
                  />
                </div>

                <button type="submit" className={styles.verifyButton}>
                  Verify Certificate
                  <ArrowRight size={17} />
                </button>
              </form>

              <div className={styles.demoNotice}>
                <span>DEMO MODE</span>
                <p>
                  This is a sample verification interface for demonstration
                  purposes. Live certificate verification will be connected
                  later.
                </p>
              </div>
            </Reveal>

            {/* =================================================
                RESULT
            ================================================= */}

            <Reveal
              className={styles.resultPanel}
              delay={120}
            >
              {searched && result ? (
                <>
                  <div className={styles.resultTop}>
                    <div className={styles.verifiedBadge}>
                      <CheckCircle2 size={18} />
                      Certificate Verified
                    </div>

                    <span className={styles.demoBadge}>DEMO</span>
                  </div>

                  <div className={styles.certificatePreview}>
                    <div className={styles.certificateTop}>
                      <div className={styles.certificateLogo}>
                        <GraduationCap size={23} />
                      </div>

                      <div>
                        <span>VTECH INSTITUTE</span>
                        <strong>
                          OF INFORMATION TECHNOLOGY
                        </strong>
                      </div>
                    </div>

                    <div className={styles.certificateLine} />

                    <span className={styles.certificateLabel}>
                      CERTIFICATE OF COMPLETION
                    </span>

                    <p className={styles.certificateStudent}>
                      {result.studentName}
                    </p>

                    <p className={styles.certificateText}>
                      has successfully completed the
                    </p>

                    <p className={styles.certificateCourse}>
                      {result.course}
                    </p>

                    <div className={styles.certificateFooter}>
                      <div>
                        <span>Certificate No.</span>
                        <strong>{result.certificateNo}</strong>
                      </div>

                      <div>
                        <span>Issue Date</span>
                        <strong>{result.issueDate}</strong>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.emptyResult}>
                  <div>
                    <Search size={28} />
                  </div>

                  <h3>Enter a Certificate Number</h3>

                  <p>
                    Your certificate verification result will appear here.
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
        <section className={styles.details}>
          <div className={styles.container}>
            <Reveal className={styles.sectionHeading}>
              <span className={styles.eyebrow}>
                VERIFICATION DETAILS
              </span>

              <h2>
                Certificate
                <span>Information</span>
              </h2>

              <p>
                Here is an example of how certificate information can be
                presented after successful verification.
              </p>
            </Reveal>

            <div className={styles.detailsGrid}>
              <Reveal className={styles.detailCard}>
                <div className={styles.detailIcon}>
                  <UserRound size={19} />
                </div>

                <span>Student Name</span>
                <strong>{result.studentName}</strong>
              </Reveal>

              <Reveal
                className={styles.detailCard}
                delay={70}
              >
                <div className={styles.detailIcon}>
                  <GraduationCap size={19} />
                </div>

                <span>Course</span>
                <strong>{result.courseShort}</strong>
              </Reveal>

              <Reveal
                className={styles.detailCard}
                delay={140}
              >
                <div className={styles.detailIcon}>
                  <CalendarDays size={19} />
                </div>

                <span>Issue Date</span>
                <strong>{result.issueDate}</strong>
              </Reveal>

              <Reveal
                className={styles.detailCard}
                delay={210}
              >
                <div className={styles.detailIcon}>
                  <Hash size={19} />
                </div>

                <span>Certificate Number</span>
                <strong>{result.certificateNo}</strong>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <Reveal className={styles.sectionHeading}>
            <span className={styles.eyebrow}>
              SIMPLE &amp; FAST
            </span>

            <h2>
              How Certificate
              <span>Verification Works</span>
            </h2>

            <p>
              The final verification system can make checking a VTech
              certificate simple for employers, institutions and students.
            </p>
          </Reveal>

          <div className={styles.steps}>
            <Reveal className={styles.step}>
              <span className={styles.stepNumber}>01</span>

              <div className={styles.stepIcon}>
                <Hash size={21} />
              </div>

              <h3>Enter Certificate Number</h3>

              <p>
                Enter the unique certificate number printed on the
                certificate.
              </p>
            </Reveal>

            <Reveal
              className={styles.step}
              delay={100}
            >
              <span className={styles.stepNumber}>02</span>

              <div className={styles.stepIcon}>
                <Search size={21} />
              </div>

              <h3>Verify</h3>

              <p>
                The system checks the certificate number against the
                institute&apos;s records.
              </p>
            </Reveal>

            <Reveal
              className={styles.step}
              delay={200}
            >
              <span className={styles.stepNumber}>03</span>

              <div className={styles.stepIcon}>
                <BadgeCheck size={21} />
              </div>

              <h3>View Result</h3>

              <p>
                Verified certificates display the student and certificate
                information.
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
          <Reveal className={styles.ctaContent}>
            <span className={styles.ctaEyebrow}>
              VTECH CREDENTIALS
            </span>

            <h2>
              Have a Certificate
              <span>to Verify?</span>
            </h2>

            <p>
              Use the verification system above to check certificate
              information. For any questions regarding a certificate,
              contact VTech Institute directly.
            </p>

            <Link href="/contact" className={styles.ctaButton}>
              Contact VTech
              <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}