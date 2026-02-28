"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Button from "@/components/Button";

 

export  default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send data to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        project: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const offices = [
    {
      title: "Corporate Office",
      address: "Plot No. 123, Road No. 36, Jubilee Hills, Hyderabad - 500033",
      phone: "+91 40 1234 5678",
      email: "info@ekamproperties.com",
      hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    },
    {
      title: "Sales Office - Gachibowli",
      address: "Survey No. 456, Gachibowli, Hyderabad - 500032",
      phone: "+91 40 2345 6789",
      email: "sales.gachibowli@ekamproperties.com",
      hours: "Mon - Sun: 10:00 AM - 7:00 PM",
    },
    {
      title: "Sales Office - Kondapur",
      address: "Plot No. 789, Kondapur Main Road, Hyderabad - 500084",
      phone: "+91 40 3456 7890",
      email: "sales.kondapur@ekamproperties.com",
      hours: "Mon - Sun: 10:00 AM - 7:00 PM",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-[#1a3a52] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Get in touch with our team for any queries or to schedule a site visit
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-serif text-[#1a3a52] mb-6">
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within
                24 hours
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800">
                  Thank you for contacting us! We'll be in touch soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1a3a52] focus:ring-2 focus:ring-[#1a3a52] transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1a3a52] focus:ring-2 focus:ring-[#1a3a52] transition-colors duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1a3a52] focus:ring-2 focus:ring-[#1a3a52] transition-colors duration-200"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project"
                    className="block text-sm text-gray-700 mb-2"
                  >
                    Interested Project
                  </label>
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1a3a52] focus:ring-2 focus:ring-[#1a3a52] transition-colors duration-200 bg-white"
                  >
                    <option value="">Select a project</option>
                    <option value="ekam-heights">Ekam Heights</option>
                    <option value="ekam-vista">Ekam Vista</option>
                    <option value="ekam-towers">Ekam Towers</option>
                    <option value="ekam-meadows">Ekam Meadows</option>
                    <option value="ekam-residency">Ekam Residency</option>
                    <option value="ekam-serenity">Ekam Serenity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1a3a52] resize-none"
                    placeholder="Tell us more about your requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1a3a52] text-white py-4 hover:bg-[#2a4a62] transition-colors"
                >
                  Submit Inquiry
                </button>

                <p className="text-sm text-gray-500">
                  * Required fields. By submitting this form, you agree to our
                  privacy policy.
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif text-[#1a3a52] mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Visit our offices or reach out to us through any of the following
                channels
              </p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1a3a52] flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg text-[#1a3a52] mb-1">Phone</h3>
                    <p className="text-gray-600">+91 40 1234 5678</p>
                    <p className="text-gray-600">+91 40 2345 6789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1a3a52] flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg text-[#1a3a52] mb-1">Email</h3>
                    <p className="text-gray-600">info@ekamproperties.com</p>
                    <p className="text-gray-600">sales@ekamproperties.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1a3a52] flex items-center justify-center flex-shrink-0">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg text-[#1a3a52] mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">Monday - Saturday</p>
                    <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 p-6 border border-gray-200">
                <h3 className="text-lg font-serif text-[#1a3a52] mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-white border border-gray-300 text-[#1a3a52] py-3 hover:bg-gray-50 transition-colors">
                    Schedule Site Visit
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-[#1a3a52] py-3 hover:bg-gray-50 transition-colors">
                    Request Callback
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-[#1a3a52] py-3 hover:bg-gray-50 transition-colors">
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a3a52] mb-4">
              Our Offices
            </h2>
            <p className="text-gray-600 text-lg">
              Visit us at any of our convenient locations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-white p-6 border border-gray-200">
                <h3 className="text-xl font-serif text-[#1a3a52] mb-4">
                  {office.title}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#1a3a52] mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{office.address}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-[#1a3a52] mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{office.phone}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-[#1a3a52] mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm break-all">{office.email}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-[#1a3a52] mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{office.hours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-gray-200">
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
            <p>Interactive Map would be integrated here</p>
            <p className="text-sm mt-2">Google Maps / Mapbox Integration</p>
          </div>
        </div>
      </section>
    </div>
  );
}
