import { stack } from "@/content/site";
import { Container, Section } from "@/components/primitives/layout";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealRule,
} from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";
import { Spotlight } from "@/components/primitives/spotlight";

/**
 * Technology.
 *
 * Every entry carries what it is used *for*. A logo wall communicates
 * familiarity; a role communicates judgement, and judgement is the thing
 * worth demonstrating. Grouping by concern rather than by language also
 * makes the omissions legible — what is missing from a list is usually more
 * informative than what is on it.
 */
export function Technology() {
  return (
    <Section id="stack">
      <Container>
        <RevealRule />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <Reveal className="flex items-baseline gap-4">
            <span className="label-mono text-ink-faint">07</span>
            <span className="label-mono text-ink-muted">Technology</span>
          </Reveal>
          <Reveal>
            <span className="label-mono">Tools, and what each is for</span>
          </Reveal>
        </div>

        <TextReveal
          as="h2"
          text="Chosen for what they let me stop worrying about."
          className="mt-stack block max-w-[18ch] font-display text-title font-medium text-ink"
        />

        <RevealGroup
          className="mt-section grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2"
          stagger={0.07}
        >
          {stack.map((group) => (
            <RevealItem key={group.name} className="bg-ground">
              <Spotlight className="h-full">
                <div className="flex h-full flex-col p-8 md:p-10">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-ink">
                      {group.name}
                    </h3>
                    <span
                      data-numeric
                      className="label-mono"
                    >
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-ink-faint">
                    {group.note}
                  </p>

                  <dl className="mt-8 space-y-0">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-hairline py-3.5"
                      >
                        <dt className="text-sm text-ink-secondary">
                          {item.name}
                        </dt>
                        <dd className="font-mono text-[0.6875rem] tracking-[0.04em] text-ink-faint">
                          {item.role}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Spotlight>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
