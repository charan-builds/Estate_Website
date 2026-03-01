"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trackEvent } from "@/lib/analytics";
import { EKAM_BUSINESS, getOfficeAddressText } from "@/lib/business";
import {
  LeadPayload,
  sendLeadEmail,
  syncLeadToGoogleForm,
  triggerLeadWhatsappNotification,
} from "@/lib/lead-routing";

const ENQUIRY_OPTIONS: LeadPayload["enquiryType"][] = [
  "Schedule Site Visit",
  "Request Call Back",
  "Download Brochure",
  "General Enquiry",
];

export default function Contact() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [projectOptions, setProjectOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    preferredDate: "",
    preferredTime: "",
    enquiryType: "General Enquiry" as LeadPayload["enquiryType"],
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const options = snapshot.docs
          .map((projectSnapshot) => projectSnapshot.data().name)
          .filter((name): name is string => typeof name === "string" && name.trim().length > 0);
        setProjectOptions(options);
      },
      () => setProjectOptions([])
    );

    return unsubscribe;
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload: LeadPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      project: formData.project,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      enquiryType: formData.enquiryType,
      source: "contact_page",
    };

    try {
      await addDoc(collection(db, "leads"), {
        ...payload,
        message: formData.message,
        notification: { emailPending: true },
        createdAt: serverTimestamp(),
      });

      await Promise.allSettled([sendLeadEmail(payload), syncLeadToGoogleForm(payload)]);

      triggerLeadWhatsappNotification(payload, EKAM_BUSINESS.whatsappNumber);

      trackEvent("contact_form_submission", {
        project: formData.project || "general",
        enquiry_type: formData.enquiryType,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);

      setFormData({
        name: "",
        email: "",
        phone: "",
        project: "",
        preferredDate: "",
        preferredTime: "",
        enquiryType: "General Enquiry",
        message: "",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  function handleQuickAction(enquiryType: LeadPayload["enquiryType"]) {
    setFormData((previous) => ({ ...previous, enquiryType }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="bg-white">
      <section className="bg-[#1a3a52] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-serif text-white md:text-5xl">Contact Us</h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Connect with our advisors for verified project details, site visits, and pricing.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-serif text-[#1a3a52]">Send us a Message</h2>
              <p className="mb-8 text-gray-600">Submit your enquiry and our team will contact you shortly.</p>

              {submitted ? (
                <div className="mb-6 border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                  Thank you. Your enquiry has been received.
                </div>
              ) : null}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-gray-700">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 px-4 py-3 focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm text-gray-700">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 px-4 py-3 focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="project" className="mb-2 block text-sm text-gray-700">Project (Optional)</label>
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-white px-4 py-3 focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                  >
                    <option value="">Select a project</option>
                    {projectOptions.map((projectName) => (
                      <option key={projectName} value={projectName}>{projectName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="enquiryType" className="mb-2 block text-sm text-gray-700">Enquiry Type *</label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    value={formData.enquiryType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-white px-4 py-3 focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                  >
                    {ENQUIRY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="preferredDate" className="mb-2 block text-sm text-gray-700">Preferred Date</label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                  </div>
                  <div>
                    <label htmlFor="preferredTime" className="mb-2 block text-sm text-gray-700">Preferred Time</label>
                    <input
                      type="time"
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full resize-none border border-gray-300 px-4 py-3 focus:border-[#1a3a52] focus:outline-none"
                    placeholder="Share your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1a3a52] py-4 text-white transition-colors hover:bg-[#2a4a62] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Enquiry"}
                </button>
              </form>
            </div>

            <div>
              <h2 className="mb-6 text-3xl font-serif text-[#1a3a52]">Get in Touch</h2>
              <p className="mb-8 text-gray-600">Visit our office or request a callback instantly.</p>

              <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1a3a52] px-3 py-1 text-sm text-white">
                  <ShieldCheck size={16} /> {EKAM_BUSINESS.reraBadge}
                </div>
                <p className="text-sm text-slate-600">{EKAM_BUSINESS.reraDisclaimer}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#1a3a52] text-white"><Phone size={20} /></div>
                  <div>
                    <h3 className="mb-1 text-lg text-[#1a3a52]">Call / WhatsApp</h3>
                    <p className="text-gray-600">{EKAM_BUSINESS.phoneDisplay}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#1a3a52] text-white"><Mail size={20} /></div>
                  <div>
                    <h3 className="mb-1 text-lg text-[#1a3a52]">Email</h3>
                    <p className="text-gray-600">{EKAM_BUSINESS.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#1a3a52] text-white"><MapPin size={20} /></div>
                  <div>
                    <h3 className="mb-1 text-lg text-[#1a3a52]">Office Address</h3>
                    <p className="text-gray-600">{getOfficeAddressText()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#1a3a52] text-white"><Clock size={20} /></div>
                  <div>
                    <h3 className="mb-1 text-lg text-[#1a3a52]">Business Hours</h3>
                    <p className="text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-serif text-[#1a3a52]">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleQuickAction("Schedule Site Visit")}
                    className="w-full border border-gray-300 bg-white py-3 text-[#1a3a52] transition-colors hover:bg-gray-100"
                  >
                    Schedule Site Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAction("Request Call Back")}
                    className="w-full border border-gray-300 bg-white py-3 text-[#1a3a52] transition-colors hover:bg-gray-100"
                  >
                    Request Callback
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAction("Download Brochure")}
                    className="w-full border border-gray-300 bg-white py-3 text-[#1a3a52] transition-colors hover:bg-gray-100"
                  >
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
