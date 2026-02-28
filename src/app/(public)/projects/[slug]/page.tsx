"use client";

 
import Link from "next/link";
import {
  MapPin,
  Home,
  ArrowLeft,
  Download,
  Calendar,
  Building2,
  Maximize,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";
import { useParams} from "next/navigation";
 
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function ProjectDetails() {
  const { id } = useParams();

  // normalize id to a string (useParams may return string[])
  const projectId = Array.isArray(id) ? id[0] : id || "ekam-heights";

  // Mock project data - in a real app, this would be fetched based on the id
  const projectsData: Record<string, any> = {
    "ekam-heights": {
      name: "Ekam Heights",
      location: "Gachibowli, Hyderabad",
      type: "Residential Apartments",
      status: "Ready to Move",
      configuration: "2, 3 BHK",
      price: "₹75 Lakhs onwards",
      totalUnits: "240 Units",
      landArea: "3.5 Acres",
      possession: "Immediate",
      rera: "P02400012345",
      heroImage: "https://images.unsplash.com/photo-1758193431355-54df41421657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MjE5MTY5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      description:
        "Ekam Heights offers premium living spaces in the heart of Gachibowli, one of Hyderabad's most sought-after locations. With world-class amenities and contemporary design, this project sets new standards in modern living.",
      overview: [
        "Strategically located in Gachibowli with excellent connectivity",
        "Close proximity to IT hubs, educational institutions, and healthcare facilities",
        "Spacious 2 & 3 BHK apartments with modern interiors",
        "RERA approved project with all necessary certifications",
      ],
      amenities: [
        "Swimming Pool",
        "Fully Equipped Gymnasium",
        "Children's Play Area",
        "Landscaped Gardens",
        "24/7 Security",
        "Power Backup",
        "Clubhouse",
        "Indoor Games Room",
        "Jogging Track",
        "Party Hall",
        "Visitor Parking",
        "CCTV Surveillance",
      ],
      specifications: [
        { label: "Structure", value: "RCC Framed Structure" },
        { label: "Flooring", value: "Vitrified Tiles" },
        { label: "Kitchen", value: "Granite Counter Top" },
        { label: "Bathroom", value: "Premium Sanitary Fittings" },
        { label: "Doors", value: "Engineered Wood" },
        { label: "Windows", value: "UPVC with Glass" },
        { label: "Walls", value: "Premium Paint Finish" },
        { label: "Ceiling", value: "POP Finish" },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1738168246881-40f35f8aba0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYXBhcnRtZW50JTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3MjE4MzQyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1750420556288-d0e32a6f517b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcyMTExOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1771441414357-bec29f714e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGNvbW11bml0eSUyMGFtZW5pdGllcyUyMHBvb2x8ZW58MXx8fHwxNzcyMjEyNTU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      ],
    },
  };

  // Default to ekam-heights if project not found
  const project = projectsData[projectId] || projectsData["ekam-heights"];

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a3a52] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-[400px] md:h-[500px]">
        <ImageWithFallback
          src={project.heroImage}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 bg-white text-[#1a3a52] text-xs uppercase tracking-wider mb-3">
              {project.status}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
              {project.name}
            </h1>
            <div className="flex items-center gap-2 text-white">
              <MapPin size={20} />
              <span className="text-lg">{project.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-[#1a3a52] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-300 text-sm mb-1">Configuration</p>
              <p className="text-lg">{project.configuration}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-1">Price Range</p>
              <p className="text-lg">{project.price}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-1">Total Units</p>
              <p className="text-lg">{project.totalUnits}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-1">Possession</p>
              <p className="text-lg">{project.possession}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div>
                <h2 className="text-3xl font-serif text-[#1a3a52] mb-6">
                  Project Overview
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {project.description}
                </p>
                <ul className="space-y-3">
                  {project.overview.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2
                        size={20}
                        className="text-[#1a3a52] flex-shrink-0 mt-0.5"
                      />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-3xl font-serif text-[#1a3a52] mb-6">
                  Amenities
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.amenities.map((amenity: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50"
                    >
                      <CheckCircle2 size={20} className="text-[#1a3a52] flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="text-3xl font-serif text-[#1a3a52] mb-6">
                  Specifications
                </h2>
                <div className="border border-gray-200">
                  {project.specifications.map(
                    (spec: any, index: number) => (
                      <div
                        key={index}
                        className={`grid grid-cols-2 gap-4 p-4 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <div className="text-gray-700">{spec.label}</div>
                        <div className="text-gray-900">{spec.value}</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-3xl font-serif text-[#1a3a52] mb-6">
                  Gallery
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.gallery.map((image: string, index: number) => (
                    <div key={index} className="aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <div className="bg-gray-50 p-6 border border-gray-200">
                  <h3 className="text-xl font-serif text-[#1a3a52] mb-4">
                    Interested in this project?
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Get detailed information and schedule a site visit
                  </p>
                  <Link
                    href="/contact"
                    className="block w-full bg-[#1a3a52] text-white text-center py-3 hover:bg-[#2a4a62] transition-colors mb-3"
                  >
                    Enquire Now
                  </Link>
                  <button className="flex items-center justify-center gap-2 w-full bg-white text-[#1a3a52] border border-[#1a3a52] py-3 hover:bg-gray-50 transition-colors">
                    <Download size={18} />
                    Download Brochure
                  </button>
                </div>

                {/* Project Info */}
                <div className="bg-white p-6 border border-gray-200">
                  <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-4">
                    Project Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 size={20} className="text-[#1a3a52] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="text-gray-900">{project.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Maximize size={20} className="text-[#1a3a52] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Land Area</p>
                        <p className="text-gray-900">{project.landArea}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-[#1a3a52] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">RERA Number</p>
                        <p className="text-gray-900">{project.rera}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Highlights */}
                <div className="bg-white p-6 border border-gray-200">
                  <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-4">
                    Location Highlights
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• 5 min to IT Hub</li>
                    <li>• 10 min to Metro Station</li>
                    <li>• 15 min to International Airport</li>
                    <li>• Near Schools & Hospitals</li>
                    <li>• Shopping Malls Nearby</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-[#1a3a52] mb-4">
            Schedule a Site Visit
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Experience the quality and amenities firsthand. Book your visit today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#1a3a52] text-white px-8 py-4 hover:bg-[#2a4a62] transition-colors"
          >
            Book Site Visit
          </Link>
        </div>
      </section>
    </div>
  );
}
