"use client";

import { useEffect, useState } from "react";

/**
 * Scroll spy.
 *
 * Uses a narrow horizontal band across the upper-middle of the viewport as
 * the trigger line rather than "is any part visible". With tall sections and
 * a plain visibility test, two or three sections are on screen at once and
 * the indicator flickers between them; a band picks exactly one and holds it.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-24% 0px -68% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
