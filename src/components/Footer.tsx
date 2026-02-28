"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a3a52] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif mb-4">Ekam Properties</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building dreams, creating landmarks. A trusted name in real estate
              development with a commitment to quality, innovation, and customer
              satisfaction.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3"><Phone size={18} /> +91 40 1234 5678</li>
              <li className="flex gap-3"><Mail size={18} /> info@ekamproperties.com</li>
              <li className="flex gap-3"><MapPin size={18} /> Hyderabad, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400 flex justify-between">
          <span>© 2026 Ekam Properties. All rights reserved.</span>
          <span className="flex gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </span>
        </div>
      </div>
    </footer>
  );
}