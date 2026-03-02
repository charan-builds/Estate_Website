import { EKAM_BUSINESS } from "@/lib/business";

/* ---------------- TYPES ---------------- */

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  project?: string;
  preferredDate?: string;
  preferredTime?: string;
  enquiryType:
    | "Schedule Site Visit"
    | "Request Call Back"
    | "Download Brochure"
    | "General Enquiry";
  source?: string;
};

/* ---------------- WHATSAPP ---------------- */

export function triggerLeadWhatsappNotification(
  lead: LeadPayload,
  whatsappNumber: string
) {
  const message = `
New Lead Received 🚀

Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || "-"}
Project: ${lead.project || "General"}
Type: ${lead.enquiryType}
Preferred Date: ${lead.preferredDate || "-"}
Preferred Time: ${lead.preferredTime || "-"}

Source: ${lead.source || "website"}
`;

  const encodedMessage = encodeURIComponent(message.trim());
  const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Open WhatsApp in new tab
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
}

/* ---------------- EMAIL ---------------- */
/**
 * This uses EmailJS / Resend / backend later
 * For now it logs + keeps structure production-ready
 */
export async function sendLeadEmail(lead: LeadPayload) {
  const emailBody = `
New Enquiry Received

Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || "-"}
Project: ${lead.project || "General"}
Type: ${lead.enquiryType}
Preferred Date: ${lead.preferredDate || "-"}
Preferred Time: ${lead.preferredTime || "-"}

Business: ${EKAM_BUSINESS.name}
`;

  console.log("📧 EMAIL TO ADMIN:", emailBody);

  // 👉 Later: integrate Resend / Nodemailer / Firebase Function
  return Promise.resolve(true);
}

/* ---------------- GOOGLE FORM ---------------- */

export async function syncLeadToGoogleForm(lead: LeadPayload) {
  /**
   * Replace these with your real Google Form entry IDs
   */
  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/XXXXXXXXXXXX/formResponse";

  const formData = new FormData();
  formData.append("entry.1111111111", lead.name);
  formData.append("entry.2222222222", lead.phone);
  formData.append("entry.3333333333", lead.email || "");
  formData.append("entry.4444444444", lead.project || "");
  formData.append("entry.5555555555", lead.enquiryType);

  try {
    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });
  } catch {
    // Silent fail (Google Forms blocks CORS)
  }
}