"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, MessageCircle, Phone, X } from "lucide-react";

import { EKAM_BUSINESS } from "@/lib/business";
import { createInteractionLead } from "@/lib/lead";

type FloatingContactBarProps = {
  onBookVisit: () => void;
};

export default function FloatingContactBar({
  onBookVisit,
}: FloatingContactBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    return () => window.clearTimeout(timer);
  }, []);

  const whatsappMessage = encodeURIComponent(
    "Hi Ekam Properties, I would like to know more about your available projects."
  );

  const actions = [
    {
      label: "Call Now",
      href: `tel:${EKAM_BUSINESS.phoneDial}`,
      Icon: Phone,
      className: "bg-[#1a3a52] text-white",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${EKAM_BUSINESS.whatsappNumber}?text=${whatsappMessage}`,
      Icon: MessageCircle,
      className: "bg-[#25D366] text-white",
      pulse: true,
    },
  ];

  return (
    <>
      <div className="fixed bottom-24 right-4 z-40 sm:bottom-6 sm:right-6 lg:bottom-6">
        <motion.button
          type="button"
          aria-label={isOpen ? "Close quick connect widget" : "Open quick connect widget"}
          whileHover={{ scale: 1.08, boxShadow: "0 14px 28px rgba(26,58,82,0.2)" }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen((current) => !current)}
          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#1a3a52] text-white shadow-2xl"
        >
          {isOpen ? <X size={20} /> : <span className="text-2xl leading-none">●</span>}
        </motion.button>

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 18, scale: 0.94 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-16 right-0 w-[280px] rounded-[1.75rem] border border-white/40 bg-white/95 p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#1a3a52]/60">Quick Connect</p>
                  <p className="mt-2 text-xl font-serif text-[#1a3a52]">Talk to Ekam Properties</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-[#1a3a52]/70 transition hover:bg-slate-100 hover:text-[#1a3a52]"
                  aria-label="Close quick connect widget"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {actions.map((action) => (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    target={action.label === "WhatsApp" ? "_blank" : undefined}
                    rel={action.label === "WhatsApp" ? "noreferrer" : undefined}
                    onClick={() =>
                      createInteractionLead({
                        source: action.label === "WhatsApp" ? "whatsapp" : "call",
                      })
                    }
                    whileHover={{ scale: 1.03, boxShadow: "0 12px 28px rgba(26,58,82,0.16)" }}
                    whileTap={{ scale: 0.95 }}
                    animate={action.pulse ? { boxShadow: ["0 0 0 rgba(37,211,102,0.28)", "0 0 0 12px rgba(37,211,102,0)"] } : undefined}
                    transition={action.pulse ? { duration: 1.8, repeat: Infinity } : { type: "spring", stiffness: 320, damping: 18 }}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${action.className}`}
                  >
                    <action.Icon size={18} />
                    {action.label}
                  </motion.a>
                ))}
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 12px 28px rgba(18,49,71,0.18)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBookVisit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123147] px-4 py-3 text-sm font-medium text-white"
                >
                  <CalendarCheck size={18} />
                  Book Site Visit
                </motion.button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
