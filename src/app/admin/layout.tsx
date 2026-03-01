"use client";

import Sidebar from "@/components/admin/Sidebar";
import AdminGuard from "@/components/admin/AdminGuard";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminGuard>
      {isLoginPage ? (
        <main>{children}</main>
      ) : (
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
        </div>
      )}
    </AdminGuard>
  );
}
