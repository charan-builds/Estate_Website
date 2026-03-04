"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/auth";

function getPageTitle(pathname: string) {
  if (pathname.includes("/admin/projects")) return "Projects";
  if (pathname.includes("/admin/leads")) return "Leads";
  if (pathname.includes("/admin/settings")) return "Settings";
  return "Dashboard";
}

export default function AdminHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  async function handleLogout() {
    await logoutAdmin();
    window.location.href = "/admin/login";
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Title */}
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Admin Panel
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            {title}
          </h1>
        </div>

        {/* Right: Actions */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm bg-blue text-slate-700 hover:bg-slate-100 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}