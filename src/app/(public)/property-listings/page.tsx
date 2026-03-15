"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building, Home, Key, ArrowRight } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

export default function PropertyListings() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const data = snapshot.docs.map(mapProjectSnapshot).filter(Boolean) as Project[];
      setProjects(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const getProjectCount = (propertyType: string) => {
    return projects.filter(p => p.propertyType === propertyType).length;
  };

  const categories = [
    {
      title: "Residential Properties",
      icon: Home,
      description: "Find your dream home from our collection of verified residential properties",
      subcategories: [
        {
          name: "Apartments",
          description: "Modern 2, 3 & 4 BHK apartments in prime locations",
          count: loading ? "Loading..." : `${getProjectCount("Apartments")} Projects`,
          href: "/projects?type=apartments",
        },
        {
          name: "Villas",
          description: "Luxury gated community villas with world-class amenities",
          count: loading ? "Loading..." : `${getProjectCount("Villas")} Projects`,
          href: "/projects?type=villas",
        },
        {
          name: "Plots",
          description: "Residential plots ideal for building your custom home",
          count: loading ? "Loading..." : `${getProjectCount("Open Plots")} Projects`,
          href: "/projects?type=open-plots",
        },
      ],
    },
    {
      title: "Commercial Properties",
      icon: Building,
      description: "Strategic commercial spaces for business growth and investment",
      subcategories: [
        {
          name: "Offices",
          description: "Premium office spaces in business districts",
          count: "10+ Projects",
          href: "/projects?type=offices",
        },
        {
          name: "Retail Spaces",
          description: "High-street retail spaces with maximum visibility",
          count: "8+ Projects",
          href: "/projects?type=retail",
        },
        {
          name: "Warehouses",
          description: "Industrial warehouses and storage facilities",
          count: "5+ Projects",
          href: "/projects?type=warehouses",
        },
      ],
    },
    {
      title: "Rental Properties",
      icon: Key,
      description: "Flexible rental options for short and long-term stays",
      subcategories: [
        {
          name: "Short Term Rentals",
          description: "Furnished apartments for temporary accommodation",
          count: "12+ Properties",
          href: "/projects?type=short-term",
        },
        {
          name: "Long Term Rentals",
          description: "Residential rentals for extended stays",
          count: "20+ Properties",
          href: "/projects?type=long-term",
        },
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-[#1a3a52] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-serif md:text-5xl mb-4">Property Listings</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Explore our comprehensive collection of residential, commercial, and rental properties across prime locations.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="space-y-20">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-[#1a3a52] rounded-full flex items-center justify-center mx-auto mb-4">
                    <category.icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {category.subcategories.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      href={sub.href}
                      className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-all hover:bg-white group"
                    >
                      <h3 className="text-xl font-serif text-[#1a3a52] mb-3 group-hover:text-[#2a4a62]">
                        {sub.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{sub.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1a3a52] bg-white px-3 py-1 rounded-full">
                          {sub.count}
                        </span>
                        <ArrowRight className="text-[#1a3a52] group-hover:translate-x-1 transition-transform" size={20} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-serif text-[#1a3a52] mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact our property experts for personalized assistance and exclusive listings not available online.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#1a3a52] text-white px-8 py-3 rounded-md font-medium hover:bg-[#2a4a62] transition-colors"
          >
            Get Personalized Help <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}