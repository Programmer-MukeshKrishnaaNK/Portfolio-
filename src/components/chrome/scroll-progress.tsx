"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * The horizon.
 *
 * A single hairline at the very top of the viewport that fills as the
 * document is read. It replaces a percentage readout, a numbered pager, and
 * a scrollbar restyle — one element doing the job of three, which is the only
 * reason it earns its place on the page.
 *
 * `scaleX` on a fixed layer: no layout, no paint, one composited property.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-px origin-left bg-cyan-soft/70 will-change-transform"
    />
  );
}
