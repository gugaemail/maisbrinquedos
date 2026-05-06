"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function useUTMCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasUtm = UTM_KEYS.some((k) => searchParams.get(k));
    if (!hasUtm) return;

    const stored: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const val = searchParams.get(k);
      if (val) stored[k] = val;
    });

    sessionStorage.setItem("utm_params", JSON.stringify(stored));
  }, [searchParams]);
}

export function getStoredUTM(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("utm_params") ?? "{}");
  } catch {
    return {};
  }
}
