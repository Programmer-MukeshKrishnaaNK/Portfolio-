import { timeline } from "@/content/site";
import { portraits } from "@/content/profile";
import { Container, Section } from "@/components/primitives/layout";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealRule,
} from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";
import { EditorialImage } from "@/components/primitives/editorial-image";

/**
 * Timeline.
 *
 * Anchored to shipped work rather than to biography. A list of dates is a CV;
 * a list of what each project taught is an argument that the next one will go
 * better than the last.
 */
export function Timeline() {
  return (
    <Section id="timeline">
      <Container>
        <RevealRule />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <Reveal className="flex items-baseline gap-4">
            <span className="label-mono text-ink-faint">08</span>
            <span className="label-mono text-ink-muted">Timeline</span>
          </Reveal>
        </div>

        <div className="mt-stack grid gap-stack lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <TextReveal
              as="h2"
              text="What each one taught."
              className="block font-display text-title font-medium text-ink"
            />

            <div className="mt-stack">
              <EditorialImage
                src={portraits.interior.src}
                alt={portraits.interior.alt}
                ratio={portraits.interior.ratio}
                sizes="(max-width: 1024px) 100vw, 40vw"
                parallax={60}
              />
            </div>
          </div>

          <RevealGroup className="lg:col-span-6 lg:col-start-7" stagger={0.09}>
            {timeline.map((entry, i) => (
              <RevealItem key={entry.period}>
                <article className="group/item relative border-t border-hairline py-10 first:border-t-0 first:pt-0">
                  <div className="flex items-baseline gap-4">
                    <span className="label-mono text-ink-faint transition-colors duration-500 group-hover/item:text-cyan-soft">
                      {entry.period}
                    </span>
                    {i === timeline.length - 1 ? (
                      <span className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-cyan-soft" />
                        <span className="label-mono text-cyan-soft">Live</span>
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 max-w-[24ch] font-display text-subtitle font-medium tracking-[-0.022em] text-ink">
                    {entry.title}
                  </h3>

                  <p className="mt-4 max-w-[54ch] text-ink-secondary">
                    {entry.body}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint"
                      >
                        {tag}
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
