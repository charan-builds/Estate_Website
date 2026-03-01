"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trackEvent } from "@/lib/analytics";
import { EKAM_BUSINESS } from "@/lib/business";
import {
  LeadPayload,
  sendLeadEmail,
  syncLeadToGoogleForm,
  triggerLeadWhatsappNotification,
} from "@/lib/lead-routing";
import { Project } from "@/types/project";

type LeadFormProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
};

export default function LeadForm({ project, open, onClose }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const payload: LeadPayload = {
      name: name.trim(),
      phone: phone.trim(),
      project: project.name,
      preferredDate,
      preferredTime,
      enquiryType: "Schedule Site Visit",
      source: "project_detail",
    };

    try {
      await addDoc(collection(db, "leads"), {
        ...payload,
        projectSlug: project.slug,
        projectLocation: project.location,
        notification: { emailPending: true },
        createdAt: serverTimestamp(),
      });

      await Promise.allSettled([sendLeadEmail(payload), syncLeadToGoogleForm(payload)]);
      triggerLeadWhatsappNotification(payload, EKAM_BUSINESS.whatsappNumber);

      trackEvent("site_visit_booking", {
        project_slug: project.slug,
        project_name: project.name,
      });

      setMessage("Site visit booked successfully.");
      setName("");
      setPhone("");
      setPreferredDate("");
      setPreferredTime("");
    } catch {
      setError("Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <h3 className="text-xl font-semibold text-[#1a3a52]">Book Site Visit</h3>
        <p className="mt-1 text-sm text-slate-600">Project: {project.name}</p>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            placeholder="Phone"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={preferredDate}
              onChange={(event) => setPreferredDate(event.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="time"
              value={preferredTime}
              onChange={(event) => setPreferredTime(event.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <input
            value={project.name}
            readOnly
            className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700"
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-[#1a3a52] px-4 py-2 text-sm font-semibold text-white hover:bg-[#224865] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
