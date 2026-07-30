import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/types";
import { projects } from "@/content/projects";
import { accent } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { Container, Section } from "@/components/primitives/layout";
import { Reveal, RevealRule } from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";
import { EditorialImage } from "@/components/primitives/editorial-image";
import { Spotlight } from "@/components/primitives/spotlight";

/**
 * Featured work.
 *
 * The flagship gets the full measure and the other two share a row. That
 * asymmetry is the editorial decision: three equal cards would tell a visitor
 * the three projects are equally important, which is not true and wastes the
 * one chance to say which piece of work to actually read.
 */
export function FeaturedWork() {
  const ordered = [...projects].sort((a, b) => a.rank - b.rank);
  const [flagship, ...rest] = ordered;

  return (
    <Section id="work">
      <Container>
        <RevealRule />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <Reveal className="flex items-baseline gap-4">
            <span className="label-mono text-ink-faint">03</span>
            <span className="label-mono text-ink-muted">Featured work</span>
          </Reveal>
          <Reveal>
            <span className="label-mono" data-numeric>
              {String(ordered.length).padStart(2, "0")} projects
            </span>
          </Reveal>
        </div>

        <TextReveal
          as="h2"
          text="Three products, and what each one cost to build."
          className="mt-stack block max-w-[20ch] font-display text-title font-medium text-ink"
        />

        <div className="mt-20 md:mt-28">
          <FlagshipCard project={flagship} />
        </div>

        <div className="mt-section grid gap-stack md:grid-cols-2">
          {rest.map((project) => (
            <SecondaryCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function FlagshipCard({ project }: { project: Project }) {
  const tone = accent[project.accent];

  return (
    <Reveal>
      <Spotlight accent={tone.spotlight} className="rounded-sm">
        <Link
          href={`/work/${project.slug}`}
          className="group/card block rounded-sm"
          aria-label={`${project.name} — read the case study`}
        >
          <div className="grid gap-stack lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-7">
              <EditorialImage
                src={project.cover.src}
                alt={project.cover.alt}
                ratio={project.cover.ratio}
                sizes="(max-width: 1024px) 100vw, 58vw"
                hoverZoom
              />
            </div>

            <div className="flex flex-col justify-between lg:col-span-5">
              <div>
                <div className="flex items-center gap-3">
                  <span className={cn("size-1.5 rounded-full", tone.dot)} />
                  <span className="label-mono text-ink-muted">
                    Flagship · {project.year}
                  </span>
                </div>

                {/* `text-title`, not `text-mega`: the flagship name sits in a
                    five-column slot, and mega runs to three lines there —
                    which pushes the metrics and the call to action out of the
                    frame. Two lines is the brief. */}
                <h3 className="mt-8 font-display text-title font-medium leading-[0.98] tracking-[-0.03em] text-ink">
                  {project.name}
                </h3>

                <p className={cn("mt-4 text-lead", tone.text)}>
                  {project.tagline}
                </p>

                <p className="mt-8 max-w-[46ch] text-ink-secondary">
                  {project.teaser}
                </p>
              </div>

              <div className="mt-stack">
                <dl className="grid grid-cols-2 gap-px border-y border-hairline">
                  {project.metrics.slice(0, 4).map((metric) => (
                    <div
                      key={metric.label}
                      className="border-b border-hairline py-4 last:border-b-0 even:pl-5 odd:pr-5 [&:nth-last-child(-n+2)]:border-b-0"
                    >
                      <dd
                        data-numeric
                        className="font-display text-xl font-medium tracking-[-0.02em] text-ink"
                      >
                        {metric.value}
                      </dd>
                      <dt className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint">
                        {metric.label}
                      </dt>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex items-center justify-between gap-6">
                  <ul className="flex flex-wrap gap-x-4 gap-y-2">
                    {project.stack.slice(0, 4).map((item) => (
                      <li key={item} className="label-mono">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink">
                    Case study
                    <ArrowUpRight
                      aria-hidden
                      className="size-3.5 transition-transform duration-500 ease-out-quiet group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Spotlight>
    </Reveal>
  );
}

function SecondaryCard({ project }: { project: Project }) {
  const tone = accent[project.accent];

  return (
    <Reveal>
      <Spotlight accent={tone.spotlight} className="h-full rounded-sm">
        <Link
          href={`/work/${project.slug}`}
          className="group/card flex h-full flex-col rounded-sm"
          aria-label={`${project.name} — read the case study`}
        >
          <EditorialImage
            src={project.cover.src}
            alt={project.cover.alt}
            ratio={project.cover.ratio}
            sizes="(max-width: 768px) 100vw, 44vw"
            hoverZoom
          />

          <div className="mt-8 flex flex-1 flex-col">
            <div className="flex items-center gap-3">
              <span className={cn("size-1.5 rounded-full", tone.dot)} />
              <span className="label-mono text-ink-muted">
                {String(project.rank).padStart(2, "0")} · {project.year}
              </span>
            </div>

            <h3 className="mt-6 font-display text-subtitle font-medium tracking-[-0.025em] text-ink">
              {project.name}
            </h3>

            <p className={cn("mt-2 text-sm", tone.text)}>{project.tagline}</p>

            <p className="mt-5 max-w-[44ch] flex-1 text-sm leading-relaxed text-ink-muted">
              {project.teaser}
            </p>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-hairline pt-5">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {project.stack.slice(0, 3).map((item) => (
                  <li key={item} className="label-mono">
                    {item}
                  </li>
                ))}
              </ul>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-ink-faint transition-all duration-500 ease-out-quiet group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-ink"
              />
            </div>
          </div>
        </Link>
      </Spotlight>
    </Reveal>
  );
}
