"use client";

export default function ProjectsSkeletonGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="h-64 animate-pulse bg-slate-200" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
