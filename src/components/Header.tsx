"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-serif text-[#1a3a52]">
              Ekam Properties
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm tracking-wide transition-colors ${
                  isActive(item.path)
                    ? "text-[#1a3a52]"
                    : "text-gray-600 hover:text-[#1a3a52]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 text-sm tracking-wide transition-colors ${
                  isActive(item.path)
                    ? "text-[#1a3a52]"
                    : "text-gray-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}