import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal, RevealRule } from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";

/**
 * The measure. Everything on the site aligns to this container, including the
 * hairline grid, which is what makes the vertical rules read as structure
 * rather than as decoration laid over the top.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[92rem] px-gutter", className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      /* Clears the fixed header when an anchor link lands here. */
      className={cn("relative scroll-mt-28 py-section", className)}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  lead?: string;
  className?: string;
  /** Right-hand slot for a count, status, or link. */
  aside?: ReactNode;
}

/**
 * Every section opens the same way: a rule, an index, a label, then the
 * title. The repetition is the point — it is the device that tells you where
 * you are in a long scroll without a progress bar having to say it.
 */
export function SectionHeader({
  index,
  label,
  title,
  lead,
  className,
  aside,
}: SectionHeaderProps) {
  return (
    <header className={cn("relative", className)}>
      <RevealRule />

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <Reveal className="flex items-baseline gap-4">
          <span className="label-mono text-ink-faint">{index}</span>
          <span className="label-mono text-ink-muted">{label}</span>
        </Reveal>
        {aside ? <Reveal className="label-mono">{aside}</Reveal> : null}
      </div>

      <TextReveal
        as="h2"
        text={title}
        className="mt-stack max-w-[22ch] text-title font-display text-ink"
      />

      {lead ? (
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-[58ch] text-lead text-ink-secondary">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}

/**
 * Vertical rules that run the full height of the page behind the content.
 *
 * Fixed rather than repeated per section, so they stay perfectly continuous
 * through the whole scroll — a rule that restarts at each section boundary
 * reads as a seam. Hidden below `md`, where four columns of gutter would eat
 * the measure.
 */
export function HairlineGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
    >
      <Container className="h-full">
        <div className="grid h-full grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-l border-hairline/60 last:border-r"
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
