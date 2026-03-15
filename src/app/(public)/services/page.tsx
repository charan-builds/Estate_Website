import { Search, FileText, Calculator, Camera, TrendingUp, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Services | Ekam Properties",
  description: "Comprehensive real estate services including property search, legal support, financial advice, and seller services. Expert guidance for buying and selling properties.",
  openGraph: {
    title: "Real Estate Services | Ekam Properties",
    description: "Comprehensive real estate services including property search, legal support, financial advice, and seller services.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Services | Ekam Properties",
    description: "Comprehensive real estate services for buying and selling properties.",
  },
};

export default function Services() {
  const buyerServices = [
    {
      icon: Search,
      title: "Property Search Assistance",
      description: "Expert guidance to find properties that match your requirements, budget, and preferences.",
    },
    {
      icon: FileText,
      title: "Legal Support",
      description: "Complete documentation and legal assistance for smooth property transactions.",
    },
    {
      icon: Calculator,
      title: "Financial Advice",
      description: "Loan assistance, EMI calculations, and financial planning for property investment.",
    },
    {
      icon: Camera,
      title: "Virtual Tours",
      description: "360-degree virtual tours and video walkthroughs of properties from anywhere.",
    },
  ];

  const sellerServices = [
    {
      icon: Calculator,
      title: "Property Valuation",
      description: "Professional assessment of property value based on current market rates.",
    },
    {
      icon: TrendingUp,
      title: "Property Marketing",
      description: "Comprehensive marketing strategies to attract potential buyers quickly.",
    },
    {
      icon: Home,
      title: "Open House Organization",
      description: "Professional event planning and execution for property viewings.",
    },
  ];

  const lifestyleContent = [
    {
      title: "Home Decor Ideas",
      description: "Latest trends and inspiration for modern home interiors.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    },
    {
      title: "Community Highlights",
      description: "Stories from our residential communities and resident experiences.",
      image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=400",
    },
    {
      title: "Investment Tips",
      description: "Expert advice on real estate investment and market insights.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-[#1a3a52] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-serif md:text-5xl mb-4">Our Services</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Comprehensive real estate services from property search to possession, tailored for your needs.
          </p>
        </div>
      </section>

      {/* Buyer Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">Buyer Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              End-to-end support for property buyers at every step of their journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {buyerServices.map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#1a3a52] rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-serif text-[#1a3a52] mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Services */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">Seller Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional assistance to maximize your property&apos;s value and reach the right buyers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sellerServices.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#1a3a52] rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-serif text-[#1a3a52] mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">Lifestyle & Inspiration</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover ideas and insights to enhance your living experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {lifestyleContent.map((item, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-serif text-[#1a3a52] mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <Link href="#" className="text-[#1a3a52] font-medium hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a3a52] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-serif mb-4">Ready to Get Started?</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Contact our experts today for personalized real estate services tailored to your needs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="bg-white text-[#1a3a52] px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Contact Us
            </Link>
            <Link href="/projects" className="border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-[#1a3a52] transition-colors">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}