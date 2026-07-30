"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Route transition.
 *
 * `template.tsx` remounts on every navigation, which is what makes an enter
 * animation possible at all in the App Router.
 *
 * Opacity only, deliberately. Animating a transform here would make this
 * element a containing block for every `position: fixed` descendant and
 * change how `sticky` resolves inside the case studies — a page-level
 * wrapper is the worst possible place to introduce that. The arriving page's
 * own choreography supplies the movement; this just handles the handover.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
