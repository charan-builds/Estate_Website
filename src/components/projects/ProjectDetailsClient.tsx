"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  MapPin,
  Phone,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  PlayCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { EKAM_BUSINESS } from "@/lib/business";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import GalleryModal from "@/components/projects/GalleryModal";
import LeadForm from "@/components/projects/LeadForm";
import MapSection from "@/components/projects/MapSection";
import { Project } from "@/types/project";

type Props = {
  project: Project;
};

export default function ProjectDetailsClient({ project }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  /* ---------------- TRACKING ---------------- */

  function handleCallClick() {
    trackEvent("call_now_click", {
      project_slug: project.slug,
      project_name: project.name,
    });
  }

  function handleWhatsappClick() {
    trackEvent("whatsapp_click", {
      project_slug: project.slug,
      project_name: project.name,
    });
  }

  function handleBrochureClick() {
    trackEvent("brochure_click", {
      project_slug: project.slug,
      project_name: project.name,
    });
  }

  useEffect(() => {
    trackEvent("project_page_view", {
      project_slug: project.slug,
      project_name: project.name,
    });
  }, [project.slug, project.name]);

  /* ---------------- WHATSAPP ---------------- */

  const whatsappMessage = useMemo(
    () =>
      encodeURIComponent(
        `Hi Ekam Properties,\nI am interested in ${project.name}.\nPlease share price details and site visit availability.`
      ),
    [project.name]
  );

  const whatsappLink = `https://wa.me/${EKAM_BUSINESS.whatsappNumber}?text=${whatsappMessage}`;
  const router = useRouter();

  /* ---------------- SEO SCHEMA ---------------- */

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.name,
    description: project.description,
    address: project.location,
    image: project.gallery,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: project.price,
      availability: "https://schema.org/InStock",
    },
  };

  /* ---------------- VIDEO SUPPORT ---------------- */

  const videoUrl =
    project.gallery?.find((item) => item.includes("youtube") || item.includes("mp4")) || null;

  return (
    <div className="bg-slate-50 pb-24 lg:pb-0">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      {/* ---------- TOP NAV ---------- */}

      <div className="border-b bg-white/90 backdrop-blur">
  <div className="mx-auto max-w-7xl px-4 py-4">

    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a3a52]"
    >
      <ArrowLeft size={18} /> Back
    </button>

  </div>
</div>

      {/* ---------- HERO ---------- */}

      <section className="relative h-[460px] overflow-hidden">

        <ImageWithFallback
          src={project.gallery?.[0] || "/placeholder.jpg"}
          alt={project.name}
          className="h-full w-full object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-1/2 w-full max-w-7xl -translate-x-1/2 px-6 pb-10 text-white">

          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1a3a52]">
            {project.status}
          </span>

          <h1 className="mt-3 text-4xl font-serif md:text-5xl">
            {project.name}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-gray-200">
            <MapPin size={18} /> {project.location}
          </p>

        </div>
      </section>

      {/* ---------- PRICE INFO ---------- */}

      <section className="-mt-14 px-4">
        <div className="mx-auto max-w-7xl rounded-2xl border bg-white p-6 shadow-xl">

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-5">

            <InfoBlock label="Configuration" value={project.configuration || "-"} />

            <div className="rounded-xl bg-[#1a3a52] p-4 text-white shadow-md">
              <p className="text-xs uppercase tracking-wide text-blue-100">
                Starting Price
              </p>
              <p className="mt-1 text-2xl font-bold">
                ₹ {project.price || "On Request"}
              </p>
            </div>

            <InfoBlock label="RERA No." value={project.rera || "Available"} />

            <InfoBlock label="Status" value={project.status} highlight />

            <InfoBlock label="Land Area" value={project.landArea || "—"} />

          </div>
        </div>
      </section>

      {/* ---------- CONTENT ---------- */}

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-3">

          <div className="space-y-12 lg:col-span-2">

            {/* OVERVIEW */}

            <Section title="Project Overview">
              <Card>
                <p className="leading-relaxed text-gray-700">
                  {project.description || "Project details coming soon."}
                </p>
              </Card>
            </Section>

            {/* VIDEO */}

            {project.video && (
  <Section title="Project Video">

    <div className="overflow-hidden rounded-xl border shadow-lg">

      {project.videoType === "youtube" ? (
        <iframe
          src={project.video}
          className="w-full h-[420px]"
          allowFullScreen
        />
      ) : (
        <video
          src={project.video}
          controls
          className="w-full"
        />
      )}

    </div>

  </Section>
)}
{project.specifications && project.specifications.length > 0 && (
  <Section title="Construction & Specifications">
    <Card>
      {project.specifications.map((spec, i) => (
        <div
          key={`${spec.label}-${i}`}
          className={`grid grid-cols-2 px-4 py-3 ${
            i % 2 === 0 ? "bg-slate-50" : "bg-white"
          }`}
        >
          <span className="text-slate-700">{spec.label}</span>

          <span className="font-semibold text-slate-900">
            {spec.value}
          </span>
        </div>
      ))}
    </Card>
  </Section>
)}

            {/* AMENITIES */}

            <Section title="Amenities">
              <div className="grid gap-3 sm:grid-cols-2">

                {project.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-black rounded-lg border bg-white p-3 shadow-sm"
                  >
                    <CheckCircle2 size={18} className="text-[#1a3a52]" />
                    <span>{amenity}</span>
                  </div>
                ))}

              </div>
            </Section>
            

            {/* GALLERY */}

            <Section title={`Gallery (${project.gallery.length})`}>

              <div className="grid gap-4 md:grid-cols-2">

                {project.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className="overflow-hidden rounded-lg border"
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${project.name} image ${i + 1}`}
                      className="aspect-[4/3] w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ))}

              </div>

            </Section>

            <MapSection project={project} />

          </div>

          {/* ---------- SIDEBAR ---------- */}

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-2xl border bg-white p-6 shadow-xl">

              <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <ShieldCheck size={20} className="text-[#1a3a52]" />
                <div>
                  <p className="text-sm font-semibold text-[#1a3a52]">
                    Verified by Ekam Properties
                  </p>
                  <p className="text-xs text-slate-600">
                    TG-RERA Certified Advisor
                  </p>
                </div>
              </div>

              <h2 className="mb-2 text-xl font-serif text-[#1a3a52]">
                Talk to a Property Expert
              </h2>

              <div className="space-y-3">

                <a
                  href={`tel:${EKAM_BUSINESS.phoneDial}`}
                  onClick={handleCallClick}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a3a52] px-4 py-3 font-semibold text-white hover:bg-[#224865]"
                >
                  <Phone size={18} /> Call Now
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleWhatsappClick}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-white"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>

                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#123147] px-4 py-3 font-semibold text-white"
                >
                  <CalendarCheck size={18} /> Book Site Visit
                </button>

                <button
                  onClick={handleBrochureClick}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border text-[#123147] px-4 py-3 text-sm"
                >
                  <Download size={16} /> Download Brochure
                </button>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ---------- MOBILE CTA ---------- */}

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 bg-white p-2 shadow-lg lg:hidden">

        <a
          href={`tel:${EKAM_BUSINESS.phoneDial}`}
          onClick={handleCallClick}
          className="flex flex-col items-center justify-center gap-1 rounded-lg bg-[#1a3a52] py-3 text-white"
        >
          <Phone size={18} />
          <span className="text-xs">Call</span>
        </a>

        <a
          href={whatsappLink}
          onClick={handleWhatsappClick}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1 rounded-lg bg-[#25D366] py-3 text-white"
        >
          <MessageCircle size={18} />
          <span className="text-xs">WhatsApp</span>
        </a>

        <button
          onClick={() => setIsLeadModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 rounded-lg bg-[#123147] py-3 text-white"
        >
          <CalendarCheck size={18} />
          <span className="text-xs">Visit</span>
        </button>

      </div>

      {/* ---------- MODALS ---------- */}

      <LeadForm
        project={project}
        open={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

      {activeImageIndex !== null && (
        <GalleryModal
          images={project.gallery}
          index={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
          onPrev={() =>
            setActiveImageIndex((prev) =>
              prev === null
                ? 0
                : (prev - 1 + project.gallery.length) %
                  project.gallery.length
            )
          }
          onNext={() =>
            setActiveImageIndex((prev) =>
              prev === null
                ? 0
                : (prev + 1) % project.gallery.length
            )
          }
        />
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 text-3xl font-serif text-[#1a3a52]">{title}</h2>
      {children}
    </section>
  );
}

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function InfoBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        highlight ? "bg-emerald-50 text-emerald-800" : "bg-slate-50"
      }`}
    >
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}