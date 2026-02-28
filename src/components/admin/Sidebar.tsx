import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Admin</h2>
      <nav className="space-y-2">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/projects">Projects</Link>
        <Link href="/admin/leads">Leads</Link>
        <Link href="/admin/settings">Settings</Link>
      </nav>
    </aside>
  );
}
