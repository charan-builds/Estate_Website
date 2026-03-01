import { ProjectStatus } from "@/types/project";

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
