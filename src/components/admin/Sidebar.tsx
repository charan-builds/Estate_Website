"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/admin/login");
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-5">
      {/* Brand */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1a3a52]">
          Ekam Admin
        </h2>
        <p className="text-xs text-slate-500">
          Property Management Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href, link.exact);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[#1a3a52] text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-[#1a3a52]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 rounded-md border border-[#1a3a52] px-3 py-2 text-sm font-medium text-[#1a3a52] transition hover:bg-[#1a3a52] hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
}