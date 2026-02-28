"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import Button from "@/components/Button";

 
import { MapPin, Home, Filter } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function Projects() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const allProjects = [
    {
      id: "ekam-heights",
      name: "Ekam Heights",
      location: "Gachibowli, Hyderabad",
      type: "Residential Apartments",
      status: "Ready to Move",
      configuration: "2, 3 BHK",
      price: "₹75 Lakhs onwards",
      image: "https://images.unsplash.com/photo-1758193431355-54df41421657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MjE5MTY5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "ready",
    },
    {
      id: "ekam-vista",
      name: "Ekam Vista",
      location: "Kondapur, Hyderabad",
      type: "Premium Villas",
      status: "Under Construction",
      configuration: "3, 4 BHK Villas",
      price: "₹1.2 Cr onwards",
      image: "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzIyMDY2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "ongoing",
    },
    {
      id: "ekam-towers",
      name: "Ekam Towers",
      location: "Financial District, Hyderabad",
      type: "Luxury Apartments",
      status: "New Launch",
      configuration: "3, 4 BHK",
      price: "₹1.5 Cr onwards",
      image: "https://images.unsplash.com/photo-1760059732778-adaf9baa44a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdocmlzZSUyMHJlc2lkZW50aWFsJTIwYnVpbGRpbmclMjBjaXR5c2NhcGV8ZW58MXx8fHwxNzcyMjEyNTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "upcoming",
    },
    {
      id: "ekam-meadows",
      name: "Ekam Meadows",
      location: "Kokapet, Hyderabad",
      type: "Residential Apartments",
      status: "Under Construction",
      configuration: "2, 3 BHK",
      price: "₹85 Lakhs onwards",
      image: "https://images.unsplash.com/photo-1759472018220-d6e258796fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHRvd2VyJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzcyMjEyNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "ongoing",
    },
    {
      id: "ekam-residency",
      name: "Ekam Residency",
      location: "Jubilee Hills, Hyderabad",
      type: "Ultra Luxury Apartments",
      status: "Ready to Move",
      configuration: "4 BHK",
      price: "₹2.5 Cr onwards",
      image: "https://images.unsplash.com/photo-1738168246881-40f35f8aba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYXBhcnRtZW50JTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MjE4MzQyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "ready",
    },
    {
      id: "ekam-serenity",
      name: "Ekam Serenity",
      location: "Miyapur, Hyderabad",
      type: "Residential Apartments",
      status: "New Launch",
      configuration: "2, 3 BHK",
      price: "₹65 Lakhs onwards",
      image: "https://images.unsplash.com/photo-1519380400109-9ef80d934359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjB0ZXJyYWNlfGVufDF8fHx8MTc3MjEyOTgyOXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "upcoming",
    },
  ];

  const filters = [
    { value: "all", label: "All Projects" },
    { value: "ready", label: "Ready to Move" },
    { value: "ongoing", label: "Under Construction" },
    { value: "upcoming", label: "New Launch" },
  ];

  const filteredProjects =
    selectedFilter === "all"
      ? allProjects
      : allProjects.filter((project) => project.category === selectedFilter);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-[#1a3a52] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Our Projects
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Discover premium residential developments across Hyderabad
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter size={20} />
              <span className="text-sm uppercase tracking-wider">Filter by:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    selectedFilter === filter.value
                      ? "bg-[#1a3a52] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-[#1a3a52] text-xs uppercase tracking-wider">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-[#1a3a52] mb-2">
                    {project.name}
                  </h3>
                  <div className="flex items-start gap-2 text-gray-600 mb-3">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 mb-4">
                    <Home size={16} className="mt-1 flex-shrink-0" />
                    <span className="text-sm">{project.configuration}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-[#1a3a52] font-semibold">
                      {project.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No projects found in this category
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-[#1a3a52] mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Our team can help you find the perfect property that matches your
            requirements
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#1a3a52] text-white px-8 py-4 hover:bg-[#2a4a62] transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
