import Link from "next/link";
import { BadgeCheck, BookOpen, Plus, UserPlus, Users } from "lucide-react";

import connectToDatabase from "@/lib/db";
import Student from "@/models/Student";
import Course from "@/models/Course";
import Certificate from "@/models/Certificate";

import StatusBadge from "@/components/admin/StatusBadge";
import StatCard from "@/components/admin/StatCard";
import QuickAction from "@/components/admin/QuickAction";
import styles from "@/components/admin/AdminDashboard.module.css";

async function getDashboardData() {
  await connectToDatabase();

  const [
    activeStudents,
    activeCourses,
    certificatesIssued,
    completedStudents,
    recentStudents,
    recentCertificates,
  ] = await Promise.all([
    Student.countDocuments({ status: "Active" }),

    Course.countDocuments({ status: "Active" }),

    Certificate.countDocuments(),

    Student.countDocuments({ status: "Completed" }),

    Student.find({})
      .populate("course", "title shortTitle")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Certificate.find({})
      .populate({
        path: "student",
        populate: {
          path: "course",
          select: "title shortTitle",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    activeStudents,
    activeCourses,
    certificatesIssued,
    completedStudents,
    recentStudents,
    recentCertificates,
  };
}

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDashboardDate() {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function SectionHeading({ title, href, children }) {
  return (
    <div className={styles.sectionHeading}>
      <h2>{title}</h2>
      <Link href={href}>{children}</Link>
    </div>
  );
}

function EmptyTableState({ message, colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.muted}>
        {message}
      </td>
    </tr>
  );
}

export default async function AdminDashboardPage() {
  const {
    activeStudents,
    activeCourses,
    certificatesIssued,
    completedStudents,
    recentStudents,
    recentCertificates,
  } = await getDashboardData();

  const dashboardStats = [
    {
      label: "Students",
      value: activeStudents.toString(),
      detail: "Active students",
      icon: Users,
      tone: "green",
    },
    {
      label: "Active Courses",
      value: activeCourses.toString(),
      detail: "Currently available",
      icon: BookOpen,
      tone: "blue",
    },
    {
      label: "Certificates Issued",
      value: certificatesIssued.toString(),
      detail: "Total issued",
      icon: BadgeCheck,
      tone: "gold",
    },
    {
      label: "Completed Students",
      value: completedStudents.toString(),
      detail: "Course completions",
      icon: Users,
      tone: "red",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.pageHeading}>
        <div>
          <span className={styles.eyebrow}>Overview</span>

          <h1>Dashboard</h1>

          <p>Manage your institute from one place.</p>
        </div>

        <span className={styles.date}>{formatDashboardDate()}</span>
      </div>

      <div className={styles.stats}>
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className={styles.section}>
        <SectionHeading
          title="Quick actions"
          href="/admin/students"
        >
          Manage your institute
        </SectionHeading>

        <div className={styles.quickGrid}>
          <QuickAction
            href="/admin/students/new"
            title="Add Student"
            description="Register a learner"
            icon={UserPlus}
          />

          <QuickAction
            href="/admin/certificates/new"
            title="Issue Certificate"
            description="Create a certificate"
            icon={BadgeCheck}
          />

          <QuickAction
            href="/admin/courses/new"
            title="Add Course"
            description="Publish a course"
            icon={Plus}
          />
        </div>
      </section>

      <div className={styles.columns}>
        <section className={styles.section}>
          <SectionHeading
            title="Recent students"
            href="/admin/students"
          >
            View all students
          </SectionHeading>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentStudents.length > 0 ? (
                  recentStudents.map((student) => (
                    <tr key={student._id.toString()}>
                      <td>{student.fullName}</td>

                      <td className={styles.muted}>
                        {student.course?.shortTitle ||
                          student.course?.title ||
                          "—"}
                      </td>

                      <td>
                        <StatusBadge status={student.status} />
                      </td>

                      <td className={styles.muted}>
                        {formatDate(
                          student.admissionDate || student.createdAt
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyTableState
                    colSpan={4}
                    message="No students registered yet."
                  />
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeading
            title="Recent certificates"
            href="/admin/certificates"
          >
            View all certificates
          </SectionHeading>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Certificate</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentCertificates.length > 0 ? (
                  recentCertificates.map((certificate) => {
                    const student = certificate.student;
                    const course = student?.course;

                    return (
                      <tr key={certificate._id.toString()}>
                        <td className={styles.certNumber}>
                          {certificate.certificateNumber}
                        </td>

                        <td>
                          {student?.fullName || "—"}
                        </td>

                        <td className={styles.muted}>
                          {course?.shortTitle ||
                            course?.title ||
                            "—"}
                        </td>

                        <td>
                          <StatusBadge
                            status={certificate.status}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <EmptyTableState
                    colSpan={4}
                    message="No certificates issued yet."
                  />
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}