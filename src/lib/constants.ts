import { ProjectMainCategory, ProjectStatus, ProjectSubCategory } from "@/types/project";

export const SITE_NAME = "Ekam Properties";
export const PRIMARY_COLOR = "#1a3a52";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Ready to Move",
  "Under Construction",
  "New Launch",
];

export const PROJECT_STATUS_FILTERS: Array<{ value: "all" | ProjectStatus; label: string }> = [
  { value: "all", label: "All Projects" },
  { value: "Ready to Move", label: "Ready to Move" },
  { value: "Under Construction", label: "Under Construction" },
  { value: "New Launch", label: "New Launch" },
];

export const PROJECT_MAIN_CATEGORY_OPTIONS: Array<{
  value: ProjectMainCategory;
  label: string;
}> = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "rental", label: "Rental" },
];

export const PROJECT_SUBCATEGORY_OPTIONS: Record<
  ProjectMainCategory,
  Array<{ value: ProjectSubCategory; label: string; heroTitle: string; heroSubtitle: string }>
> = {
  residential: [
    {
      value: "apartments",
      label: "Apartments",
      heroTitle: "Apartments for Sale",
      heroSubtitle: "Explore verified apartment projects across Hyderabad.",
    },
    {
      value: "villas",
      label: "Villas for Sale",
      heroSubtitle: "Discover premium villa communities in fast-growing locations.",
      heroTitle: "Villas for Sale",
    },
    {
      value: "plots",
      label: "Plots",
      heroTitle: "Plots for Sale",
      heroSubtitle: "Explore verified open plot projects across Hyderabad.",
    },
  ],
  commercial: [
    {
      value: "offices",
      label: "Offices",
      heroTitle: "Office Spaces",
      heroSubtitle: "Browse commercial office projects in strategic business corridors.",
    },
    {
      value: "retail",
      label: "Retail Spaces",
      heroTitle: "Retail Spaces",
      heroSubtitle: "Find high-visibility retail opportunities with strong growth potential.",
    },
    {
      value: "warehouses",
      label: "Warehouses",
      heroTitle: "Warehouses",
      heroSubtitle: "Explore warehouse and industrial assets suited for scale and logistics.",
    },
  ],
  rental: [
    {
      value: "short_term_rentals",
      label: "Short Term Rentals",
      heroTitle: "Short Term Rentals",
      heroSubtitle: "Find flexible short-stay inventory curated for convenience and comfort.",
    },
    {
      value: "long_term_rentals",
      label: "Long Term Rentals",
      heroTitle: "Long Term Rentals",
      heroSubtitle: "Browse long-term rental opportunities across strong residential catchments.",
    },
  ],
};
