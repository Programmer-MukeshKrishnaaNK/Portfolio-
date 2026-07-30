"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { easeOutQuiet, viewportEager } from "@/lib/motion";

interface EditorialImageProps {
  src: string;
  alt: string;
  /** width / height. Declared so space is reserved before the file decodes. */
  ratio: number;
  className?: string;
  /** Responsive `sizes` hint. Getting this wrong is the usual cause of a
      2400px image being downloaded into a 400px slot. */
  sizes?: string;
  priority?: boolean;
  /** Vertical drift in pixels across the element's pass through the viewport. */
  parallax?: number;
  caption?: string;
  /**
   * Slow zoom while an ancestor marked `group/card` is hovered. Applied to
   * the `<img>` rather than to the motion wrapper, so it composes with the
   * reveal and parallax transforms instead of overwriting them.
   */
  hoverZoom?: boolean;
}

/**
 * Photography, treated as photography.
 *
 * Three things this does that a bare `<Image>` does not:
 *
 *  - Reserves exact space from the declared ratio, so nothing on the page
 *    moves as the file decodes. This is the single biggest CLS lever on an
 *    image-led layout.
 *  - Reveals with a mask retracting over a slight scale-down, both pure
 *    transforms. No `clip-path` animation, no `width`, nothing that would
 *    pull the compositor back onto the main thread.
 *  - Degrades to a silent toned panel rather than a broken-image glyph if a
 *    source ever fails, so a network hiccup costs the page a photograph and
 *    not its composition.
 */
export function EditorialImage({
  src,
  alt,
  ratio,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 45vw",
  priority = false,
  parallax = 0,
  caption,
  hoverZoom = false,
}: EditorialImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
  });
  const y = useTransform(smooth, [0, 1], [parallax / 2, -parallax / 2]);

  const drift = parallax !== 0 && !reduced;

  return (
    <figure className={cn("relative", className)}>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-sm bg-card-surface"
        style={{ aspectRatio: ratio }}
      >
        {failed ? (
          <PlaceholderFrame />
        ) : (
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={drift ? { y, scale: 1.08 } : undefined}
            initial={reduced ? undefined : { scale: 1.08 }}
            whileInView={reduced || drift ? undefined : { scale: 1 }}
            viewport={viewportEager}
            transition={{ duration: 1.4, ease: easeOutQuiet }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              onError={() => setFailed(true)}
              className={cn(
                "object-cover",
                hoverZoom &&
                  "transition-transform duration-[1100ms] ease-out-quiet group-hover/card:scale-[1.035]",
              )}
            />
          </motion.div>
        )}

        {/* The wipe. Retracts upward, matching the direction type rises in. */}
        {!reduced && !failed ? (
          <motion.div
            aria-hidden
            className="absolute inset-0 z-10 origin-top bg-ground will-change-transform"
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={viewportEager}
            transition={{ duration: 1.1, ease: easeOutQuiet }}
          />
        ) : null}

        {/* Grounds the image against the page instead of letting it float as
            a bright rectangle on a near-black field. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-white/[0.08]"
        />
      </div>

      {caption ? (
        <figcaption className="mt-4 max-w-[52ch] font-mono text-[0.6875rem] leading-relaxed tracking-[0.04em] text-ink-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Last-resort surface, shown only if an image fails to load in production.
 *
 * Silent by design. An earlier version printed the asset path and a status
 * label, which was useful while the photography was outstanding and is
 * exactly the wrong thing to ship — a visitor should never be shown a
 * filename or a note addressed to whoever is building the site. It now
 * renders as a plain toned panel that reads as intentional negative space,
 * and the alt text still carries the meaning for assistive tech.
 */
function PlaceholderFrame() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(135deg,#0d0d0e,#141416)]"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.02) 0 1px, transparent 1px 10px)",
        }}
      />
    </div>
  );
}
