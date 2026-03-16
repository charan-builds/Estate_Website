export const EKAM_BUSINESS = {
  name: "Ekam Properties",
  phoneDisplay: "+91 79013 24545",
  phoneDial: "+917901324545",
  whatsappNumber: "917901324545",
  addressLines: [
    "9-24/9D, 9th Floor",
    "Vaishnavi's Cymbol",
    "Financial District Circle",
    "Nanakramguda, Hyderabad",
    "Telangana - 500032",
  ],
  email: "info@ekamproperties.com",
  reraBadge: "TG RERA Certified Real Estate",
  reraDisclaimer:
    "All project details are subject to RERA approvals and final agreements. Please verify official documents before booking.",
};

export const EKAM_SOCIAL_LINKS = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
};

export function getOfficeAddressText() {
  return `${EKAM_BUSINESS.name}, ${EKAM_BUSINESS.addressLines.join(", ")}`;
}
