import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { EKAM_BUSINESS, getOfficeAddressText } from "@/lib/business";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Ekam Properties",
  description: "Discover premium residential projects with Ekam Properties.",
  openGraph: {
    title: "Ekam Properties",
    description: "Discover premium residential projects with Ekam Properties.",
    type: "website",
    siteName: "Ekam Properties",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ekam Properties",
    description: "Discover premium residential projects with Ekam Properties.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const realEstateAgentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: EKAM_BUSINESS.name,
    telephone: EKAM_BUSINESS.phoneDisplay,
    email: EKAM_BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: getOfficeAddressText(),
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500032",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(realEstateAgentSchema),
          }}
        />

        <GoogleAnalytics />

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}