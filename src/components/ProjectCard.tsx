"use client";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface ProjectCardProps {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  configuration: string;
  price: string;
  image: string;
}

export default function ProjectCard({
  id,
  name,
  location,
  type,
  status,
  configuration,
  price,
  image,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${id}`}
      className="group bg-white border border-[--grey-200] overflow-hidden hover:shadow-[--shadow-lg] transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[--grey-100]">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      <div className="p-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-[--grey-100] text-[--primary] text-xs font-medium uppercase tracking-wider">
            {status}
          </span>
        </div>
        <h3 className="text-xl mb-3 text-[--primary] group-hover:text-[--primary-light] transition-colors">
          {name}
        </h3>
        <div className="flex items-start gap-2 text-[--grey-600] mb-2">
          <MapPin size={16} className="mt-1 flex-shrink-0" />
          <span className="text-sm">{location}</span>
        </div>
        <p className="text-sm text-[--grey-500] mb-4">{configuration}</p>
        <div className="pt-4 border-t border-[--grey-200] flex items-center justify-between">
          <div>
            <p className="text-xs text-[--grey-500] mb-1">Starting from</p>
            <p className="text-[--primary] font-semibold">{price}</p>
          </div>
          <div className="flex items-center gap-1 text-[--primary] text-sm font-medium group-hover:gap-2 transition-all">
            View Details
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}