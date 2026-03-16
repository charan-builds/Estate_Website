"use client";

import { FormEvent, useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

import { db } from "@/lib/firebase";
import { LeadPayload, sendLeadEmail, syncLeadToGoogleForm, triggerLeadWhatsappNotification } from "@/lib/lead-routing";
import { EKAM_BUSINESS } from "@/lib/business";

type LeadCaptureModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LeadCaptureModal({
  open,
  onClose,
}: LeadCaptureModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setMessage("");
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload: LeadPayload = {
      name: name.trim(),
      phone: phone.trim(),
      project: preferredLocation.trim(),
      enquiryType: "General Enquiry",
      source: "homepage_scroll_modal",
    };

    try {
      await addDoc(collection(db, "leads"), {
        ...payload,
        preferredLocation: preferredLocation.trim(),
        notification: { emailPending: true },
        createdAt: serverTimestamp(),
      });

      await Promise.allSettled([sendLeadEmail(payload), syncLeadToGoogleForm(payload)]);
      triggerLeadWhatsappNotification(payload, EKAM_BUSINESS.whatsappNumber);

      setMessage("Thank you. Our team will share matching options shortly.");
      setName("");
      setPhone("");
      setPreferredLocation("");
      window.setTimeout(() => onClose(), 1200);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-lg rounded-[1.75rem] border border-white/40 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#1a3a52]/60">Priority Assistance</p>
            <h3 className="mt-3 text-3xl font-serif text-[#1a3a52]">Looking for the right property?</h3>
            <p className="mt-3 text-gray-600">
              Share your details and our advisors will recommend verified projects that fit your location needs.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                placeholder="Phone"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
              <input
                value={preferredLocation}
                onChange={(event) => setPreferredLocation(event.target.value)}
                required
                placeholder="Preferred Location"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />

              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  Maybe Later
                </button>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 12px 28px rgba(26,58,82,0.18)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#1a3a52] px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Get Property Details"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
