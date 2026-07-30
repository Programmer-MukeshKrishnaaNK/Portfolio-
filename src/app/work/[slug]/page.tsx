import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import type { ProjectSlug } from "@/types";
import { getNextProject, getProject, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { accent } from "@/lib/accent";
import { cn } from "@/lib/utils";
import { Container, Section } from "@/components/primitives/layout";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealRule,
} from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";
import { EditorialImage } from "@/components/primitives/editorial-image";
import { MagneticCta } from "@/components/primitives/links";
import { Spotlight } from "@/components/primitives/spotlight";
import { ArchDiagram } from "@/components/case-study/arch-diagram";
import { Decisions } from "@/components/case-study/decisions";
import { Iterations } from "@/components/case-study/iterations";

/** Every case study is known at build time, so all three prerender. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Not found" };

  const description = `${project.teaser} ${project.role}, ${project.year}.`;

  return {
    title: project.name,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.name} — ${profile.fullName}`,
      description,
      url: `${profile.siteUrl}/work/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ${profile.fullName}`,
      description,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const tone = accent[project.accent];
  const next = getNextProject(project.slug as ProjectSlug);

  return (
    <article>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="pb-block pt-36 md:pt-44">
        <Container>
          <Reveal>
            <Link
              href="/#work"
              className="group/back inline-flex items-center gap-2.5 label-mono transition-colors hover:text-ink"
            >
              <ArrowLeft
                aria-hidden
                className="size-3 transition-transform duration-500 ease-out-quiet group-hover/back:-translate-x-1"
              />
              All work
            </Link>
          </Reveal>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Reveal className="flex items-center gap-3">
              <span className={cn("size-1.5 rounded-full", tone.dot)} />
              <span className="label-mono text-ink-muted">
                {String(project.rank).padStart(2, "0")} · {project.year} ·{" "}
                {project.role}
              </span>
            </Reveal>
          </div>

          <TextReveal
            as="h1"
            text={project.name}
            className="mt-8 block max-w-[16ch] font-display text-mega font-medium"
            wordClassName="text-gradient-ink"
          />

          <Reveal delay={0.12}>
            <p className={cn("mt-6 text-lead", tone.text)}>{project.tagline}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-10 max-w-[54ch] text-lead text-ink-secondary">
              {project.teaser}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <ul className="mt-12 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-hairline px-3.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>

        <div className="mt-block px-gutter">
          <EditorialImage
            src={project.cover.src}
            alt={project.cover.alt}
            ratio={project.cover.ratio}
            sizes="100vw"
            priority
            className="mx-auto w-full max-w-[110rem]"
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Problem / Solution                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="problem">
        <Container>
          <RevealRule />
          <div className="mt-stack grid gap-stack lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5">
              <Reveal className="flex items-baseline gap-4">
                <span className="label-mono text-ink-faint">01</span>
                <span className="label-mono text-ink-muted">The problem</span>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-10 max-w-[48ch] text-lead text-ink-secondary">
                  {project.problem}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal className="flex items-baseline gap-4">
                <span className="label-mono text-ink-faint">02</span>
                <span className="label-mono text-ink-muted">The approach</span>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-10 max-w-[52ch] text-lead text-ink">
                  {project.solution}
                </p>
              </Reveal>
            </div>
          </div>

          {/* Metrics */}
          <Reveal>
            <dl className="mt-section grid grid-cols-2 gap-px border-y border-hairline md:grid-cols-4">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border-b border-hairline py-8 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
                >
                  <dd
                    data-numeric
                    className="font-display text-3xl font-medium tracking-[-0.03em] text-ink md:text-4xl"
                  >
                    {metric.value}
                  </dd>
                  <dt className="mt-3 label-mono">{metric.label}</dt>
                  {metric.note ? (
                    <p className="mt-2 font-mono text-[0.625rem] leading-relaxed text-ink-faint">
                      {metric.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Chapters                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section id="chapters" className="py-0">
        <Container>
          <RevealGroup stagger={0.08}>
            {project.chapters.map((chapter) => (
              <RevealItem key={chapter.index}>
                <div className="grid gap-8 border-t border-hairline py-stack lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-span-4">
                    <div className="flex items-baseline gap-4 lg:sticky lg:top-32">
                      <span className="label-mono text-ink-faint">
                        {chapter.index}
                      </span>
                      <h2 className="max-w-[18ch] font-display text-subtitle font-medium text-ink">
                        {chapter.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
                    {chapter.body.map((paragraph, i) => (
                      <p
                        key={i}
                        className="max-w-[58ch] text-lead text-ink-secondary"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Architecture                                                      */}
      {/* ---------------------------------------------------------------- */}
      {project.architecture ? (
        <Section id="architecture">
          <Container>
            <RevealRule />
            <div className="mt-6 flex items-baseline gap-4">
              <Reveal className="flex items-baseline gap-4">
                <span className="label-mono text-ink-faint">03</span>
                <span className="label-mono text-ink-muted">Architecture</span>
              </Reveal>
            </div>

            <TextReveal
              as="h2"
              text={project.architecture.title}
              className="mt-stack block font-display text-title font-medium text-ink"
            />

            <Reveal>
              <div className="mt-stack">
                <ArchDiagram diagram={project.architecture} />
              </div>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Decisions                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Section id="decisions">
        <Container>
          <RevealRule />
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
            <Reveal className="flex items-baseline gap-4">
              <span className="label-mono text-ink-faint">04</span>
              <span className="label-mono text-ink-muted">
                Decisions and their cost
              </span>
            </Reveal>
            <Reveal>
              <span className="label-mono" data-numeric>
                {String(project.decisions.length).padStart(2, "0")} records
              </span>
            </Reveal>
          </div>

          <TextReveal
            as="h2"
            text="What each choice bought, and what it cost."
            className="mt-stack block max-w-[20ch] font-display text-title font-medium text-ink"
          />

          <Reveal>
            <div className="mt-stack">
              <Decisions decisions={project.decisions} />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Iterations                                                        */}
      {/* ---------------------------------------------------------------- */}
      {project.iterations ? (
        <Section id="iterations">
          <Container>
            <RevealRule />
            <div className="mt-6 flex items-baseline gap-4">
              <Reveal className="flex items-baseline gap-4">
                <span className="label-mono text-ink-faint">05</span>
                <span className="label-mono text-ink-muted">Iteration</span>
              </Reveal>
            </div>

            <TextReveal
              as="h2"
              text="Thirteen versions, and why."
              className="mt-stack block max-w-[18ch] font-display text-title font-medium text-ink"
            />

            <Reveal>
              <div className="mt-stack">
                <Iterations iterations={project.iterations} />
              </div>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Shots                                                             */}
      {/* ---------------------------------------------------------------- */}
      {project.shots.length > 0 ? (
        <Section id="detail" className="pt-0">
          <Container>
            <div className="flex flex-col gap-section">
              {project.shots.map((shot, i) => (
                <EditorialImage
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  ratio={shot.ratio}
                  caption={shot.caption}
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  parallax={i % 2 === 0 ? 60 : -60}
                  className={i % 2 === 0 ? "lg:mr-[8%]" : "lg:ml-[8%]"}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Impact                                                            */}
      {/* ---------------------------------------------------------------- */}
      <Section id="impact">
        <Container>
          <RevealRule />
          <div className="mt-6 flex items-baseline gap-4">
            <Reveal className="flex items-baseline gap-4">
              <span className="label-mono text-ink-faint">06</span>
              <span className="label-mono text-ink-muted">Outcome</span>
            </Reveal>
          </div>

          <RevealGroup className="mt-stack" stagger={0.09}>
            {project.impact.map((line, i) => (
              <RevealItem key={i}>
                <p className="flex gap-6 border-b border-hairline py-8 first:border-t first:border-hairline">
                  <span data-numeric className="label-mono shrink-0 pt-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-[62ch] text-lead text-ink-secondary">
                    {line}
                  </span>
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          {project.links?.live || project.links?.repo ? (
            <Reveal>
              <div className="mt-stack flex flex-wrap gap-4">
                {project.links.live ? (
                  <MagneticCta href={project.links.live} external>
                    Live site
                  </MagneticCta>
                ) : null}
                {project.links.repo ? (
                  <MagneticCta href={project.links.repo} external>
                    View GitHub
                  </MagneticCta>
                ) : null}
              </div>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Next                                                              */}
      {/* ---------------------------------------------------------------- */}
      <Section id="next" className="pt-0">
        <Container>
          <Reveal>
            <Spotlight accent={accent[next.accent].spotlight} className="rounded-sm">
              <Link
                href={`/work/${next.slug}`}
                className="group/card block border-t border-hairline pt-stack"
              >
                <div className="flex flex-wrap items-end justify-between gap-8">
                  <div>
                    <span className="label-mono">Next project</span>
                    <h2 className="mt-6 font-display text-title font-medium tracking-[-0.03em] text-ink-secondary transition-colors duration-500 group-hover/card:text-ink">
                      {next.name}
                    </h2>
                    <p className={cn("mt-4 text-lead", accent[next.accent].text)}>
                      {next.tagline}
                    </p>
                  </div>

                  <ArrowUpRight
                    aria-hidden
                    className="size-10 shrink-0 text-ink-faint transition-all duration-500 ease-out-quiet group-hover/card:translate-x-1 group-hover/card:-translate-y-1 group-hover/card:text-ink"
                  />
                </div>
              </Link>
            </Spotlight>
          </Reveal>
        </Container>
      </Section>
    </article>
  );
}
