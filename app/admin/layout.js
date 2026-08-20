"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/register";

  return isAuthPage ? children : <AdminShell>{children}</AdminShell>;
}