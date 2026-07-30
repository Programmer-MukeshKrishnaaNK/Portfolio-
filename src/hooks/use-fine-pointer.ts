"use client";

import { useEffect, useState } from "react";

/**
 * True only for devices with a hovering, precise pointer.
 *
 * Everything cursor-driven on this site is gated behind this. On touch there
 * is no cursor to be magnetic towards and no hover state to light up, so the
 * listeners would be pure cost — and starting `false` means the server render
 * and the touch render agree, which avoids a hydration mismatch.
 */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);

    const onChange = (event: MediaQueryListEvent) => setFine(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return fine;
}
