"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Contact", path: "/contact" },
  ];

  /* 🔐 Hidden Admin Shortcut: Ctrl + Shift + A */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      setKeysPressed((prev) => [...prev.slice(-2), e.key.toLowerCase()]);
    }

    if (keysPressed.join("") === "controlshifta") {
      router.push("/admin/login");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keysPressed, router]);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* 🔰 LOGO + BRAND */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative h-12 w-12">
              <Image
                src="/logo.svg"
                alt="Ekam Properties Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-serif text-[#1a3a52]">
                Ekam Properties
              </span>
              <span className="text-xs text-gray-500">
                TG RERA Certified Real Estate Agent
              </span>
            </div>
          </Link>

          {/* 🧭 DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm tracking-wide transition ${
                  isActive(item.path)
                    ? "text-[#1a3a52] font-medium"
                    : "text-gray-600 hover:text-[#1a3a52]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* 📞 WhatsApp CTA */}
            <a
              href="https://wa.me/917901324545?text=Hi%20Ekam%20Properties,%20I%20am%20interested%20in%20your%20projects."
              target="_blank"
              className="flex items-center gap-2 bg-[#1a3a52] text-white px-4 py-2 rounded hover:bg-[#234e6f]"
            >
              <Phone size={16} />
              Enquire
            </a>
          </nav>

          {/* 📱 MOBILE MENU */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE NAV */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <a
            href="https://wa.me/917901324545"
            target="_blank"
            className="block bg-[#1a3a52] text-white text-center py-3 rounded"
          >
            WhatsApp Enquiry
          </a>
        </div>
      )}
    </header>
  );
}