"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";

import type { Project } from "@/types";
import { projects } from "@/content/projects";
import { accent } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { springTrail } from "@/lib/motion";
import { Container, Section } from "@/components/primitives/layout";
import { Reveal, RevealRule } from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";
import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * Selected work, as an index.
 *
 * Deliberately the opposite treatment to the featured section above: dense,
 * tabular, and scannable. The same three projects seen through a different
 * lens — one view is for deciding what to read, this one is for checking
 * scope, year, and role at a glance.
 *
 * The cursor-following preview is the one place a hover effect earns its
 * keep: it answers "what does this look like" without costing a click, and
 * it is skipped entirely on touch where there is no hover to hang it on.
 */
export function WorkIndex() {
  const ordered = [...projects].sort((a, b) => a.rank - b.rank);
  const fine = useFinePointer();
  const [hovered, setHovered] = useState<Project | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springTrail);
  const sy = useSpring(y, springTrail);

  function onPointerMove(event: React.PointerEvent) {
    x.set(event.clientX + 28);
    y.set(event.clientY - 120);
  }

  return (
    <Section id="index-work">
      <Container>
        <RevealRule />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <Reveal className="flex items-baseline gap-4">
            <span className="label-mono text-ink-faint">05</span>
            <span className="label-mono text-ink-muted">Selected work</span>
          </Reveal>
          <Reveal>
            <span className="label-mono">Index</span>
          </Reveal>
        </div>

        <TextReveal
          as="h2"
          text="The archive."
          className="mt-stack block font-display text-title font-medium text-ink"
        />

        <div
          className="mt-stack"
          onPointerMove={fine ? onPointerMove : undefined}
          onPointerLeave={() => setHovered(null)}
        >
          {/* Column headings. Hidden from assistive tech because each row is
              a self-describing link, not a data cell. */}
          <div
            aria-hidden
            className="hidden grid-cols-12 gap-4 border-b border-hairline pb-4 md:grid"
          >
            <span className="label-mono col-span-1">No.</span>
            <span className="label-mono col-span-4">Project</span>
            <span className="label-mono col-span-2">Year</span>
            <span className="label-mono col-span-4">Role</span>
          </div>

          <ul>
            {ordered.map((project, i) => {
              const tone = accent[project.accent];
              return (
                <Reveal key={project.slug} delay={i * 0.05}>
                  <li>
                    <Link
                      href={`/work/${project.slug}`}
                      onPointerEnter={() => setHovered(project)}
                      onFocus={() => setHovered(null)}
                      className={cn(
                        "group/row grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-b border-hairline py-7",
                        "transition-colors duration-500 hover:border-hairline-strong",
                      )}
                    >
                      <span
                        data-numeric
                        className="label-mono col-span-2 transition-colors duration-500 group-hover/row:text-ink md:col-span-1"
                      >
                        {String(project.rank).padStart(2, "0")}
                      </span>

                      <span className="col-span-10 md:col-span-4">
                        <span className="flex items-baseline gap-3">
                          <span className="inline-block font-display text-xl font-medium tracking-[-0.02em] text-ink-secondary transition-all duration-500 ease-out-quiet group-hover/row:translate-x-1 group-hover/row:text-ink md:text-2xl">
                            {project.name}
                          </span>
                          <span
                            className={cn(
                              "size-1.5 shrink-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/row:opacity-100",
                              tone.dot,
                            )}
                          />
                        </span>
                        <span className="mt-1 block text-sm text-ink-faint md:hidden">
                          {project.year} · {project.role}
                        </span>
                      </span>

                      <span
                        data-numeric
                        className="col-span-2 hidden font-mono text-xs tracking-[0.04em] text-ink-muted md:block"
                      >
                        {project.year}
                      </span>

                      <span className="col-span-4 hidden items-baseline justify-between gap-4 md:flex">
                        <span className="text-sm text-ink-muted">
                          {project.role}
                        </span>
                        <span
                          aria-hidden
                          className="font-mono text-xs text-ink-faint transition-all duration-500 ease-out-quiet group-hover/row:translate-x-1 group-hover/row:text-ink"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>

      {fine ? (
        <AnimatePresence>
          {hovered ? (
            <motion.div
              key={hovered.slug}
              aria-hidden
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none fixed left-0 top-0 z-[95] w-64 overflow-hidden rounded-sm border border-hairline-strong bg-card-surface will-change-transform"
            >
              <PreviewImage project={hovered} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </Section>
  );
}

function PreviewImage({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: project.cover.ratio }}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-end bg-[linear-gradient(135deg,#0d0d0e,#151517)] p-4">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint">
            {project.name}
          </span>
        </div>
      ) : (
        <Image
          src={project.cover.src}
          alt=""
          fill
          sizes="256px"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </div>
  );
}
