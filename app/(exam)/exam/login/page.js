"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import styles from "./Login.module.css";
import Image from "next/image";

export default function ExamLoginPage() {
  const router = useRouter();

  const [rollNumber, setRollNumber] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const trimmedRollNumber = rollNumber.trim();

    if (!trimmedRollNumber) {
      setError("Please enter your roll number.");
      return;
    }

    if (!/^\d{8}$/.test(dob)) {
      setError("Date of birth must be in DDMMYYYY format.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/exam/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rollNumber: trimmedRollNumber,
          dob,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            data?.message ||
              "Invalid roll number or date of birth."
          );
          return;
        }

        if (response.status === 403) {
          setError(
            data?.message ||
              "You are not authorized to access the student portal."
          );
          return;
        }

        if (response.status === 400) {
          setError(
            data?.message ||
              "Please check your login details and try again."
          );
          return;
        }

        if (response.status === 404) {
          setError(
            data?.message ||
              "Student account was not found."
          );
          return;
        }

        if (response.status >= 500) {
          setError(
            "The server is currently unavailable. Please try again later."
          );
          return;
        }

        setError(
          data?.message ||
            "Unable to login. Please try again."
        );
        return;
      }

      router.push("/exam/dashboard");
    } catch (requestError) {
      console.error("Student login request failed:", requestError);

      setError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <section className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Image
              src="/images/logo.png"
              alt=""
              width={42}
              height={42}
              priority
              className={styles.logoIcon}
            />
          </div>

          <div>
            <span className={styles.brandName}>VTECH</span>

            <span className={styles.brandSubtext}>
              Institute of Information Technology
            </span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <LockKeyhole size={23} />
            </div>

            <span className={styles.eyebrow}>STUDENT PORTAL</span>

            <h1>Online Examination</h1>

            <p>
              Login with your roll number and date of birth to access your
              examinations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="rollNumber">Roll Number</label>

              <input
                id="rollNumber"
                type="text"
                value={rollNumber}
                onChange={(event) => {
                  setRollNumber(event.target.value);
                  setError("");
                }}
                placeholder="Enter your roll number"
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dob">Date of Birth</label>

              <div className={styles.inputWrapper}>
                <CalendarDays size={18} />

                <input
                  id="dob"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={dob}
                  onChange={(event) => {
                    const value = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 8);

                    setDob(value);
                    setError("");
                  }}
                  placeholder="DDMMYYYY"
                  autoComplete="bday"
                  disabled={loading}
                />
              </div>

              <span className={styles.helper}>
                Example: 12072006
              </span>
            </div>

            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue to Portal"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className={styles.securityNote}>
            <ShieldCheck size={17} />

            <span>
              Your examination credentials are used only to verify your
              identity.
            </span>
          </div>
        </div>

        <p className={styles.footer}>
          © {new Date().getFullYear()} VTech Institute of Information
          Technology
        </p>
      </section>
    </main>
  );
}