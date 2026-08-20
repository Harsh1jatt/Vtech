"use client";

import { Menu, Search } from "lucide-react";
import styles from "./AdminHeader.module.css";

export default function AdminHeader({ onMenuOpen }) {
  return <header className={styles.header}>
    <button type="button" className={styles.menuButton} onClick={onMenuOpen} aria-label="Open admin navigation"><Menu size={21} /></button>
    <div className={styles.title}><span>VTech Institute</span><strong>Administration</strong></div>
    <div className={styles.actions}>
      <label className={styles.search}><Search size={17} /><input type="search" placeholder="Search" aria-label="Search administration" /></label>
      <div className={styles.profile}><span className={styles.avatar}>AR</span><span><strong>Administrator</strong><small>Admin account</small></span></div>
    </div>
  </header>;
}
