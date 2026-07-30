"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  blurUp,
  fadeUp,
  scaleIn,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";

const variantMap = { fadeUp, blurUp, scaleIn } satisfies Record<string, Variants>;

export type RevealVariant = keyof typeof variantMap;

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Seconds. Use sparingly — prefer `<RevealGroup>` for sequencing. */
  delay?: number;
}

/**
 * Reveals a block once, when it enters the viewport.
 *
 * Under `prefers-reduced-motion` this renders a plain element in its resting
 * state. That is the important half of the contract: the animation adds the
 * entrance, it is never what makes the content visible, so nothing disappears
 * when motion is switched off.
 */
export function Reveal({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child. */
  stagger?: number;
  delayChildren?: number;
}

/**
 * Sequences its `<RevealItem>` children. Staggering is what stops a section
 * from arriving as a single slab — the eye is given an order to read in.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delayChildren = 0.05,
}: RevealGroupProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  variant = "fadeUp",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={variantMap[variant]}>
      {children}
    </motion.div>
  );
}

/**
 * A hairline that draws itself open from the left. Uses `scaleX` rather than
 * `width` so the browser never re-runs layout for it.
 */
export function RevealRule({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={cn("rule", className)} />;

  return (
    <motion.div
      className={cn("rule origin-left", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
