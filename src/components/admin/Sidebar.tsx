"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
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

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
      <h2 className="mb-6 text-lg font-semibold text-[#1a3a52]">Admin Panel</h2>
      <nav className="space-y-1">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm transition ${
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

      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto rounded-md border border-[#1a3a52] px-3 py-2 text-sm font-medium text-[#1a3a52] transition hover:bg-[#1a3a52] hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
}
