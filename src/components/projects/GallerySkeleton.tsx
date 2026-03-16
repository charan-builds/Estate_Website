"use client";

export default function GallerySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="aspect-[4/3] animate-pulse rounded-lg bg-slate-200" />
      ))}
    </div>
  );
}
