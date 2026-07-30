import { philosophy } from "@/content/site";
import { Container, Section } from "@/components/primitives/layout";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealRule,
} from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";

/**
 * Philosophy.
 *
 * A sticky title against a scrolling list. The device does real work here:
 * the heading stays in view for the whole passage, so five separate
 * statements read as one argument rather than as five disconnected cards.
 */
export function Philosophy() {
  return (
    <Section id="philosophy">
      <Container>
        <RevealRule />

        <div className="mt-6 grid gap-stack lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal className="flex items-baseline gap-4">
                <span className="label-mono text-ink-faint">02</span>
                <span className="label-mono text-ink-muted">Philosophy</span>
              </Reveal>

              <TextReveal
                as="h2"
                text="How I decide."
                className="mt-stack block font-display text-title font-medium text-ink"
              />

              <Reveal delay={0.1}>
                <p className="mt-8 max-w-[34ch] text-sm leading-relaxed text-ink-muted">
                  Five positions that hold across every project below. They are
                  the reason the case studies read as trade-offs rather than as
                  feature lists.
                </p>
              </Reveal>
            </div>
          </div>

          <RevealGroup className="lg:col-span-7 lg:col-start-6" stagger={0.09}>
            {philosophy.map((entry) => (
              <RevealItem key={entry.index}>
                <article className="group/entry border-t border-hairline py-10 first:border-t-0 first:pt-0 md:py-12">
                  <div className="flex gap-6 md:gap-10">
                    <span className="label-mono shrink-0 pt-1.5 tabular-nums text-ink-faint transition-colors duration-500 group-hover/entry:text-cyan-soft">
                      {entry.index}
                    </span>
                    <div>
                      <h3 className="max-w-[24ch] font-display text-subtitle font-medium text-ink">
                        {entry.title}
                      </h3>
                      <p className="mt-4 max-w-[58ch] text-ink-secondary">
                        {entry.body}
                      </p>
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
