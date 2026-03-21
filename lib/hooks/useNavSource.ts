"use client";

import { useSearchParams } from "next/navigation";

/**
 * Tracks navigation source for drill-in patterns.
 * E.g., navigating from Risk → Actions preserves context.
 */
export function useNavSource() {
  const searchParams = useSearchParams();
  const source = searchParams.get("from");
  const sourceId = searchParams.get("id");

  function buildLink(href: string, from: string, id?: string) {
    const params = new URLSearchParams();
    params.set("from", from);
    if (id) params.set("id", id);
    return `${href}?${params.toString()}`;
  }

  return {
    source,
    sourceId,
    buildLink,
    hasSource: !!source,
  };
}
