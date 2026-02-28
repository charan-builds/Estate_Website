import React from 'react';
import Sidebar from '@/components/admin/Sidebar';

// Admin layout wraps all admin pages with sidebar and header
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* optional AdminHeader could go here */}
        {children}
      </main>
    </div>
  );
}
