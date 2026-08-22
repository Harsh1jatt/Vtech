"use client";

import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import styles from "./AdminHeader.module.css";

export default function AdminHeader({ onMenuOpen }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Failed to load admin:", error);
      }
    }

    loadUser();
  }, []);

  const adminName = user?.name || "Administrator";

  const initials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuOpen}
        aria-label="Open admin navigation"
      >
        <Menu size={21} />
      </button>

      <div className={styles.title}>
        <span>VTech Institute</span>
        <strong>Administration</strong>
      </div>

      <div className={styles.actions}>
        <div className={styles.profile}>
          <span className={styles.avatar}>
            {initials}
          </span>

          <span>
            <strong>{adminName}</strong>
            <small>{user?.role === "admin" ? "Admin account" : "Account"}</small>
          </span>
        </div>
      </div>
    </header>
  );
}