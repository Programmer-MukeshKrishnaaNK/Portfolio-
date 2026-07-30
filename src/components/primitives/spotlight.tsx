"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useFinePointer } from "@/hooks/use-fine-pointer";

const accentRgb = {
  cyan: "110 231 240",
  violet: "167 139 250",
  neutral: "255 255 255",
} as const;

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  accent?: keyof typeof accentRgb;
  /** Radius of the light pool in pixels. */
  radius?: number;
}

/**
 * A surface that catches light from the cursor.
 *
 * The light is drawn on a `::before`-style overlay rather than on the card
 * itself, so the card's own background, border, and contents are never
 * repainted — only the overlay layer is. Opacity is transitioned in CSS so
 * moving the pointer between cards fades rather than snaps.
 *
 * Purely decorative: it conveys no state and is skipped entirely on touch.
 */
export function Spotlight({
  children,
  className,
  accent = "neutral",
  radius = 340,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgb(${accentRgb[accent]} / 0.10), transparent 72%)`;
  const edge = useMotionTemplate`radial-gradient(${radius * 0.75}px circle at ${mx}px ${my}px, rgb(${accentRgb[accent]} / 0.34), transparent 68%)`;

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!fine || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(event.clientX - rect.left);
    my.set(event.clientY - rect.top);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={cn("group/spotlight relative isolate", className)}
    >
      {fine ? (
        <>
          {/* Lit edge: a gradient border rendered as a mask so only the
              1px rim is coloured, not the whole card. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-px z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
            style={{
              background: edge,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: 1,
            }}
          />
          {/* Light pool across the surface. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
            style={{ background }}
          />
        </>
      ) : null}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}
