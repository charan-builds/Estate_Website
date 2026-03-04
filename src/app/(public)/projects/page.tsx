"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Filter, MapPin } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { db } from "@/lib/firebase";
import { PROJECT_STATUS_FILTERS } from "@/lib/constants";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";
import { ImageWithFallback } from "@/components/ImageWithFallback";

/* ---------------- SMALL HOOK ---------------- */

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/* ---------------- PROPERTY TYPES ---------------- */

const PROPERTY_TYPES = [
  {
    name: "Open Plots",
    slug: "open-plots",
    image: "/property-types/open-plots.jpeg",
    description: "Residential plots ideal for building your dream home.",
  },
  {
    name: "Villas",
    slug: "villas",
    image: "/property-types/villas.jpeg",
    description: "Luxury gated community villas with modern amenities.",
  },
  {
    name: "Apartments",
    slug: "apartments",
    image: "/property-types/apartments.jpeg",
    description: "2, 3 & 4 BHK apartments in prime city locations.",
  },
  {
    name: "Farm Plots",
    slug: "farm-plots",
    image: "/property-types/farm-plots.jpeg",
    description: "Peaceful farmland plots for weekend homes.",
  },
  {
    name: "Highway Plots",
    slug: "highway-plots",
    image: "/property-types/highway-plots.jpeg",
    description: "Highway facing plots with strong investment potential.",
  },
];

/* ---------------- PAGE ---------------- */

export default function ProjectsPage() {
  const params = useParams();
const type = params?.type as string | undefined;
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] =
    useState<(typeof PROJECT_STATUS_FILTERS)[number]["value"]>("all");

  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(searchQuery);

/* ---------------- FETCH DATA ---------------- */

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

/* ---------------- LOCATIONS ---------------- */

  const locations = useMemo(() => {
    const unique = new Set(
      projects
        .map((p) => p.location.trim())
        .filter((loc) => loc.length > 0)
    );

    return ["all", ...Array.from(unique).sort()];
  }, [projects]);

/* ---------------- FILTER PROJECTS ---------------- */

  const filteredProjects = useMemo(() => {
  return projects.filter((project) => {
    const typeMatch =
      !type ||
      project.propertyType?.toLowerCase().replace(/\s/g, "-") === type;

    const statusMatch =
      selectedStatus === "all" || project.status === selectedStatus;

    const locationMatch =
      selectedLocation === "all" || project.location === selectedLocation;

    const searchMatch =
      debouncedSearch.length === 0 ||
      project.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    return typeMatch && statusMatch && locationMatch && searchMatch;
  });
}, [projects, selectedStatus, selectedLocation, debouncedSearch, type]);
/* ---------------- UI ---------------- */

  return (
    <div className="bg-white">

{/* HERO */}

      <section className="bg-[#1a3a52] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">

          <h1 className="text-4xl font-serif md:text-5xl">
            Discover Premium Real Estate Projects
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            Explore verified plots, villas and apartments curated by Ekam
            Properties across Hyderabad.
          </p>

        </div>
      </section>

{/* FILTER BAR */}

<section className="sticky top-[72px] z-20 border-b bg-white py-4 shadow-sm">

<div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 md:flex md:flex-wrap md:items-center md:gap-4">
<Filter size={18} className="text-black-1000" />

{/* STATUS */}

<select
  value={selectedStatus}
  onChange={(e) =>
    setSelectedStatus(
      e.target.value as (typeof PROJECT_STATUS_FILTERS)[number]["value"]
    )
  }
  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-black-1000 shadow-sm focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]/20"
>
{PROJECT_STATUS_FILTERS.map((f) => (
<option key={f.value} value={f.value}>
{f.label}
</option>
))}
</select>

{/* LOCATION */}

<select
  value={selectedLocation}
  onChange={(e) => setSelectedLocation(e.target.value)}
  className="min-w-[220px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1a3a52] shadow-sm focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]/20"
>
  <option value="all">All Locations</option>

  {locations.map((loc) => (
    <option key={loc} value={loc}>
      {loc}
    </option>
  ))}
</select>

{/* SEARCH */}
<div className="relative">
  <input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search project"
    className="min-w-[220px] rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-[#1a3a52] focus:outline-none focus:ring-2 focus:ring-[#1a3a52]/20"
  />
</div>

</div>
</section>

{/* PROPERTY TYPES */}

<section className="py-20 bg-slate-50">

<div className="mx-auto max-w-7xl px-4">

<div className="mb-12 text-center">

<h2 className="text-3xl font-serif text-[#1a3a52]">
Browse by Property Type
</h2>

<p className="mt-3 text-gray-500">
Find the right property category for your investment or dream home.
</p>

</div>

<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

{PROPERTY_TYPES.map((type) => (

<Link
key={type.slug}
href={`/projects/${type.slug}`}
className="group relative overflow-hidden rounded-xl shadow-md transition hover:-translate-y-2 hover:shadow-xl"
>

<Image
src={type.image}
alt={type.name}
width={500}
height={300}
className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

<div className="absolute bottom-4 left-4 text-white">

<h3 className="text-lg font-semibold">{type.name}</h3>

<p className="text-xs text-gray-200 opacity-0 transition group-hover:opacity-100">
{type.description}
</p>

</div>

</Link>

))}

</div>
</div>
</section>

{/* PROJECT GRID */}

<section className="py-20">

<div className="mx-auto max-w-7xl px-4">

<h2 className="mb-10 text-3xl font-serif text-[#1a3a52]">
All Projects
</h2>

{loading && (
<p className="text-center text-gray-500">
Loading projects...
</p>
)}

{!loading && (

<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

{filteredProjects.map((project) => (

<article
key={project.id}
className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
>

<Link href={`/projects/${project.slug}`}>

<ImageWithFallback
src={project.gallery[0]}
alt={project.name}
className="h-64 w-full object-cover"
/>

</Link>

<div className="space-y-3 p-6">

<div className="flex items-center justify-between">

<span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-[#1a3a52]">
{project.status}
</span>

<span className="font-semibold text-[#1a3a52]">
₹ {project.price}
</span>

</div>

<h3 className="text-lg font-serif text-[#1a3a52]">
{project.name}
</h3>

<div className="flex items-center gap-2 text-sm text-gray-600">
<MapPin size={16} /> {project.location}
</div>

<Link
href={`/projects/${project.slug}`}
className="block rounded-md bg-[#1a3a52] py-2 text-center text-sm font-medium text-white hover:bg-[#224865]"
>
View Details
</Link>

</div>
</article>

))}

</div>

)}

</div>

</section>

</div>
);
}