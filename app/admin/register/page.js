"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import styles from "./Register.module.css";
import Image from "next/image";

export default function AdminRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <section className={styles.wrapper}>
        <div className={styles.brand}>
          <div className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="VTech Institute of Information Technology"
            width={46}
            height={46}
            priority
          />
        </div>
          <div>
            <div className={styles.brandName}>VTECH</div>
            <div className={styles.brandSubtitle}>
              Institute of Information Technology
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <ShieldCheck size={22} strokeWidth={2} />
          </div>

          <div className={styles.heading}>
            <span>ADMIN SETUP</span>
            <h1>Create account</h1>
            <p>
              Create the administrator account for the VTech management
              portal.
            </p>
          </div>

          <form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>

              <div className={styles.inputWrapper}>
                <UserRound size={17} className={styles.inputIcon} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>

              <div className={styles.inputWrapper}>
                <Mail size={17} className={styles.inputIcon} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>

              <div className={styles.inputWrapper}>
                <LockKeyhole size={17} className={styles.inputIcon} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm Password</label>

              <div className={styles.inputWrapper}>
                <LockKeyhole size={17} className={styles.inputIcon} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submit}>
              Create Admin Account
            </button>
          </form>

          <div className={styles.loginPrompt}>
            <span>Already have an account?</span>
            <Link href="/admin/login">Sign in</Link>
          </div>
        </div>

        <div className={styles.securityNote}>
          <LockKeyhole size={13} />
          <span>Secure VTech Administration Portal</span>
        </div>

        <div className={styles.certification}>
          ISO 9001:2015 Certified
        </div>
      </section>
    </main>
  );
}