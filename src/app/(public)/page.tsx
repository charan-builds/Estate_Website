"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { ArrowRight, Award, Building2, Users, Search } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { db } from "@/lib/firebase";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    propertyType: "",
    location: "",
    priceRange: "",
    bedrooms: "",
    bathrooms: "",
  });

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

      {/* Search Filters */}
      <section className="bg-white py-12 border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-serif text-[#1a3a52] mb-6 text-center">Find Your Dream Property</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={searchFilters.propertyType}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-[#1a3a52] focus:outline-none"
                >
                  <option value="">All Types</option>
                  <option value="apartments">Apartments</option>
                  <option value="villas">Villas</option>
                  <option value="plots">Plots</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-[#1a3a52] focus:outline-none"
                >
                  <option value="">All Locations</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="chennai">Chennai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={searchFilters.priceRange}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-[#1a3a52] focus:outline-none"
                >
                  <option value="">Any Price</option>
                  <option value="0-50">Under ₹50L</option>
                  <option value="50-100">₹50L - ₹1Cr</option>
                  <option value="100-200">₹1Cr - ₹2Cr</option>
                  <option value="200+">Above ₹2Cr</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select
                  value={searchFilters.bedrooms}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-[#1a3a52] focus:outline-none"
                >
                  <option value="">Any</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-[#1a3a52] text-white py-2 px-4 rounded-md hover:bg-[#2a4a62] transition-colors flex items-center justify-center gap-2">
                  <Search size={18} />
                  Search
                </button>
              </div>
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

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-4xl font-serif text-[#1a3a52]">What Our Customers Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                &quot;Ekam Properties delivered our dream home on time with exceptional quality. The team was transparent throughout the process.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-[#1a3a52]">Rajesh Kumar</p>
                  <p className="text-sm text-gray-500">Happy Homeowner</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                &quot;Professional service from start to finish. Their investment guidance helped us make the right choice.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-[#1a3a52]">Priya Sharma</p>
                  <p className="text-sm text-gray-500">Property Investor</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  &quot;Verified projects with all approvals. No hidden costs, exactly as promised.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-[#1a3a52]">Amit Patel</p>
                    <p className="text-sm text-gray-500">First-time Buyer</p>
                  </div>
                </div>
              </div>
            </div>
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
