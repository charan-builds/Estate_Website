"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ekam-compare-projects";
const MAX_COMPARE = 3;

function readComparedProjects() {
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

export default function useCompareProjects() {
  const [comparedProjectIds, setComparedProjectIds] = useState<string[]>([]);

  useEffect(() => {
    setComparedProjectIds(readComparedProjects());
  }, []);

  function toggleComparedProject(projectId: string) {
    let limitReached = false;

    setComparedProjectIds((previous) => {
      let next = previous;

      if (previous.includes(projectId)) {
        next = previous.filter((item) => item !== projectId);
      } else if (previous.length < MAX_COMPARE) {
        next = [...previous, projectId];
      } else {
        limitReached = true;
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    return limitReached;
  }

  function clearComparedProjects() {
    setComparedProjectIds([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    comparedProjectIds,
    isCompared: (projectId: string) => comparedProjectIds.includes(projectId),
    toggleComparedProject,
    clearComparedProjects,
    maxCompare: MAX_COMPARE,
  };
}
