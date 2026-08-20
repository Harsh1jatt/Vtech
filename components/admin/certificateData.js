import { demoStudents, getStudentById } from "./studentData";

export const certificateStatuses = ["VALID", "REVOKED", "EXPIRED"];
export const demoCertificates = [
  { id: "vtech-2026-00124", certificateNumber: "VTECH-2026-00124", studentId: "aman-sharma", certificateFile: { name: "VTECH-2026-00124.pdf", type: "application/pdf", size: 245678, previewUrl: null }, status: "VALID", createdAt: "2026-08-18", updatedAt: "2026-08-18" },
  { id: "vtech-2026-00123", certificateNumber: "VTECH-2026-00123", studentId: "simran-kaur", certificateFile: null, status: "VALID", createdAt: "2026-08-17", updatedAt: "2026-08-17" },
  { id: "vtech-2026-00122", certificateNumber: "VTECH-2026-00122", studentId: "rohit-kumar", certificateFile: null, status: "REVOKED", createdAt: "2026-08-16", updatedAt: "2026-08-19" },
  { id: "vtech-2026-00121", certificateNumber: "VTECH-2026-00121", studentId: "harpreet-singh", certificateFile: null, status: "VALID", createdAt: "2026-08-12", updatedAt: "2026-08-12" },
  { id: "vtech-2026-00120", certificateNumber: "VTECH-2026-00120", studentId: "manpreet-kaur", certificateFile: null, status: "VALID", createdAt: "2026-08-10", updatedAt: "2026-08-10" },
  { id: "vtech-2025-00098", certificateNumber: "VTECH-2025-00098", studentId: "neha-verma", certificateFile: null, status: "EXPIRED", createdAt: "2025-12-18", updatedAt: "2025-12-18" },
  { id: "vtech-2025-00091", certificateNumber: "VTECH-2025-00091", studentId: "vikas-mehta", certificateFile: null, status: "VALID", createdAt: "2025-11-20", updatedAt: "2025-11-20" },
  { id: "vtech-2025-00077", certificateNumber: "VTECH-2025-00077", studentId: "preeti-joshi", certificateFile: null, status: "REVOKED", createdAt: "2025-10-07", updatedAt: "2025-10-09" },
  { id: "vtech-2025-00064", certificateNumber: "VTECH-2025-00064", studentId: "karan-deep", certificateFile: null, status: "VALID", createdAt: "2025-09-21", updatedAt: "2025-09-21" },
  { id: "vtech-2025-00051", certificateNumber: "VTECH-2025-00051", studentId: "aarti-gill", certificateFile: null, status: "EXPIRED", createdAt: "2025-08-15", updatedAt: "2025-08-15" },
];

export const studentOptions = demoStudents.map((student) => ({ id: student.id, name: student.fullName, enrollmentNumber: student.enrollmentNumber, course: student.course }));
export const courseOptions = [...new Set(demoStudents.map((student) => student.course))];
export function getCertificateById(id) { return demoCertificates.find((certificate) => certificate.id === id); }
export { getStudentById };
