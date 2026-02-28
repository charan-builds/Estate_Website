"use client";

import Header from "@/components/Header";
import Footer  from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}