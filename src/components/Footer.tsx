"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { EKAM_BUSINESS, getOfficeAddressText } from "@/lib/business";
import SlideUp from "@/components/animations/SlideUp";
import StaggerContainer from "@/components/animations/StaggerContainer";
import { motion } from "framer-motion";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-[#1a3a52] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 gap-12 md:grid-cols-6">
          <SlideUp className="col-span-1 md:col-span-2">
            <h3 className="mb-4 text-2xl font-serif">{EKAM_BUSINESS.name}</h3>
            <p className="mb-6 leading-relaxed text-gray-300">
              Building dreams, creating landmarks with verified projects and transparent guidance.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <ShieldCheck size={16} /> {EKAM_BUSINESS.reraBadge}
            </div>
          </SlideUp>

          <SlideUp>
            <h4 className="mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/property-listings">Property Listings</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </SlideUp>

          <SlideUp>
            <h4 className="mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3"><Phone size={18} /> {EKAM_BUSINESS.phoneDisplay}</li>
              <li className="flex gap-3"><Mail size={18} /> {EKAM_BUSINESS.email}</li>
              <li className="flex gap-3"><MapPin size={18} /> {getOfficeAddressText()}</li>
            </ul>
          </SlideUp>

          <SlideUp>
            <h4 className="mb-4 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="mb-3 text-gray-300 text-sm">Stay updated with latest projects and offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-black rounded text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 24px rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.95 }}
                className="rounded bg-[#1a3a52] px-4 py-2 text-sm transition-colors hover:bg-[#2a4a62]"
              >
                Subscribe
              </motion.button>
            </div>
            <div className="mt-5">
              <p className="mb-3 text-sm uppercase tracking-wider text-gray-300">Follow Ekam Properties</p>
              <SocialLinks className="flex items-center gap-3 text-white" iconClassName="border-white/20 bg-white/10" />
            </div>
          </SlideUp>
        </StaggerContainer>

        <SlideUp className="mt-12 border-t border-gray-700 pt-8 text-sm text-grey-300">
          <p className="mb-4 text-black-500">{EKAM_BUSINESS.reraDisclaimer}</p>
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
        </SlideUp>
      </div>
    </footer>
  );
}
