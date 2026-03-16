"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Award, Building2, Phone, Search, ShieldCheck, Sparkles, Trees, Users } from "lucide-react";

import AnimatedCounter from "@/components/AnimatedCounter";
import FadeIn from "@/components/animations/FadeIn";
import ScaleIn from "@/components/animations/ScaleIn";
import SlideUp from "@/components/animations/SlideUp";
import StaggerContainer from "@/components/animations/StaggerContainer";
import { fadeInUpVariants } from "@/components/animations/motion";
import FloatingContactBar from "@/components/FloatingContactBar";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import FilteredProjects from "@/components/projects/FilteredProjects";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { trackEvent } from "@/lib/analytics";
import { EKAM_BUSINESS } from "@/lib/business";
import { db } from "@/lib/firebase";
import { createInteractionLead } from "@/lib/lead";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

const heroWords = ["Building", "Homes,", "Creating", "Landmarks"];

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    propertyType: "",
    location: "",
    budget: "",
    status: "",
  });
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const leadModalShownRef = useRef(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.7]);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const nextProjects = snapshot.docs
          .map(mapProjectSnapshot)
          .filter(Boolean) as Project[];

        setProjects(nextProjects);
        setLoading(false);
      },
      () => {
        setProjects([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      if (progress >= 0.6 && !leadModalShownRef.current) {
        leadModalShownRef.current = true;
        setIsLeadModalOpen(true);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const statistics = [
    { value: "160 Acres", label: "Master planned land bank" },
    { value: "870 Plots", label: "Carefully laid inventory" },
    { value: "10+ Amenities", label: "Lifestyle-first conveniences" },
    { value: "5 Minutes", label: "To University" },
  ];

  const highlights = [
    {
      icon: Building2,
      title: "Architected Communities",
      description: "Thoughtfully planned layouts, arrival experiences, and premium streetscapes.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Documentation",
      description: "Transparent approvals and buyer-first guidance through every milestone.",
    },
    {
      icon: Award,
      title: "Signature Delivery",
      description: "A design-forward approach that balances value, speed, and lasting quality.",
    },
  ];

  const amenities = [
    { icon: Trees, label: "Landscaped green pockets" },
    { icon: Sparkles, label: "Elegant entrance features" },
    { icon: Users, label: "Community-centric recreation" },
    { icon: ShieldCheck, label: "Secure gated access" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Happy Homeowner",
      quote:
        "Ekam Properties delivered our dream home on time with exceptional quality. The team was transparent throughout the process.",
    },
    {
      name: "Priya Sharma",
      role: "Property Investor",
      quote:
        "Professional service from start to finish. Their investment guidance helped us make the right choice.",
    },
    {
      name: "Amit Patel",
      role: "First-time Buyer",
      quote:
        "Verified projects with all approvals. No hidden costs, exactly as promised.",
    },
  ];

  const featuredProjects = useMemo(() => projects.slice(0, 3), [projects]);

  const availableLocations = useMemo(() => {
    return Array.from(new Set(projects.map((project) => project.location).filter(Boolean))).sort();
  }, [projects]);

  const locationHighlights = useMemo(() => {
    return availableLocations.slice(0, 5).map((location) => ({
      name: location,
      count: projects.filter((project) => project.location === location).length,
    }));
  }, [availableLocations, projects]);

  function applyFilters() {
    const params = new URLSearchParams();

    if (searchFilters.location) {
      params.set("location", searchFilters.location.toLowerCase());
    }
    if (searchFilters.propertyType) {
      params.set("type", searchFilters.propertyType);
    }
    if (searchFilters.budget) {
      params.set("budget", searchFilters.budget);
    }
    if (searchFilters.status) {
      params.set("status", searchFilters.status);
    }

    trackEvent("homepage_filter_search", {
      property_type: searchFilters.propertyType || "all",
      location: searchFilters.location || "all",
      budget: searchFilters.budget || "all",
      status: searchFilters.status || "all",
    });

    router.push(`/projects?${params.toString()}`);
  }

  function handleBookVisit() {
    setIsLeadModalOpen(true);
  }

  return (
    <div className="bg-white pb-20 lg:pb-0">
      <section ref={heroRef} className="relative min-h-[720px] overflow-hidden bg-gray-900">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759472018220-d6e258796fce"
            alt="Hero"
            className="h-[120%] w-full object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-[#1a3a52]/75"
          style={{ opacity: heroOverlayOpacity }}
        />

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-4 py-24">
          <div className="grid w-full gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-3xl text-white">
              <FadeIn className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                Premium real estate experiences across Hyderabad
              </FadeIn>

              <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-5xl font-serif leading-tight md:text-7xl">
                {heroWords.map((word, index) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 42 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + index * 0.08,
                      type: "spring",
                      stiffness: 110,
                      damping: 18,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl text-lg text-white/90 md:text-xl"
              >
                Experience premium living spaces designed for modern lifestyles,
                investment clarity, and elevated everyday comfort.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease: "easeOut" }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 16px 36px rgba(255,255,255,0.18)" }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 text-[#1a3a52]"
                  >
                    Explore Projects <ArrowRight size={20} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, boxShadow: "0 16px 36px rgba(0,0,0,0.18)" }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center border-2 border-white px-8 py-4 text-white backdrop-blur-sm"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            <ScaleIn className="rounded-2xl border border-white/40 bg-white/70 p-7 text-[#1a3a52] shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-white/90 via-white/75 to-white/55 p-1">
                <div className="rounded-[1.35rem] bg-gradient-to-br from-white/90 to-white/65 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#1a3a52]/60">
                    Signature Living
                  </p>
                  <p className="mt-4 text-3xl font-serif leading-tight text-[#1a3a52]">
                    Curated projects with premium planning, transparent guidance, and standout locations.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {statistics.slice(0, 2).map((item) => (
                      <div key={item.label} className="rounded-xl bg-white p-4 shadow-lg">
                        <div className="text-3xl font-serif text-[#1a3a52]">
                          <AnimatedCounter value={item.value} />
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      <SlideUp className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-[2rem] border border-slate-200 bg-gray-50 p-6 shadow-sm md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-serif text-[#1a3a52] md:text-3xl">Find Your Dream Property</h2>
                <p className="mt-2 text-gray-600">
                  Refine by category, location, and budget to move faster.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Location</label>
                <select
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-3 focus:border-[#1a3a52] focus:outline-none"
                >
                  <option value="">All Locations</option>
                  {availableLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Property Type</label>
                <select
                  value={searchFilters.propertyType}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-3 focus:border-[#1a3a52] focus:outline-none"
                >
                  <option value="">All Types</option>
                  <option value="plots">Plots</option>
                  <option value="apartments">Apartments</option>
                  <option value="villas">Villas</option>
                  <option value="offices">Offices</option>
                  <option value="retail">Retail Spaces</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Budget</label>
                <select
                  value={searchFilters.budget}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, budget: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-3 focus:border-[#1a3a52] focus:outline-none"
                >
                  <option value="">Any Budget</option>
                  <option value="under-20">Under ₹20L</option>
                  <option value="20-40">₹20L - ₹40L</option>
                  <option value="40-100">₹40L - ₹1Cr</option>
                  <option value="100+">Above ₹1Cr</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Project Status</label>
                <select
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-3 focus:border-[#1a3a52] focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="New Launch">New Launch</option>
                </select>
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 14px 28px rgba(26,58,82,0.18)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={applyFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1a3a52] px-4 py-3 text-white transition-colors hover:bg-[#2a4a62]"
                >
                  <Search size={18} />
                  Search
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </SlideUp>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-4xl font-serif text-[#1a3a52]">Explore Projects by Location</h2>
            <p className="mt-4 text-lg text-gray-600">
              Browse live inventory in key growth corridors around Hyderabad.
            </p>
          </FadeIn>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {locationHighlights.map((location) => (
              <motion.div
                key={location.name}
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <Link
                  href={`/projects?location=${location.name.toLowerCase()}`}
                  className="block rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm hover:bg-white hover:shadow-xl"
                >
                  <h3 className="text-2xl font-serif text-[#1a3a52]">{location.name}</h3>
                  <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#1a3a52]/60">
                    {location.count} Projects
                  </p>
                </Link>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1a3a52] py-20">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />
        <div className="relative mx-auto max-w-7xl px-4">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-serif text-white">Statistics That Signal Scale</h2>
            <p className="mt-4 text-gray-300">
              A snapshot of the land, inventory, amenities, and accessibility shaping our communities.
            </p>
          </FadeIn>
          <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statistics.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeInUpVariants}
                className="rounded-[1.75rem] border border-white/10 bg-white/10 p-8 text-center backdrop-blur-sm"
              >
                <div className="text-5xl font-serif text-white">
                  <AnimatedCounter value={item.value} />
                </div>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/60">{item.label}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-serif text-[#1a3a52]">Featured Projects</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover our latest premium communities, curated for stronger first impressions and smoother buying journeys.
            </p>
          </FadeIn>

          {loading ? <p className="mt-12 text-center text-gray-500">Loading projects...</p> : null}
          {!loading && !featuredProjects.length ? <p className="mt-12 text-center text-gray-500">No projects available</p> : null}

          {!loading && featuredProjects.length ? (
            <FilteredProjects projects={featuredProjects} />
          ) : null}

          <SlideUp className="mt-12 text-center">
            <Link href="/projects" className="inline-flex items-center gap-2 text-[#1a3a52]">
              View All Projects <ArrowRight size={20} />
            </Link>
          </SlideUp>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <SlideUp>
              <h2 className="text-4xl font-serif text-[#1a3a52]">Amenities Designed Around Lifestyle</h2>
              <p className="mt-4 text-lg text-gray-600">
                Each community is shaped to feel polished from arrival to everyday living, with details that improve comfort and perceived value.
              </p>
              <StaggerContainer className="mt-8 grid gap-4 sm:grid-cols-2">
                {amenities.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={fadeInUpVariants}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[#1a3a52] p-3 text-white">
                      <item.icon size={18} />
                    </div>
                    <p className="text-lg font-medium text-[#1a3a52]">{item.label}</p>
                  </motion.div>
                ))}
              </StaggerContainer>
            </SlideUp>

            <ScaleIn className="overflow-hidden rounded-[2rem]">
              <div className="group relative aspect-[4/5] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80"
                  alt="Premium amenities"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[1.5rem] bg-white/90 p-5 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#1a3a52]/70">Experience</p>
                  <p className="mt-2 text-2xl font-serif text-[#1a3a52]">
                    Elevated open spaces, premium detailing, and stronger on-site presence.
                  </p>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-serif text-[#1a3a52]">Highlights That Build Confidence</h2>
            <p className="mt-4 text-lg text-gray-600">
              A premium buying experience comes from planning, documentation, and long-term trust working together.
            </p>
          </FadeIn>
          <StaggerContainer className="mt-12 grid gap-8 md:grid-cols-3">
            {highlights.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUpVariants}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-5 inline-flex rounded-full bg-[#1a3a52] p-4 text-white">
                  <item.icon size={22} />
                </div>
                <h3 className="text-2xl font-serif text-[#1a3a52]">{item.title}</h3>
                <p className="mt-3 text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <SlideUp>
              <p className="text-sm uppercase tracking-[0.3em] text-[#1a3a52]/60">Testimonials</p>
              <h2 className="mt-4 text-4xl font-serif text-[#1a3a52]">What Our Customers Say</h2>
              <p className="mt-4 text-lg text-gray-600">
                Real buyers value the clarity, professionalism, and confidence they feel working with Ekam Properties.
              </p>
            </SlideUp>
            <ScaleIn>
              <TestimonialCarousel testimonials={testimonials} />
            </ScaleIn>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1a3a52] py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <FadeIn>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Property Guidance</p>
              <h2 className="mt-4 text-4xl font-serif">Talk to a Property Expert</h2>
              <p className="mt-4 max-w-2xl text-lg text-white/80">
                Speak with our team for shortlisted options, price guidance, approvals, and visit planning.
              </p>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-3">
              <motion.a
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${EKAM_BUSINESS.phoneDial}`}
                onClick={() => createInteractionLead({ source: "call" })}
                className="rounded-2xl bg-white/10 px-5 py-6 text-center backdrop-blur"
              >
                <Phone className="mx-auto mb-3" size={22} />
                Call
              </motion.a>
              <motion.a
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/${EKAM_BUSINESS.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => createInteractionLead({ source: "whatsapp" })}
                className="rounded-2xl bg-white/10 px-5 py-6 text-center backdrop-blur"
              >
                <Users className="mx-auto mb-3" size={22} />
                WhatsApp
              </motion.a>
              <motion.button
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookVisit}
                className="rounded-2xl bg-white px-5 py-6 text-center text-[#1a3a52]"
              >
                <Search className="mx-auto mb-3" size={22} />
                Book Visit
              </motion.button>
            </StaggerContainer>
          </div>
        </div>
      </section>

      <FloatingContactBar onBookVisit={handleBookVisit} />
      <LeadCaptureModal open={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </div>
  );
}
