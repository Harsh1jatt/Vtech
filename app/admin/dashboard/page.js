import Link from "next/link";
import { BadgeCheck, BookOpen, MessageSquare, Plus, UserPlus, Users } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import StatCard from "@/components/admin/StatCard";
import QuickAction from "@/components/admin/QuickAction";
import styles from "@/components/admin/AdminDashboard.module.css";

const dashboardStats = [
  { label: "Students", value: "124", detail: "Active students", icon: Users, tone: "green" },
  { label: "Active Courses", value: "8", detail: "Currently available", icon: BookOpen, tone: "blue" },
  { label: "Certificates Issued", value: "287", detail: "Total issued", icon: BadgeCheck, tone: "gold" },
  { label: "Pending Enquiries", value: "14", detail: "Need attention", icon: MessageSquare, tone: "red" },
];
const recentStudents = [["Aman Sharma", "ADCA", "Active", "18 Aug 2026"], ["Simran Kaur", "Web Development", "Active", "17 Aug 2026"], ["Rohit Kumar", "DCA", "Completed", "16 Aug 2026"]];
const recentCertificates = [["VTECH-2026-00124", "Aman Sharma", "ADCA", "VALID"], ["VTECH-2026-00123", "Simran Kaur", "Web Development", "VALID"], ["VTECH-2026-00122", "Rohit Kumar", "DCA", "REVOKED"]];
const recentEnquiries = [["Harpreet Singh", "Web Development", "New", "Today"], ["Manpreet Kaur", "ADCA", "Contacted", "Yesterday"]];

function SectionHeading({ title, href, children }) { return <div className={styles.sectionHeading}><h2>{title}</h2><Link href={href}>{children}</Link></div>; }

export default function AdminDashboardPage() {
  return <div className={styles.dashboard}>
    <div className={styles.pageHeading}><div><span className={styles.eyebrow}>Overview</span><h1>Dashboard</h1><p>Welcome back, Administrator.</p></div><span className={styles.date}>Thursday, 20 August 2026</span></div>
    <div className={styles.stats}>{dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
    <section className={styles.section}><SectionHeading title="Quick actions" href="/admin/students">Manage your institute</SectionHeading><div className={styles.quickGrid}><QuickAction href="/admin/students/new" title="Add Student" description="Register a learner" icon={UserPlus} /><QuickAction href="/admin/certificates/new" title="Issue Certificate" description="Create a certificate" icon={BadgeCheck} /><QuickAction href="/admin/courses/new" title="Add Course" description="Publish a course" icon={Plus} /><QuickAction href="/admin/enquiries" title="View Enquiries" description="Review new messages" icon={MessageSquare} /></div></section>
    <div className={styles.columns}>
      <section className={styles.section}><SectionHeading title="Recent students" href="/admin/students">View all students</SectionHeading><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Name</th><th>Course</th><th>Status</th><th>Date</th></tr></thead><tbody>{recentStudents.map(([name, course, status, date]) => <tr key={name}><td>{name}</td><td className={styles.muted}>{course}</td><td><StatusBadge status={status} /></td><td className={styles.muted}>{date}</td></tr>)}</tbody></table></div></section>
      <section className={styles.section}><SectionHeading title="Recent certificates" href="/admin/certificates">View all certificates</SectionHeading><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Certificate</th><th>Student</th><th>Course</th><th>Status</th></tr></thead><tbody>{recentCertificates.map(([number, student, course, status]) => <tr key={number}><td className={styles.certNumber}>{number}</td><td>{student}</td><td className={styles.muted}>{course}</td><td><StatusBadge status={status} /></td></tr>)}</tbody></table></div></section>
    </div>
    <section className={styles.section}><SectionHeading title="Recent enquiries" href="/admin/enquiries">View all enquiries</SectionHeading><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Name</th><th>Course</th><th>Status</th><th>Date</th></tr></thead><tbody>{recentEnquiries.map(([name, course, status, date]) => <tr key={name}><td>{name}</td><td className={styles.muted}>{course}</td><td><StatusBadge status={status} /></td><td className={styles.muted}>{date}</td></tr>)}</tbody></table></div></section>
  </div>;
}
