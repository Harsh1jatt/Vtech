"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import styles from "./Login.module.css";
import Image from "next/image";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
            <span>ADMIN PORTAL</span>
            <h1>Welcome back</h1>
            <p>
              Sign in to manage the VTech Institute administration panel.
            </p>
          </div>

          <form className={styles.form}>
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
              <div className={styles.labelRow}>
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className={styles.forgotButton}
                >
                  Forgot password?
                </button>
              </div>

              <div className={styles.inputWrapper}>
                <LockKeyhole size={17} className={styles.inputIcon} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            <label className={styles.remember}>
              <input type="checkbox" name="remember" />
              <span>Keep me signed in</span>
            </label>

            <button type="submit" className={styles.submit}>
              Sign In
            </button>
          </form>

          <div className={styles.registerPrompt}>
            <span>New administrator?</span>
            <Link href="/admin/register">
              Create admin account
            </Link>
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