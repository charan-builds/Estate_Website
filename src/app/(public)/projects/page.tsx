"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Filter, Home, MapPin } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { db } from "@/lib/firebase";
import { PROJECT_STATUS_FILTERS } from "@/lib/constants";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<(typeof PROJECT_STATUS_FILTERS)[number]["value"]>("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const nextProjects = snapshot.docs.map(mapProjectSnapshot).filter(Boolean) as Project[];
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

  const locations = useMemo(() => {
    const unique = new Set(
      projects.map((project) => project.location.trim()).filter((location) => location.length > 0)
    );
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const statusMatch = selectedStatus === "all" || project.status === selectedStatus;
      const locationMatch = selectedLocation === "all" || project.location === selectedLocation;
      const searchMatch =
        searchQuery.trim().length === 0 ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && locationMatch && searchMatch;
    });
  }, [projects, searchQuery, selectedLocation, selectedStatus]);

  return (
    <div className="bg-white">
      <section className="bg-[#1a3a52] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 text-4xl font-serif text-white md:text-5xl">Our Projects</h1>
          <p className="max-w-2xl text-xl text-gray-200">Discover premium residential developments across Hyderabad</p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter size={18} />
              <span className="text-sm uppercase tracking-wider">Filter by</span>
            </div>

            {PROJECT_STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setSelectedStatus(filter.value)}
                className={`rounded-md px-4 py-2 text-sm transition ${
                  selectedStatus === filter.value
                    ? "bg-[#1a3a52] text-white"
                    : "border bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}

            <select
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === "all" ? "All Locations" : location}
                </option>
              ))}
            </select>

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by project name"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          {loading ? <p className="text-center text-gray-500">Loading projects...</p> : null}

          {!loading ? (
            <>
              <div className="grid gap-8 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/projects/${project.slug}`}>
                      <div className="overflow-hidden">
                        <ImageWithFallback
                          src={project.gallery[0] || "https://via.placeholder.com/600x400"}
                          alt={project.name}
                          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <div className="space-y-3 p-6">
                      <div className="flex items-center justify-between">
                        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs uppercase text-[#1a3a52]">
                          {project.status}
                        </span>
                        <p className="text-lg font-semibold text-[#1a3a52]">{project.price}</p>
                      </div>

                      <h2 className="text-xl font-serif text-[#1a3a52]">{project.name}</h2>

                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin size={16} className="mt-0.5" />
                        <span className="text-sm">{project.location}</span>
                      </div>

                      <div className="flex items-start gap-2 text-gray-600">
                        <Home size={16} className="mt-0.5" />
                        <span className="text-sm">{project.configuration}</span>
                      </div>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#1a3a52] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#224865]"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {!filteredProjects.length ? <p className="mt-16 text-center text-gray-500">No projects found</p> : null}
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
