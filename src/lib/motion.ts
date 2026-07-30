import type { Transition, Variants } from "framer-motion";

/**
 * Motion vocabulary.
 *
 * Two working rules, both enforced by only exporting what obeys them:
 *
 *  - Animate `transform`, `opacity`, and `filter` only. These are the
 *    properties the compositor can handle without touching layout, which is
 *    what keeps frames cheap. Nothing here animates width, height, top, or
 *    left.
 *  - Entrances are slower than exits. A thing arriving deserves to be
 *    noticed; a thing leaving should get out of the way.
 */

/* -------------------------------------------------------------------------- */
/* Springs                                                                    */
/* -------------------------------------------------------------------------- */

/** Default for anything entering the viewport. Settles without wobble. */
export const springQuiet: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 22,
  mass: 0.7,
};

/** Cursor-following and pointer-tracked elements. Loose enough to feel alive. */
export const springTrail: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 0.45,
};

/** Magnetic buttons and small hover displacements. Immediate, no overshoot. */
export const springSnap: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.4,
};

/** Shared-layout transitions between a teaser and its case study. */
export const springShared: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 20,
  mass: 0.9,
};

/* -------------------------------------------------------------------------- */
/* Easings                                                                    */
/* -------------------------------------------------------------------------- */

/** Fast start, long tail. The house curve for reveals. */
export const easeOutQuiet = [0.16, 1, 0.3, 1] as const;

/** Symmetric. For things that travel across the screen and stop. */
export const easeInOutQuiet = [0.76, 0, 0.24, 1] as const;

/* -------------------------------------------------------------------------- */
/* Variants                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Stagger container. `delayChildren` buys a beat so the section's own frame
 * lands before its contents start arriving — the alternative is everything
 * moving at once, which reads as a page load rather than a composition.
 */
export const staggerContainer = (
  stagger = 0.07,
  delayChildren = 0.05,
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** The workhorse. Small rise, no scale, no blur. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: springQuiet },
};

/** Rise with a defocus. Reserved for section openers, never for body copy. */
export const blurUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeOutQuiet },
  },
};

/** For images and cards that should feel like they settle into place. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: easeOutQuiet },
  },
};

/**
 * A single line of type rising out from behind a mask. The parent must clip
 * overflow for this to read correctly — see `<TextReveal />`.
 */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1, ease: easeOutQuiet },
  },
};

/** Hairline rules that draw themselves open. Uses scaleX, not width. */
export const drawRule: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.1, ease: easeOutQuiet },
  },
};

/* -------------------------------------------------------------------------- */
/* Viewport                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Shared `whileInView` config. `once: true` matters: re-triggering reveals on
 * every scroll-past turns a considered entrance into a nervous tic, and it
 * makes back-navigation feel broken.
 *
 * The negative bottom margin holds the trigger until the element is properly
 * on screen instead of firing the instant one pixel crosses the fold.
 */
export const viewportOnce = {
  once: true,
  margin: "0px 0px -12% 0px",
} as const;

/** Earlier trigger for tall elements that would otherwise reveal too late. */
export const viewportEager = {
  once: true,
  margin: "0px 0px -4% 0px",
} as const;
