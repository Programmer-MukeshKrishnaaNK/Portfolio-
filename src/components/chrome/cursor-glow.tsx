"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect } from "react";

import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * Ambient light that follows the pointer across the whole page.
 *
 * Note what this deliberately is not: a replacement cursor. Hiding the native
 * cursor in favour of a custom dot is the single most common way a portfolio
 * trades usability for novelty — it breaks text selection affordances, lags
 * under load, and tells the user nothing. This adds light to the room and
 * leaves the cursor alone.
 *
 * Cost is one composited transform per frame on a single fixed layer.
 */
export function CursorGlow() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);

  /* Low stiffness: the glow should trail the cursor noticeably rather than
     stick to it, which is what makes it read as light rather than as an
     object being dragged around. */
  const sx = useSpring(x, { stiffness: 55, damping: 22, mass: 0.9 });
  const sy = useSpring(y, { stiffness: 55, damping: 22, mass: 0.9 });

  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;

    function onMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] h-[36rem] w-[36rem] rounded-full opacity-[0.055] blur-[100px] will-change-transform"
      style={{
        x: sx,
        y: sy,
        /* Centred with margins rather than a translate utility: Framer owns
           the `transform` property here, and stacking two sources of
           translation is a bug waiting for a version bump. */
        marginLeft: "-18rem",
        marginTop: "-18rem",
        background:
          "radial-gradient(circle, var(--accent-cyan) 0%, transparent 62%)",
      }}
    />
  );
}
