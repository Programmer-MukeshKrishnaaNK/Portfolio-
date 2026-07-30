"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const LenisContext = createContext<Lenis | null>(null);

/** Null when smoothing is off — always guard before calling. */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

const HEADER_OFFSET = -96;

/**
 * Scroll smoothing.
 *
 * Lenis animates the real scroll position rather than transforming a wrapper,
 * which is the reason `position: sticky` still works throughout the site.
 *
 * Two things it has to get right to not be a downgrade:
 *
 *  - Under `prefers-reduced-motion` it never initialises. Smoothed scrolling
 *    is exactly the kind of vestibular trigger that setting exists for, and
 *    the browser's own scrolling is the correct fallback.
 *  - Anchor links are intercepted and handed to Lenis. Left alone, a native
 *    hash jump and an in-flight Lenis animation fight each other and land
 *    somewhere neither intended.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      lerp: 0.095,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    });

    setLenis(instance);

    let frame = 0;
    const loop = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  /* Route changes must reset scroll themselves: Lenis owns the position, so
     the browser's own restoration lands in the wrong place. */
  useEffect(() => {
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  useEffect(() => {
    if (!lenis) return;

    function onClick(event: MouseEvent) {
      /* Let the browser handle modified clicks — new tab, new window, and
         download shortcuts all rely on the default behaviour. */
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const isSamePageHash =
        href.startsWith("#") ||
        (href.startsWith("/#") && pathname === "/");
      if (!isSamePageHash) return;

      const id = href.slice(href.indexOf("#") + 1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      lenis!.scrollTo(target, { offset: HEADER_OFFSET });

      /* Keep the URL truthful without triggering a second native jump. */
      window.history.pushState(null, "", `#${id}`);

      /* A hash jump normally moves focus. Restoring that keeps the section
         reachable for keyboard and screen-reader users. */
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis, pathname]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
