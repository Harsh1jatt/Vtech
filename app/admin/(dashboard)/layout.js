import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({ children }) {
  let admin;

  try {
    admin = await requireAdmin();
  } catch (error) {
    if (
      error?.status === 401 ||
      error?.message === "UNAUTHORIZED"
    ) {
      redirect("/admin/login");
    }

    if (
      error?.status === 403 ||
      error?.message === "FORBIDDEN"
    ) {
      redirect("/admin/login");
    }

    redirect("/admin/login");
  }

  return (
    <AdminShell adminName={admin.name}>
      {children}
    </AdminShell>
  );
}