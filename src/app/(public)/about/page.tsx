"use client";
import { CheckCircle2, Award, Target, Eye } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

 
export default function About() {
  const milestones = [
    { year: "2000", title: "Foundation", description: "Started with a vision to transform real estate" },
    { year: "2010", title: "Expansion", description: "Expanded to multiple cities across India" },
    { year: "2015", title: "Recognition", description: "Won multiple industry awards" },
    { year: "2020", title: "Innovation", description: "Adopted green building practices" },
    { year: "2026", title: "Excellence", description: "15,000+ happy families and counting" },
  ];

  const values = [
    {
      icon: CheckCircle2,
      title: "Integrity",
      description: "We maintain the highest standards of honesty and transparency in all our dealings",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering superior quality in every aspect of our projects",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly evolving with modern design and sustainable practices",
    },
    {
      icon: Eye,
      title: "Customer Focus",
      description: "Your satisfaction and trust are at the heart of everything we do",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1769697694222-016642c08125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjByZWFsJTIwZXN0YXRlJTIwb2ZmaWNlfGVufDF8fHx8MTc3MjIxMjU1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="About Us"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              About Ekam Properties
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Building trust through quality construction for over two decades
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Established in 2000, Ekam Properties has grown from a small
                  construction firm to one of India&apos;s most trusted real estate
                  developers. Our journey has been defined by an unwavering
                  commitment to quality, innovation, and customer satisfaction.
                </p>
                <p>
                  Over the past 25 years, we have successfully delivered over 50
                  residential and commercial projects, housing more than 15,000
                  happy families. Each project reflects our dedication to
                  excellence and attention to detail.
                </p>
                <p>
                  Today, we continue to set new benchmarks in the industry with
                  our focus on sustainable development, modern design, and
                  world-class amenities that enhance the quality of life for our
                  customers.
                </p>
              </div>
            </div>
            <div className="relative h-[400px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764449321624-913ca52646c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwZGV2ZWxvcG1lbnQlMjBwcm9ncmVzc3xlbnwxfHx8fDE3NzIxOTc1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Construction Progress"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-10">
              <div className="w-12 h-12 bg-[#1a3a52] flex items-center justify-center mb-6">
                <Eye className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-serif text-[#1a3a52] mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and preferred real estate developer in
                India, known for creating sustainable communities that enhance
                the quality of life and set new standards in design, quality,
                and customer service.
              </p>
            </div>

            <div className="bg-white p-10">
              <div className="w-12 h-12 bg-[#1a3a52] flex items-center justify-center mb-6">
                <Target className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-serif text-[#1a3a52] mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To deliver exceptional real estate projects that exceed customer
                expectations through innovative design, superior construction
                quality, timely delivery, and transparent business practices
                while maintaining environmental sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a3a52] text-white mb-6">
                  <value.icon size={28} />
                </div>
                <h3 className="text-lg font-serif text-[#1a3a52] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Key milestones in our 25-year legacy
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <div className="bg-white p-6 border-l-4 border-[#1a3a52]">
                      <div className="text-3xl font-serif text-[#1a3a52] mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl text-[#1a3a52] mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1a3a52] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">
              Leadership Message
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 md:p-12">
              <div className="text-5xl text-[#1a3a52] mb-4">&quot;</div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                At Ekam Properties, we believe that a home is not just a
                structure but a foundation for dreams, aspirations, and
                memories. Our commitment goes beyond construction – we build
                communities where families thrive and create lasting bonds.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                As we continue to grow, our focus remains steadfast on
                delivering quality, maintaining transparency, and ensuring
                customer satisfaction in every project we undertake.
              </p>
              <div className="pt-4 border-t border-gray-300">
                <p className="text-[#1a3a52]">Sunil Chandra</p>
                <p className="text-gray-600 text-sm">Managing Director, Ekam Properties</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
