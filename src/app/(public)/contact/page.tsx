"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";

import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import StaggerContainer from "@/components/animations/StaggerContainer";
import { fadeInUpVariants } from "@/components/animations/motion";
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

  const faqs = [
    {
      question: "How do I schedule a site visit?",
      answer:
        "Use the form, call us directly, or choose the quick action for a site visit. Our team will coordinate the timing and next steps with you.",
    },
    {
      question: "Are your projects approved?",
      answer:
        "Our team only presents verified opportunities and supports buyers with transparent approval information throughout the process.",
    },
    {
      question: "Do you provide loan assistance?",
      answer:
        "Yes, we help buyers understand available financing options and can guide them through the loan support process.",
    },
  ];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#1a3a52] py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <h1 className="mb-4 text-4xl font-serif text-white md:text-5xl">Contact Us</h1>
          </SlideUp>
          <SlideUp className="max-w-2xl">
            <p className="text-xl text-gray-200">
              Connect with our advisors for verified project details, site visits, and pricing.
            </p>
          </SlideUp>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <SlideUp>
              <h2 className="mb-6 text-3xl font-serif text-[#1a3a52]">Send us a Message</h2>
              <p className="mb-8 text-gray-600">Submit your enquiry and our team will contact you shortly.</p>

              {submitted ? (
                <div className="mb-6 border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                  Thank you. Your enquiry has been received.
                </div>
              ) : null}

              <StaggerContainer>
                <motion.form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={fadeInUpVariants}>
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
                  </motion.div>

                  <motion.div variants={fadeInUpVariants} className="grid gap-4 md:grid-cols-2">
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
                  </motion.div>

                  <motion.div variants={fadeInUpVariants}>
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
                  </motion.div>

                  <motion.div variants={fadeInUpVariants}>
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
                  </motion.div>

                  <motion.div variants={fadeInUpVariants} className="grid gap-4 md:grid-cols-2">
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
                  </motion.div>

                  <motion.div variants={fadeInUpVariants}>
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
                  </motion.div>

                  <motion.button
                    variants={fadeInUpVariants}
                    whileHover={{ scale: 1.05, boxShadow: "0 14px 28px rgba(26,58,82,0.18)" }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1a3a52] py-4 text-white transition-colors hover:bg-[#2a4a62] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Enquiry"}
                  </motion.button>
                </motion.form>
              </StaggerContainer>
            </SlideUp>

            <StaggerContainer className="space-y-6">
              <motion.div variants={fadeInUpVariants} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8">
                <h2 className="mb-6 text-3xl font-serif text-[#1a3a52]">Get in Touch</h2>
                <p className="mb-8 text-gray-600">Visit our office or request a callback instantly.</p>

                <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1a3a52] px-3 py-1 text-sm text-white">
                    <ShieldCheck size={16} /> {EKAM_BUSINESS.reraBadge}
                  </div>
                  <p className="text-sm text-slate-600">{EKAM_BUSINESS.reraDisclaimer}</p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Phone, title: "Call / WhatsApp", value: EKAM_BUSINESS.phoneDisplay },
                    { icon: Mail, title: "Email", value: EKAM_BUSINESS.email },
                    { icon: MapPin, title: "Office Address", value: getOfficeAddressText() },
                    { icon: Clock, title: "Business Hours", value: "Mon - Sat: 9:00 AM - 6:00 PM" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center bg-[#1a3a52] text-white">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg text-[#1a3a52]">{item.title}</h3>
                        <p className="text-gray-600">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUpVariants} className="rounded-[1.75rem] border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-serif text-[#1a3a52]">Quick Actions</h3>
                <div className="space-y-3">
                  {ENQUIRY_OPTIONS.slice(0, 3).map((option) => (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => handleQuickAction(option)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full border border-gray-300 bg-white py-3 text-[#1a3a52] transition-colors hover:bg-gray-100"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-serif text-[#1a3a52]">Visit Our Office</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Located in the heart of the city, our office is easily accessible for all your property needs.
            </p>
          </FadeIn>

          <SlideUp className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3578!2d78.4867!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c7458e5c5d%3A0x1234567890abcdef!2sEkam%20Properties!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ekam Properties Office Location"
            />
          </SlideUp>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-serif text-[#1a3a52]">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Find answers to common questions about our properties and services.
            </p>
          </FadeIn>

          <StaggerContainer className="space-y-4">
            {faqs.map((faq) => (
              <motion.details
                key={faq.question}
                variants={fadeInUpVariants}
                className="rounded-[1.5rem] border border-gray-200 bg-white p-6"
              >
                <summary className="cursor-pointer text-lg font-serif text-[#1a3a52] hover:text-[#2a4a62]">
                  {faq.question}
                </summary>
                <div className="mt-4 text-gray-600">{faq.answer}</div>
              </motion.details>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
