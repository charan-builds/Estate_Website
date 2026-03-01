"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Project } from "@/types/project";

type ProjectCardProps = Pick<
  Project,
  "name" | "slug" | "location" | "status" | "configuration" | "price"
> & {
  image: string;
};

export default function ProjectCard({
  name,
  slug,
  location,
  status,
  configuration,
  price,
  image,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group overflow-hidden border border-[--grey-200] bg-white transition-all duration-300 hover:shadow-[--shadow-lg]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[--grey-100]">
        <ImageWithFallback
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="mb-4">
          <span className="inline-block bg-[--grey-100] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[--primary]">
            {status}
          </span>
        </div>
        <h3 className="mb-3 text-xl text-[--primary] transition-colors group-hover:text-[--primary-light]">{name}</h3>
        <div className="mb-2 flex items-start gap-2 text-[--grey-600]">
          <MapPin size={16} className="mt-1 flex-shrink-0" />
          <span className="text-sm">{location}</span>
        </div>
        <p className="mb-4 text-sm text-[--grey-500]">{configuration}</p>
        <div className="flex items-center justify-between border-t border-[--grey-200] pt-4">
          <div>
            <p className="mb-1 text-xs text-[--grey-500]">Starting from</p>
            <p className="font-semibold text-[--primary]">{price}</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-[--primary] transition-all group-hover:gap-2">
            View Details
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
