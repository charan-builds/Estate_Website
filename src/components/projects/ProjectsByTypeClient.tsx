"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Filter, Home, MapPin } from "lucide-react";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import { db } from "@/lib/firebase";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

type ProjectsByTypeClientProps = {
  type: string;
};

export default function ProjectsByTypeClient({
  type,
}: ProjectsByTypeClientProps) {
  const propertyType = type
    .replace("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const projectsQuery = query(
      collection(db, "projects"),
      where("propertyType", "==", propertyType)
    );

    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const nextProjects = snapshot.docs
        .map(mapProjectSnapshot)
        .filter(Boolean) as Project[];

      setProjects(nextProjects);
    });

    return unsubscribe;
  }, [propertyType]);

  const locations = useMemo(() => {
    const unique = new Set(
      projects.map((project) => project.location.trim()).filter((location) => location.length > 0)
    );

    return ["all", ...Array.from(unique)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = projects.filter((project) => {
      const locationMatch =
        selectedLocation === "all" || project.location === selectedLocation;

      const searchMatch =
        search.length === 0 ||
        project.name.toLowerCase().includes(search.toLowerCase());

      return locationMatch && searchMatch;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-high") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "latest") {
      result = [...result].reverse();
    }

    return result;
  }, [projects, search, selectedLocation, sort]);

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <Link
          href="/projects"
          className="mb-4 inline-block text-sm font-medium text-[#1a3a52] hover:underline"
        >
          ← Back to all projects
        </Link>

        <h1 className="mb-2 text-4xl font-serif text-[#1a3a52]">
          {propertyType} Projects
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          {filteredProjects.length} projects found
        </p>
      </div>

      <div className="sticky top-[72px] z-20 border-y bg-white py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4">
          <Filter size={18} className="text-gray-500" />

          <select
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location === "all" ? "All Locations" : location}
              </option>
            ))}
          </select>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search project"
            className="rounded-md border px-3 py-2 text-sm"
          />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="latest">Latest</option>
            <option value="price-low">Price Low → High</option>
            <option value="price-high">Price High → Low</option>
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={`/projects/${type}/${project.slug}`}>
                <ImageWithFallback
                  src={project.gallery[0]}
                  alt={project.name}
                  className="h-64 w-full object-cover transition group-hover:scale-105"
                />
              </Link>

              <div className="space-y-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-[#1a3a52]">
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

                <Link
                  href={`/projects/${type}/${project.slug}`}
                  className="block rounded-md bg-[#1a3a52] py-2 text-center text-sm font-medium text-white hover:bg-[#224865]"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <p className="mt-16 text-center text-gray-500">No projects found.</p>
        ) : null}
      </div>
    </div>
  );
}
