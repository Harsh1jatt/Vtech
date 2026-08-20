"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BadgeCheck, BookOpen, LayoutDashboard, LogOut, Settings, Users, X } from "lucide-react";
import styles from "./AdminSidebar.module.css";

const primaryLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Certificates", href: "/admin/certificates", icon: BadgeCheck },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return <>
    <div className={`${styles.overlay} ${open ? styles.overlayVisible : ""}`} onClick={onClose} aria-hidden="true" />
    <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`} aria-label="Admin navigation">
      <div className={styles.brandRow}>
        <Link href="/admin/dashboard" className={styles.brand} onClick={onClose}>
          <span className={styles.brandMark}>V</span>
          <span><strong>VTECH</strong><small>ADMINISTRATION</small></span>
        </Link>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close admin navigation"><X size={20} /></button>
      </div>
      <nav className={styles.nav}>
        <p className={styles.navLabel}>Workspace</p>
        {primaryLinks.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return <Link key={href} href={href} onClick={onClose} className={`${styles.navLink} ${active ? styles.active : ""}`} aria-current={active ? "page" : undefined}><Icon size={18} /><span>{label}</span></Link>;
        })}
        <div className={styles.divider} />
        <Link href="/admin/settings" onClick={onClose} className={`${styles.navLink} ${isActive("/admin/settings") ? styles.active : ""}`}><Settings size={18} /><span>Settings</span></Link>
      </nav>
      <button type="button" className={styles.logout} onClick={() => router.push("/admin/login")}><LogOut size={18} /><span>Log out</span></button>
    </aside>
  </>;
}
