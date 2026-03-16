"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building,
  Home,
  Key,
  Map,
  Store,
  Warehouse,
} from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer from "@/components/animations/StaggerContainer";
import { fadeInUpVariants } from "@/components/animations/motion";
import { db } from "@/lib/firebase";
import { PROJECT_SUBCATEGORY_OPTIONS } from "@/lib/constants";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project, ProjectMainCategory, ProjectSubCategory } from "@/types/project";

const SUBCATEGORY_ICONS: Record<ProjectSubCategory, typeof Building> = {
  apartments: Building,
  villas: Home,
  plots: Map,
  offices: Briefcase,
  retail: Store,
  warehouses: Warehouse,
  short_term_rentals: Key,
  long_term_rentals: Key,
};

const CATEGORY_DESCRIPTIONS: Record<ProjectMainCategory, string> = {
  residential:
    "Find your dream home from our collection of verified residential properties.",
  commercial:
    "Strategic commercial spaces for business growth and investment.",
  rental:
    "Flexible rental options for short and long-term stays across key locations.",
};

const CATEGORY_TITLES: Record<ProjectMainCategory, string> = {
  residential: "Residential Properties",
  commercial: "Commercial Properties",
  rental: "Rental Properties",
};

export default function PropertyListings() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
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

  const categories = useMemo(() => {
    return (Object.keys(PROJECT_SUBCATEGORY_OPTIONS) as ProjectMainCategory[]).map((mainCategory) => ({
      key: mainCategory,
      title: CATEGORY_TITLES[mainCategory],
      description: CATEGORY_DESCRIPTIONS[mainCategory],
      subcategories: PROJECT_SUBCATEGORY_OPTIONS[mainCategory].map((subcategory) => {
        const count = projects.filter((project) => project.subCategory === subcategory.value).length;
        const Icon = SUBCATEGORY_ICONS[subcategory.value];

        return {
          ...subcategory,
          count,
          Icon,
          href: `/projects?type=${subcategory.value}`,
        };
      }),
    }));
  }, [projects]);

  return (
    <div className="bg-white">
      <section className="bg-[#1a3a52] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="mb-4 text-4xl font-serif md:text-5xl">Property Listings</h1>
            <p className="max-w-2xl text-xl text-gray-200">
              Explore dynamic residential, commercial, and rental categories powered by our live project inventory.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="space-y-20">
            {categories.map((category) => (
              <div key={category.key}>
                <FadeIn className="mb-12 text-center">
                  <h2 className="mb-4 text-3xl font-serif text-[#1a3a52] md:text-4xl">
                    {category.title}
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-gray-600">
                    {category.description}
                  </p>
                </FadeIn>

                <StaggerContainer className={`grid gap-8 ${category.subcategories.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                  {category.subcategories.map((subcategory) => (
                    <motion.div
                      key={subcategory.value}
                      variants={fadeInUpVariants}
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    >
                      <Link
                        href={subcategory.href}
                        className="group block rounded-[1.5rem] bg-gray-50 p-6 transition-all duration-300 hover:bg-white hover:shadow-xl"
                      >
                        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a3a52] text-white transition-transform duration-300 group-hover:scale-110">
                          <subcategory.Icon size={24} />
                        </div>
                        <h3 className="mb-3 text-xl font-serif text-[#1a3a52] group-hover:text-[#2a4a62]">
                          {subcategory.label}
                        </h3>
                        <p className="mb-4 text-gray-600">{subcategory.heroSubtitle}</p>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#1a3a52]">
                            {loading ? "Loading..." : `${subcategory.count} Projects`}
                          </span>
                          <ArrowRight className="text-[#1a3a52] transition-transform group-hover:translate-x-1" size={20} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </StaggerContainer>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-serif text-[#1a3a52]">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            Contact our property experts for personalized assistance and upcoming opportunities not yet listed.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-[#1a3a52] px-8 py-3 font-medium text-white transition-colors hover:bg-[#2a4a62]"
          >
            Get Personalized Help <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
