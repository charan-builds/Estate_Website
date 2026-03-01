"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { EKAM_BUSINESS, getOfficeAddressText } from "@/lib/business";

export default function Footer() {
  return (
    <footer className="bg-[#1a3a52] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <h3 className="mb-4 text-2xl font-serif">{EKAM_BUSINESS.name}</h3>
            <p className="mb-6 leading-relaxed text-gray-300">
              Building dreams, creating landmarks with verified projects and transparent guidance.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <ShieldCheck size={16} /> {EKAM_BUSINESS.reraBadge}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3"><Phone size={18} /> {EKAM_BUSINESS.phoneDisplay}</li>
              <li className="flex gap-3"><Mail size={18} /> {EKAM_BUSINESS.email}</li>
              <li className="flex gap-3"><MapPin size={18} /> {getOfficeAddressText()}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-sm text-gray-300">
          <p className="mb-4">{EKAM_BUSINESS.reraDisclaimer}</p>
          <div className="flex flex-col gap-3 text-gray-400 md:flex-row md:items-center md:justify-between">
            <span>© 2026 {EKAM_BUSINESS.name}. All rights reserved.</span>
            <span className="flex items-center gap-6">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms & Conditions</a>
              <Link href="/admin" className="text-[11px] text-gray-500 transition hover:text-gray-300">
                Developer Access
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
