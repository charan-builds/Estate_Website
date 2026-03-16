"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
 
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  MapPin,
  Phone,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Ruler,
  Layers,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SlideUp from "@/components/animations/SlideUp";
import StaggerContainer from "@/components/animations/StaggerContainer";
import { fadeInUpVariants } from "@/components/animations/motion";
import { trackEvent } from "@/lib/analytics";
import { EKAM_BUSINESS } from "@/lib/business";
import { db } from "@/lib/firebase";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import GalleryModal from "@/components/projects/GalleryModal";
import LeadForm from "@/components/projects/LeadForm";
import MapSection from "@/components/projects/MapSection";
import ProjectsSkeletonGrid from "@/components/projects/ProjectsSkeletonGrid";
import { createInteractionLead } from "@/lib/lead";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project, ProjectVideo } from "@/types/project";

type Props = {
  project: Project;
};

export default function ProjectDetailsClient({ project }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  /* ---------------- TRACKING ---------------- */

  function handleCallClick() {
    createInteractionLead({
      projectId: project.id,
      projectName: project.name,
      source: "call",
    });
    trackEvent("call_now_click", {
      project_slug: project.slug,
      project_name: project.name,
    });
  }

  function handleWhatsappClick() {
    createInteractionLead({
      projectId: project.id,
      projectName: project.name,
      source: "whatsapp",
    });
    trackEvent("whatsapp_click", {
      project_slug: project.slug,
      project_name: project.name,
    });
  }

  function handleBrochureClick() {
    createInteractionLead({
      projectId: project.id,
      projectName: project.name,
      source: "brochure",
    });
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

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const currentPriceBucket = project.price.replace(/[^\d.]/g, "");
      const related = snapshot.docs
        .map(mapProjectSnapshot)
        .filter((item): item is Project => item !== null)
        .filter((item) => item.slug !== project.slug)
        .filter(
          (item) =>
            item.location === project.location ||
            item.propertyType === project.propertyType ||
            item.price.replace(/[^\d.]/g, "") === currentPriceBucket
        )
        .slice(0, 4);

      setRecommendedProjects(related);
      setLoadingRecommended(false);
    });

    return unsubscribe;
  }, [project.location, project.price, project.propertyType, project.slug]);

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
  const normalizedVideos: ProjectVideo[] = useMemo(() => {
    if (Array.isArray(project.videos) && project.videos.length > 0) {
      return project.videos.filter(
        (item): item is ProjectVideo =>
          Boolean(item?.url) &&
          typeof item.url === "string" &&
          (item.type === "youtube" || item.type === "upload")
      );
    }

    if (project.video) {
      return [
        {
          url: project.video,
          type: project.videoType === "upload" ? "upload" : "youtube",
        },
      ];
    }

    return [];
  }, [project.video, project.videoType, project.videos]);

  const projectHighlights = useMemo(
    () =>
      (project.highlights ?? []).filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0
      ),
    [project.highlights]
  );

  const projectStats = useMemo(
    () =>
      [
        {
          label: "Plot Size",
          value: project.plotSize,
          icon: Ruler,
        },
        {
          label: "Total Units",
          value: project.totalUnits,
          icon: Layers,
        },
        {
          label: "Launch Year",
          value: project.launchYear,
          icon: CalendarDays,
        },
      ].filter((item): item is { label: string; value: string; icon: typeof Ruler } => Boolean(item.value)),
    [project.launchYear, project.plotSize, project.totalUnits]
  );

  const hasBrochure = Boolean(project.brochureUrl && project.brochureUrl.trim().length > 0);

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

        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="h-full w-full"
        >
          <ImageWithFallback
            src={project.gallery?.[0] || "/placeholder.jpg"}
            alt={project.name}
            className="h-full w-full object-cover"
            priority
          />
        </motion.div>

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

      <SlideUp className="-mt-14 px-4">
        <div className="mx-auto max-w-7xl rounded-2xl border bg-white p-6 shadow-xl">

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 md:grid-cols-5">

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

          </StaggerContainer>
        </div>
      </SlideUp>

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

            {projectStats.length > 0 && (
              <Section title="Project Stats">
                <StaggerContainer className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {projectStats.map((item) => (
                    <motion.div variants={fadeInUpVariants} key={item.label} className="rounded-xl border bg-white p-4 shadow-sm">
                      <div className="mb-3 inline-flex rounded-full bg-slate-100 p-2 text-[#1a3a52]">
                        <item.icon size={16} />
                      </div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </Section>
            )}

            {projectHighlights.length > 0 && (
              <Section title="Project Highlights">
                <Card>
                  <StaggerContainer className="space-y-3">
                    {projectHighlights.map((item, index) => (
                      <motion.li variants={fadeInUpVariants} key={`${item}-${index}`} className="flex items-start gap-3 text-slate-700">
                        <Sparkles size={17} className="mt-0.5 text-[#1a3a52]" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </StaggerContainer>
                </Card>
              </Section>
            )}

            {normalizedVideos.length > 0 && (
              <Section title="Project Videos">
                <div className="grid gap-4 sm:grid-cols-2">
                  {normalizedVideos.map((item, index) => (
                    <div key={`${item.url}-${index}`} className="overflow-hidden rounded-xl border bg-black shadow-md">
                      {item.type === "youtube" ? (
                        <iframe
                          src={item.url}
                          className="h-[220px] w-full md:h-[280px]"
                          loading="lazy"
                          allowFullScreen
                          title={`${project.name} video ${index + 1}`}
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          preload="metadata"
                          className="h-[220px] w-full object-cover md:h-[280px]"
                        />
                      )}
                    </div>
                  ))}
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
                <StaggerContainer className="grid gap-3 sm:grid-cols-2">

                {project.amenities.map((amenity, i) => (
                  <motion.div
                    variants={fadeInUpVariants}
                    key={i}
                    className="flex items-center gap-2 text-black rounded-lg border bg-white p-3 shadow-sm"
                  >
                    <CheckCircle2 size={18} className="text-[#1a3a52]" />
                    <span>{amenity}</span>
                  </motion.div>
                ))}

              </StaggerContainer>
            </Section>
            

            {/* GALLERY */}

            <Section title={`Gallery (${project.gallery.length})`}>

              <StaggerContainer className="grid gap-4 md:grid-cols-2">

                {project.gallery.map((img, i) => (
                  <motion.button
                    variants={fadeInUpVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className="overflow-hidden rounded-lg border"
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${project.name} image ${i + 1}`}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.08]"
                    />
                  </motion.button>
                ))}

              </StaggerContainer>

            </Section>
            {project.nearbyLocations && project.nearbyLocations.length > 0 && (
              <Section title="Nearby Locations">
                <StaggerContainer className="grid gap-3 sm:grid-cols-2">
                  {project.nearbyLocations.map((place, i) => (
                    <motion.div
                      variants={fadeInUpVariants}
                      key={i}
                      className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 text-slate-900">
                        <MapPin size={16} className="text-[#1a3a52]" />
                        <span className="font-semibold">{place.name}</span>
                      </div>
                      <p className="mt-2 inline-flex rounded-full bg-[#1a3a52]/10 px-3 py-1 text-sm font-semibold text-[#1a3a52]">
                        {place.distance}
                      </p>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </Section>
            )}
            <MapSection project={project} />

            <Section title="Recommended Projects">
              {loadingRecommended ? <ProjectsSkeletonGrid /> : null}
              {!loadingRecommended && recommendedProjects.length ? (
                <StaggerContainer className="grid gap-6 md:grid-cols-2">
                  {recommendedProjects.map((item) => (
                    <motion.div
                      key={item.id || item.slug}
                      variants={fadeInUpVariants}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >
                      <Link href={`/projects/${item.slug}`}>
                        <ImageWithFallback
                          src={item.gallery[0]}
                          alt={item.name}
                          className="h-48 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.08]"
                        />
                      </Link>
                      <div className="space-y-3 p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#1a3a52]/60">
                          {item.propertyType}
                        </p>
                        <h3 className="text-xl font-serif text-[#1a3a52]">{item.name}</h3>
                        <p className="text-sm text-slate-600">{item.location}</p>
                        <Link
                          href={`/projects/${item.slug}`}
                          className="inline-flex rounded-md bg-[#1a3a52] px-4 py-2 text-sm font-medium text-white"
                        >
                          View Project
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </StaggerContainer>
              ) : null}
              {!loadingRecommended && !recommendedProjects.length ? (
                <Card>
                  <p className="text-slate-600">More recommended projects will appear here soon.</p>
                </Card>
              ) : null}
            </Section>

          </div>

          {/* ---------- SIDEBAR ---------- */}

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">

            <SlideUp className="rounded-2xl border bg-white p-6 shadow-xl">

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

                <motion.a
                  href={`tel:${EKAM_BUSINESS.phoneDial}`}
                  onClick={handleCallClick}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a3a52] px-4 py-3 font-semibold text-white hover:bg-[#224865]"
                >
                  <Phone size={18} /> Call Now
                </motion.a>

                <motion.a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleWhatsappClick}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-white"
                >
                  <MessageCircle size={18} /> WhatsApp
                </motion.a>

                <motion.button
                  onClick={() => setIsLeadModalOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#123147] px-4 py-3 font-semibold text-white"
                >
                  <CalendarCheck size={18} /> Book Site Visit
                </motion.button>

               {hasBrochure ? (
  <a
  href={`${project.brochureUrl}?fl_attachment`}
  target="_blank"
  rel="noopener noreferrer"
  onClick={handleBrochureClick}
  className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm text-[#123147]"
>
  <Download size={16} />
  Download Brochure
</a>
) : (
  <button
    disabled
    className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm text-slate-400"
  >
    <Download size={16} />
    Brochure Coming Soon
  </button>
)}

              </div>

            </SlideUp>

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
    <SlideUp>
      <section>
        <h2 className="mb-4 text-3xl font-serif text-[#1a3a52]">{title}</h2>
        {children}
      </section>
    </SlideUp>
  );
}

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInUpVariants} className="rounded-xl border bg-white p-6 shadow-sm">
      {children}
    </motion.div>
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
    <motion.div
      variants={fadeInUpVariants}
      className={`rounded-xl p-4 ${
        highlight ? "bg-emerald-50 text-emerald-800" : "bg-slate-50"
      }`}
    >
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </motion.div>
  );
}
 
