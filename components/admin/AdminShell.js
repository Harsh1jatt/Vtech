"use client";

import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import styles from "./AdminShell.module.css";

export default function AdminShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return <div className={styles.shell}>
    <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className={styles.main}><AdminHeader onMenuOpen={() => setSidebarOpen(true)} /><main className={styles.content}>{children}</main></div>
  </div>;
}