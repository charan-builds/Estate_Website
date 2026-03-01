"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { ArrowRight, Award, Building2, Users } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { db } from "@/lib/firebase";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(3));

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

  const stats = [
    { number: "25+", label: "Years of Excellence" },
    { number: "50+", label: "Completed Projects" },
    { number: "15,000+", label: "Happy Families" },
    { number: "10M+", label: "Sq. Ft. Delivered" },
  ];

  const features = [
    {
      icon: Building2,
      title: "Quality Construction",
      description: "Built with the finest materials and superior craftsmanship",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Dedicated support from booking to possession and beyond",
    },
    {
      icon: Award,
      title: "Trusted Brand",
      description: "Award-winning developer with proven track record",
    },
  ];

  return (
    <div className="bg-white">
      <section className="relative h-[600px] bg-gray-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759472018220-d6e258796fce"
            alt="Hero"
            className="h-full w-full object-cover opacity-40"
          />
        </div>
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4">
          <div className="max-w-2xl text-white">
            <h1 className="mb-6 text-5xl font-serif">
              Building Homes,
              <br />
              Creating Landmarks
            </h1>
            <p className="text-white/80 text-lg md:text-xl">
  Experience premium living spaces designed for modern lifestyles
</p>
            <div className="flex gap-4">
              <Link href="/projects" className="flex items-center gap-2 bg-white px-8 py-4 text-[#1a3a52]">
                Explore Projects <ArrowRight size={20} />
              </Link>
              <Link href="/contact" className="border-2 border-white px-8 py-4">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1a3a52] py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-5xl font-serif text-white">{item.number}</div>
              <div className="text-gray-300">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-4xl font-serif text-[#1a3a52]">Featured Projects</h2>

          {loading ? <p className="text-center text-gray-500">Loading projects...</p> : null}
          {!loading && !projects.length ? <p className="text-center text-gray-500">No projects available</p> : null}

          {!loading && projects.length ? (
            <div className="grid gap-8 md:grid-cols-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} className="bg-white transition hover:shadow-xl">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={project.gallery[0] || "https://via.placeholder.com/600x400"}
                      alt={project.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="bg-gray-100 px-3 py-1 text-xs uppercase text-[#1a3a52]">{project.status}</span>
                    <h3 className="mt-3 text-xl font-serif text-[#1a3a52]">{project.name}</h3>
                    <p className="text-gray-600">{project.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          <div className="mt-12 text-center">
            <Link href="/projects" className="inline-flex items-center gap-2 text-[#1a3a52]">
              View All Projects <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-[#1a3a52] text-white">
                <feature.icon size={32} />
              </div>
              <h3 className="mb-3 text-xl font-serif text-[#1a3a52]">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
