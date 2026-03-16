"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SocialLinks from "@/components/SocialLinks";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [keysPressed, setKeysPressed] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Property Listings", path: "/property-listings" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
  ];

  /* 🔐 Hidden Admin Shortcut: Ctrl + Shift + A */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
  if (!e.key || typeof e.key !== "string") return;

  setKeysPressed((prev) => [
    ...prev.slice(-2),
    e.key.toLowerCase(),
  ]);
}

    if (keysPressed.join("") === "controlshifta") {
      router.push("/admin/login");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keysPressed, router]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path);

  return (
    <motion.header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/40 bg-white/85 shadow-lg backdrop-blur-xl"
          : "border-slate-200 bg-white shadow-sm"
      }`}
    >
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
                TG RERA Certified Real Estate 
              </span>
            </div>
          </Link>

          {/* 🧭 DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative text-sm tracking-wide transition ${
                  isActive(item.path)
                    ? "text-[#1a3a52] font-medium"
                    : "text-gray-600 hover:text-[#1a3a52]"
                }`}
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-2 left-0 h-0.5 bg-[#1a3a52]"
                  initial={false}
                  animate={{
                    width: isActive(item.path) ? "100%" : "0%",
                    opacity: isActive(item.path) ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              </Link>
            ))}

            {/* 📞 WhatsApp CTA */}
            <motion.a
              href="https://wa.me/917901324545?text=Hi%20Ekam%20Properties,%20I%20am%20interested%20in%20your%20projects."
              target="_blank"
              whileHover={{ scale: 1.05, boxShadow: "0 12px 28px rgba(26,58,82,0.18)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="flex items-center gap-2 rounded bg-[#1a3a52] px-4 py-2 text-white hover:bg-[#234e6f]"
            >
              <Phone size={16} />
              Enquire
            </motion.a>
            <SocialLinks className="flex items-center gap-2 text-[#1a3a52]" />
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
      <AnimatePresence>
        {mobileMenuOpen ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="md:hidden overflow-hidden border-t bg-white/95 px-4 py-6 backdrop-blur"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block py-2 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <motion.a
            href="https://wa.me/917901324545"
            target="_blank"
            whileTap={{ scale: 0.97 }}
            className="mt-3 block rounded bg-[#1a3a52] py-3 text-center text-white"
          >
            WhatsApp Enquiry
          </motion.a>
          <SocialLinks className="mt-4 flex items-center gap-3 text-[#1a3a52]" />
        </motion.div>
      ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
