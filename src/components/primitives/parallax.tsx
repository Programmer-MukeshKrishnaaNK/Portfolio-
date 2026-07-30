"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Total travel in pixels across the element's full pass through the
   * viewport. Positive moves with the scroll (recedes), negative against it.
   */
  distance?: number;
}

/**
 * Depth from scroll position.
 *
 * Deliberately small by default. Parallax stops reading as depth and starts
 * reading as a bug the moment the offset is large enough to notice on its
 * own — the effect should be legible only by its absence.
 */
export function Parallax({
  children,
  className,
  distance = 60,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* Springing the progress rather than the output keeps the easing consistent
     regardless of how far the element travels. */
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
  });

  const y = useTransform(smooth, [0, 1], [distance / 2, -distance / 2]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
