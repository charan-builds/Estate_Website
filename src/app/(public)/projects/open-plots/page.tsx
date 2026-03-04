"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { MapPin, Home } from "lucide-react";

export default function OpenPlotsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "projects"),
      where("propertyType", "==", "Open Plots")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(mapProjectSnapshot)
        .filter(Boolean) as Project[];

      setProjects(data);
    });

    return unsubscribe;
  }, []);

  <Link
 href="/projects"
 className="text-sm text-[#1a3a52] hover:underline"
>
← Back to all projects
</Link>
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">

        <h1 className="mb-10 text-4xl font-serif text-[#1a3a52]">
          Open Plot Projects
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-xl transition"
            >
              <Link href={`/projects/${project.slug}`}>
                <ImageWithFallback
                  src={project.gallery[0]}
                  alt={project.name}
                  className="h-64 w-full object-cover group-hover:scale-105 transition"
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
                  <MapPin size={16}/> {project.location}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home size={16}/> {project.configuration}
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

      </div>
    </div>
  );
}