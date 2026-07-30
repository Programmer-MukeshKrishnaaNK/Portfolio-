"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

import { process } from "@/content/site";
import { Container, Section } from "@/components/primitives/layout";
import { Reveal, RevealItem, RevealGroup, RevealRule } from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";

/**
 * Engineering process.
 *
 * The rail on the left fills in step with the scroll, which is the only piece
 * of scroll-linked motion on the page that carries information rather than
 * atmosphere: it tells you how much of the process you have read. Everything
 * else in this section is static, so the one moving element means something.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 85%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <Section id="process">
      <Container>
        <RevealRule />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <Reveal className="flex items-baseline gap-4">
            <span className="label-mono text-ink-faint">04</span>
            <span className="label-mono text-ink-muted">
              Engineering process
            </span>
          </Reveal>
          <Reveal>
            <span className="label-mono" data-numeric>
              {String(process.length).padStart(2, "0")} stages
            </span>
          </Reveal>
        </div>

        <div className="mt-stack grid gap-stack lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <TextReveal
              as="h2"
              text="The same six stages, every time."
              className="block max-w-[16ch] font-display text-title font-medium text-ink"
            />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[42ch] text-lead text-ink-secondary">
                Not a methodology. A sequence that front-loads the decisions
                which are expensive to reverse, and leaves the cheap ones for
                when there is something real to react to.
              </p>
            </Reveal>
          </div>
        </div>

        <div ref={ref} className="relative mt-section">
          {/* Track and fill. `scaleY` on a 1px column — no layout, and the
              track underneath keeps the rail legible before it fills. */}
          <div
            aria-hidden
            className="absolute left-0 top-0 hidden h-full w-px bg-hairline md:block"
          >
            {!reduced ? (
              <motion.div
                style={{ scaleY }}
                className="h-full w-px origin-top bg-gradient-to-b from-cyan-soft/70 to-violet-soft/40"
              />
            ) : null}
          </div>

          <RevealGroup className="md:pl-10 lg:pl-16" stagger={0.08}>
            {process.map((stage) => (
              <RevealItem key={stage.index}>
                <article className="group/stage grid gap-6 border-t border-hairline py-10 md:grid-cols-12 md:gap-8 md:py-12">
                  <div className="md:col-span-3">
                    <div className="flex items-baseline gap-4">
                      <span
                        data-numeric
                        className="label-mono text-ink-faint transition-colors duration-500 group-hover/stage:text-cyan-soft"
                      >
                        {stage.index}
                      </span>
                      <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-ink">
                        {stage.name}
                      </h3>
                    </div>
                    <p className="mt-3 pl-[2.4rem] font-mono text-[0.6875rem] leading-relaxed tracking-[0.04em] text-ink-faint md:pl-0">
                      {stage.duration}
                    </p>
                  </div>

                  <p className="max-w-[56ch] text-ink-secondary md:col-span-6">
                    {stage.body}
                  </p>

                  <ul className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                    {stage.artefacts.map((artefact) => (
                      <li
                        key={artefact}
                        className="rounded-full border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-muted"
                      >
                        {artefact}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
