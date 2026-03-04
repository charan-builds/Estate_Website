"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Filter, Home, MapPin} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { db } from "@/lib/firebase";
import { PROJECT_STATUS_FILTERS } from "@/lib/constants";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";
import { EKAM_BUSINESS } from "@/lib/business";

/* ---------------- SMALL HOOK ---------------- */

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/* ---------------- PAGE ---------------- */

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] =
    useState<(typeof PROJECT_STATUS_FILTERS)[number]["value"]>("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(searchQuery);

  /* ---------------- DATA ---------------- */

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(mapProjectSnapshot)
        .filter(Boolean) as Project[];

      setProjects(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /* ---------------- FILTER OPTIONS ---------------- */

  const locations = useMemo(() => {
    const unique = new Set(
      projects
        .map((p) => p.location.trim())
        .filter((loc) => loc.length > 0)
    );
    return ["all", ...Array.from(unique).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const statusMatch =
        selectedStatus === "all" || project.status === selectedStatus;

      const locationMatch =
        selectedLocation === "all" ||
        project.location === selectedLocation;

      const searchMatch =
        debouncedSearch.length === 0 ||
        project.name.toLowerCase().includes(debouncedSearch.toLowerCase());

      return statusMatch && locationMatch && searchMatch;
    });
  }, [projects, selectedStatus, selectedLocation, debouncedSearch]);

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-[#1a3a52] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 text-4xl font-serif text-white md:text-5xl">
            Our Projects
          </h1>
          <p className="max-w-2xl text-lg text-gray-400">
            Verified residential projects across Hyderabad by a TG RERA
            certified real estate.
          </p>
        </div>
      </section>
      {/* PROPERTY CATEGORIES */}
<section className="py-12 bg-slate-50">
  <div className="mx-auto max-w-7xl px-4">

    <h2 className="mb-8 text-3xl font-serif text-[#1a3a52]">
      Browse by Property Type
    </h2>

    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">

      <Link
        href="/projects/open-plots"
        className="rounded-xl border bg-white p-6 text-center shadow hover:shadow-lg transition"
      >
        <p className="text-lg font-semibold text-[#1a3a52]">Open Plots</p>
      </Link>

      <Link
        href="/projects/villas"
        className="rounded-xl border bg-white p-6 text-center shadow hover:shadow-lg transition"
      >
        <p className="text-lg font-semibold text-[#1a3a52]">Villas</p>
      </Link>

      <Link
        href="/projects/apartments"
        className="rounded-xl border bg-white p-6 text-center shadow hover:shadow-lg transition"
      >
        <p className="text-lg font-semibold text-[#1a3a52]">Apartments</p>
      </Link>

      <Link
        href="/projects/farm-plots"
        className="rounded-xl border bg-white p-6 text-center shadow hover:shadow-lg transition"
      >
        <p className="text-lg font-semibold text-[#1a3a52]">Farm Plots</p>
      </Link>

      <Link
        href="/projects/highway-plots"
        className="rounded-xl border bg-white p-6 text-center shadow hover:shadow-lg transition"
      >
        <p className="text-lg font-semibold text-[#1a3a52]">Highway Plots</p>
      </Link>

    </div>

  </div>
</section>

      {/* FILTER BAR */}
      <section className="sticky top-[72px] z-10 border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={18} className="text-gray-500" />

            <select
              value={selectedStatus}
              onChange={(e) =>
  setSelectedStatus(
    e.target.value as (typeof PROJECT_STATUS_FILTERS)[number]["value"]
  )
}
              className="rounded-md border px-3 py-2 text-sm text-[#1a3a52]"
            >
              {PROJECT_STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm text-[#1a3a52]"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "all" ? "All Locations" : loc}
                </option>
              ))}
            </select>

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project"
              className="w-full max-w-xs rounded-md border px-3 py-2 text-sm text-[#1a3a52]"
            />
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          {loading && (
            <p className="text-center text-gray-500">Loading projects…</p>
          )}

          {!loading && (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/projects/${project.slug}`}>
                      <ImageWithFallback
                        src={project.gallery[0]}
                        alt={project.name}
                        className="h-64 w-full object-cover transition group-hover:scale-105"
                      />
                    </Link>

                    <div className="space-y-3 p-6">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-[#1a3a52]">
                          {project.status}
                        </span>
                        <span className="text-lg font-semibold text-[#1a3a52]">
                          ₹ {project.price}
                        </span>
                      </div>

                      <h2 className="text-xl font-serif text-[#1a3a52]">
                        {project.name}
                      </h2>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} /> {project.location}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home size={16} /> {project.configuration}
                      </div>

                      {/* ACTIONS */}
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="rounded-md bg-[#1a3a52] py-2 text-center text-sm font-medium text-white hover:bg-[#224865]"
                        >
                          View Details
                        </Link>

                       <a
  href={`tel:${EKAM_BUSINESS.phoneDial}`}
  className="flex items-center justify-center gap-2 rounded-md border  py-2 text-sm font-medium"
>
  <span className="text-[#1a3a52] font-bold"> Call Now</span>
</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {!filteredProjects.length && (
                <p className="mt-16 text-center text-gray-500">
                  No projects match your filters.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}