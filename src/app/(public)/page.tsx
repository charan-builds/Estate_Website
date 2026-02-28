"use client";

import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";
// ProjectCard and Button were imported but not used; removed to avoid unnecessary client boundaries

import { ArrowRight, CheckCircle2, Building2, Users, Award } from "lucide-react";
 
export function Home() {
  const projects = [
    {
      id: "ekam-heights",
      name: "Ekam Heights",
      location: "Gachibowli, Hyderabad",
      type: "Residential Apartments",
      status: "Ready to Move",
      image: "https://images.unsplash.com/photo-1758193431355-54df41421657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MjE5MTY5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "ekam-vista",
      name: "Ekam Vista",
      location: "Kondapur, Hyderabad",
      type: "Premium Villas",
      status: "Under Construction",
      image: "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzIyMDY2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "ekam-towers",
      name: "Ekam Towers",
      location: "Financial District, Hyderabad",
      type: "Luxury Apartments",
      status: "New Launch",
      image: "https://images.unsplash.com/photo-1760059732778-adaf9baa44a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdocmlzZSUyMHJlc2lkZW50aWFsJTIwYnVpbGRpbmclMjBjaXR5c2NhcGV8ZW58MXx8fHwxNzcyMjEyNTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

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
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] bg-gray-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759472018220-d6e258796fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHRvd2VyJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzcyMjEyNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
              Building Homes,
              <br />
              Creating Landmarks
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Experience premium living spaces designed for modern lifestyles
              with world-class amenities and exceptional quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1a3a52] px-8 py-4 hover:bg-gray-100 transition-colors"
              >
                Explore Projects
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1a3a52] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our latest residential developments offering premium
              living experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group bg-white overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-gray-100 text-[#1a3a52] text-xs uppercase tracking-wider mb-3">
                    {project.status}
                  </div>
                  <h3 className="text-xl font-serif text-[#1a3a52] mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 mb-1">{project.location}</p>
                  <p className="text-gray-500 text-sm">{project.type}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[#1a3a52] hover:gap-4 transition-all"
            >
              View All Projects
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">
              Why Choose Ekam Properties
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our commitment to excellence has made us a trusted name in real
              estate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a3a52] text-white mb-6">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-serif text-[#1a3a52] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Get in touch with our team to explore available properties and
            schedule a site visit
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#1a3a52] text-white px-8 py-4 hover:bg-[#2a4a62] transition-colors"
          >
            Contact Our Team
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

// Next.js App Router requires a default export for page components
export default Home;
