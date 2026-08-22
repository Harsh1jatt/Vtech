"use client";

import { Menu } from "lucide-react";
import styles from "./AdminHeader.module.css";

export default function AdminMenuButton({ onClick }) {
  return (
    <button
      type="button"
      className={styles.menuButton}
      onClick={onClick}
      aria-label="Open admin navigation"
    >
      <Menu size={21} />
    </button>
  );
}