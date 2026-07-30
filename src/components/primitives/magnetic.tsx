"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { springSnap } from "@/lib/motion";
import { useFinePointer } from "@/hooks/use-fine-pointer";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Fraction of the pointer's offset the element follows. Keep it under 0.4. */
  strength?: number;
}

/**
 * Pulls its child slightly toward the cursor.
 *
 * The restraint here is the whole point: at 0.25 the element does not appear
 * to move, it appears to be slightly easier to hit. Push the strength past
 * about 0.4 and it becomes a toy that actively makes the target harder to
 * click, because it runs away from where the user aimed.
 */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springSnap);
  const sy = useSpring(y, springSnap);

  const enabled = fine && !reduced;

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      /* Focus moves by keyboard, which has no coordinates — snap back so a
         tabbed-to control is never left displaced from its resting position. */
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}
