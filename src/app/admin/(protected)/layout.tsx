import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <div className="flex flex-col flex-1">
          <AdminHeader />

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}