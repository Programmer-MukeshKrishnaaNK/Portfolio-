"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment, type ElementType } from "react";

import { cn } from "@/lib/utils";
import { easeOutQuiet, viewportOnce } from "@/lib/motion";

interface TextRevealProps {
  text: string;
  /** Rendered container element. Defaults to a span so it stays inline-safe. */
  as?: ElementType;
  className?: string;
  /**
   * Applied to each word rather than to the container.
   *
   * This exists for `text-gradient-ink` and anything else built on
   * `background-clip: text`. Those set `color: transparent` and paint the
   * glyphs from the element's own background — but every glyph here lives in
   * a child span, so the container has no text of its own to clip against.
   * The children inherit the transparency and paint nothing at all. Putting
   * the gradient on the words is what makes it visible.
   */
  wordClassName?: string;
  /** Seconds between words. */
  stagger?: number;
  delay?: number;
  duration?: number;
}

/**
 * Type that rises out from behind a mask, one word at a time.
 *
 * Two details make the difference between this reading as craft and reading
 * as a gimmick:
 *
 *  - The mask has vertical breathing room (`pb`/`-mb`) so descenders in words
 *    like "typography" are not sheared off at rest.
 *  - The full string is announced once via `aria-label`, and the word spans
 *    are hidden from assistive tech. Without that, a screen reader reads the
 *    headline one word per pause, which is unusable.
 */
export function TextReveal({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  stagger = 0.045,
  delay = 0,
  duration = 1,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    /* One text node, so the word class belongs on the container here. */
    return <Tag className={cn(className, wordClassName)}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
      >
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
              <motion.span
                className={cn("inline-block will-change-transform", wordClassName)}
                variants={{
                  hidden: { y: "112%" },
                  visible: {
                    y: "0%",
                    transition: { duration, ease: easeOutQuiet },
                  },
                }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Paragraph-scale variant. Words are too fine a grain for body copy — it
 * turns reading into watching — so lines are passed in explicitly and
 * revealed as blocks.
 *
 * Space the lines with `flex flex-col gap-*` on `className`, not `space-y-*`.
 * Each wrapper carries a negative bottom margin to cancel its descender
 * padding, and Tailwind v4 emits `space-y` inside `:where()` — zero
 * specificity — so the negative margin silently wins and the gap collapses.
 */
export function LinesReveal({
  lines,
  className,
  lineClassName,
  stagger = 0.09,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className}>
        {lines.map((line, i) => (
          <p key={i} className={lineClassName}>
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="overflow-hidden pb-[0.1em] -mb-[0.1em]"
        >
          <motion.p
            className={cn("will-change-transform", lineClassName)}
            variants={{
              hidden: { y: "105%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.95, ease: easeOutQuiet },
              },
            }}
          >
            {line}
          </motion.p>
        </div>
      ))}
    </motion.div>
  );
}
