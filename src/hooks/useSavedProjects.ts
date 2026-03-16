"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ekam-saved-projects";

function readSavedProjects() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function useSavedProjects() {
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedProjectIds(readSavedProjects());
  }, []);

  function toggleSavedProject(projectId: string) {
    setSavedProjectIds((previous) => {
      const next = previous.includes(projectId)
        ? previous.filter((item) => item !== projectId)
        : [...previous, projectId];

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return {
    savedProjectIds,
    isSaved: (projectId: string) => savedProjectIds.includes(projectId),
    toggleSavedProject,
  };
}
