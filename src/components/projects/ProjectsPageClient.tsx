"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { Filter, Heart, MapPin, Scale } from "lucide-react";

import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer from "@/components/animations/StaggerContainer";
import { fadeInUpVariants } from "@/components/animations/motion";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import ProjectsSkeletonGrid from "@/components/projects/ProjectsSkeletonGrid";
import { PROJECT_STATUS_FILTERS, PROJECT_SUBCATEGORY_OPTIONS } from "@/lib/constants";
import useCompareProjects from "@/hooks/useCompareProjects";
import useSavedProjects from "@/hooks/useSavedProjects";
import { db } from "@/lib/firebase";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project, ProjectMainCategory, ProjectSubCategory } from "@/types/project";

type HeroMeta = {
  label: string;
  heroTitle: string;
  heroSubtitle: string;
  mainCategory: ProjectMainCategory;
};

const SUBCATEGORY_META = Object.entries(PROJECT_SUBCATEGORY_OPTIONS).reduce<Record<string, HeroMeta>>(
  (accumulator, [mainCategory, items]) => {
    items.forEach((item) => {
      accumulator[item.value] = {
        label: item.label,
        heroTitle: item.heroTitle,
        heroSubtitle: item.heroSubtitle,
        mainCategory: mainCategory as ProjectMainCategory,
      };
    });

    return accumulator;
  },
  {}
);

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function parseBudgetRange(price: string) {
  const numeric = Number(price.replace(/[^\d.]/g, ""));

  if (!numeric) {
    return "unknown";
  }
  if (numeric < 20) {
    return "under-20";
  }
  if (numeric <= 40) {
    return "20-40";
  }
  if (numeric <= 100) {
    return "40-100";
  }
  return "100+";
}

export default function ProjectsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") as ProjectSubCategory | null;
  const queryLocation = searchParams.get("location");
  const queryBudget = searchParams.get("budget");
  const queryStatus = searchParams.get("status");
  const queryAmenity = searchParams.get("amenity");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] =
    useState<(typeof PROJECT_STATUS_FILTERS)[number]["value"]>((queryStatus as (typeof PROJECT_STATUS_FILTERS)[number]["value"]) || "all");
  const [selectedLocation, setSelectedLocation] = useState(queryLocation || "all");
  const [selectedBudget, setSelectedBudget] = useState(queryBudget || "all");
  const [selectedAmenity, setSelectedAmenity] = useState(queryAmenity || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(searchQuery);
  const { isSaved, toggleSavedProject } = useSavedProjects();
  const { comparedProjectIds, isCompared, toggleComparedProject } = useCompareProjects();

  useEffect(() => {
    setSelectedLocation(queryLocation || "all");
    setSelectedBudget(queryBudget || "all");
    setSelectedStatus((queryStatus as (typeof PROJECT_STATUS_FILTERS)[number]["value"]) || "all");
    setSelectedAmenity(queryAmenity || "all");
  }, [queryAmenity, queryBudget, queryLocation, queryStatus]);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const data = snapshot.docs
          .map(mapProjectSnapshot)
          .filter(Boolean) as Project[];

        setProjects(data);
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
    const params = new URLSearchParams(searchParams.toString());

    if (selectedLocation !== "all") {
      params.set("location", selectedLocation);
    } else {
      params.delete("location");
    }
    if (selectedBudget !== "all") {
      params.set("budget", selectedBudget);
    } else {
      params.delete("budget");
    }
    if (selectedStatus !== "all") {
      params.set("status", selectedStatus);
    } else {
      params.delete("status");
    }
    if (selectedAmenity !== "all") {
      params.set("amenity", selectedAmenity);
    } else {
      params.delete("amenity");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `/projects?${nextQuery}` : "/projects", { scroll: false });
  }, [router, searchParams, selectedAmenity, selectedBudget, selectedLocation, selectedStatus]);

  const locations = useMemo(() => {
    const unique = new Set(
      projects.map((project) => project.location.trim()).filter((location) => location.length > 0)
    );

    return ["all", ...Array.from(unique).sort()];
  }, [projects]);

  const amenities = useMemo(() => {
    const unique = new Set(
      projects.flatMap((project) => project.amenities || []).map((amenity) => amenity.trim()).filter(Boolean)
    );

    return ["all", ...Array.from(unique).sort()];
  }, [projects]);

  const heroMeta = type ? SUBCATEGORY_META[type] : null;

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const typeMatch = !type || project.subCategory === type;
      const statusMatch = selectedStatus === "all" || project.status === selectedStatus;
      const locationMatch =
        selectedLocation === "all" || project.location.toLowerCase() === selectedLocation.toLowerCase();
      const budgetMatch = selectedBudget === "all" || parseBudgetRange(project.price) === selectedBudget;
      const amenityMatch =
        selectedAmenity === "all" || project.amenities.some((amenity) => amenity === selectedAmenity);
      const searchMatch =
        debouncedSearch.length === 0 ||
        project.name.toLowerCase().includes(debouncedSearch.toLowerCase());

      return typeMatch && statusMatch && locationMatch && budgetMatch && amenityMatch && searchMatch;
    });
  }, [debouncedSearch, projects, selectedAmenity, selectedBudget, selectedLocation, selectedStatus, type]);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#1a3a52] py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-serif md:text-5xl">
              {heroMeta?.heroTitle || "Discover Premium Real Estate Projects"}
            </h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              {heroMeta?.heroSubtitle ||
                "Explore verified plots, villas, apartments, and more curated by Ekam Properties across Hyderabad."}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="sticky top-[72px] z-20 border-b bg-white py-4 shadow-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 md:grid-cols-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter size={18} />
            Filters
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as (typeof PROJECT_STATUS_FILTERS)[number]["value"])} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]/20">
            {PROJECT_STATUS_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1a3a52] shadow-sm focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]/20">
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <select value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1a3a52] shadow-sm focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]/20">
            <option value="all">All Budgets</option>
            <option value="under-20">Under ₹20L</option>
            <option value="20-40">₹20L - ₹40L</option>
            <option value="40-100">₹40L - ₹1Cr</option>
            <option value="100+">Above ₹1Cr</option>
          </select>
          <select value={selectedAmenity} onChange={(e) => setSelectedAmenity(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1a3a52] shadow-sm focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]/20">
            <option value="all">All Amenities</option>
            {amenities.map((amenity) => (
              <option key={amenity} value={amenity}>{amenity}</option>
            ))}
          </select>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search project" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]/20" />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-serif text-[#1a3a52]">{heroMeta?.label || "All Projects"}</h2>
              <p className="mt-2 text-gray-500">{loading ? "Loading..." : `${filteredProjects.length} projects found`}</p>
            </div>
            {comparedProjectIds.length > 1 ? (
              <button type="button" onClick={() => router.push("/compare")} className="rounded-lg bg-[#1a3a52] px-4 py-2 text-sm font-medium text-white">
                Compare Projects ({comparedProjectIds.length})
              </button>
            ) : null}
          </div>

          {loading ? <ProjectsSkeletonGrid /> : null}

          {!loading && filteredProjects.length ? (
            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const projectKey = project.id || project.slug;
                return (
                  <motion.article key={projectKey} variants={fadeInUpVariants} whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-xl">
                    <div className="relative">
                      <Link href={`/projects/${project.slug}`}>
                        <ImageWithFallback src={project.gallery[0]} alt={project.name} className="h-64 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.08]" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" />
                      </Link>
                      <button type="button" onClick={() => toggleSavedProject(projectKey)} className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-[#1a3a52] shadow">
                        <Heart size={16} className={isSaved(projectKey) ? "fill-[#1a3a52]" : ""} />
                      </button>
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#1a3a52] shadow">{project.status}</span>
                        {project.hotDeal ? <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-rose-700 shadow">Hot Deal</span> : null}
                      </div>
                    </div>

                    <div className="space-y-3 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.2em] text-[#1a3a52]/70">{project.propertyType}</span>
                        <span className="font-semibold text-[#1a3a52]">₹ {project.price}</span>
                      </div>
                      <h3 className="text-lg font-serif text-[#1a3a52]">{project.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={16} /> {project.location}</div>
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input type="checkbox" checked={isCompared(projectKey)} onChange={() => toggleComparedProject(projectKey)} />
                        <Scale size={15} />
                        Compare
                      </label>
                      <Link href={`/projects/${project.slug}`} className="block rounded-md bg-[#1a3a52] py-2 text-center text-sm font-medium text-white hover:bg-[#224865]">View Details</Link>
                    </div>
                  </motion.article>
                );
              })}
            </StaggerContainer>
          ) : null}

          {!loading && filteredProjects.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <h3 className="text-2xl font-serif text-[#1a3a52]">No projects available yet.</h3>
              <p className="mt-3 text-gray-600">We&apos;re curating more options for this category. Reach out and we&apos;ll share upcoming inventory.</p>
              <Link href="/contact" className="mt-6 inline-flex rounded-md bg-[#1a3a52] px-6 py-3 text-sm font-medium text-white hover:bg-[#224865]">Contact Us for Upcoming Projects</Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
