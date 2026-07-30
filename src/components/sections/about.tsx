import { about } from "@/content/site";
import { portraits, profile } from "@/content/profile";
import { Container, Section } from "@/components/primitives/layout";
import { Reveal, RevealRule } from "@/components/primitives/reveal";
import { TextReveal, LinesReveal } from "@/components/primitives/text-reveal";
import { EditorialImage } from "@/components/primitives/editorial-image";

/**
 * About.
 *
 * Asymmetric on purpose: the portrait sits in a narrow right column with a
 * full column of empty space to its left. On a dark page, whitespace is the
 * only thing that makes a photograph read as a photograph rather than as a
 * UI element.
 */
export function About() {
  return (
    <Section id="index">
      <Container>
        <RevealRule />

        <div className="mt-6 flex items-baseline gap-4">
          <Reveal className="flex items-baseline gap-4">
            <span className="label-mono text-ink-faint">01</span>
            <span className="label-mono text-ink-muted">{about.eyebrow}</span>
          </Reveal>
        </div>

        <div className="mt-stack grid gap-stack lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <TextReveal
              as="h2"
              text={about.heading}
              className="block max-w-[16ch] font-display text-mega font-medium"
              wordClassName="text-gradient-ink"
            />

            <LinesReveal
              lines={[...about.body]}
              /* `gap`, not `space-y`: Tailwind v4 emits space utilities inside
                 `:where()`, so they carry zero specificity and lose to the
                 descender-correction margin on each line wrapper. */
              className="mt-stack flex max-w-[54ch] flex-col gap-6"
              lineClassName="text-lead text-ink-secondary"
            />

            <Reveal delay={0.1}>
              <dl className="mt-stack grid gap-px overflow-hidden border-y border-hairline sm:grid-cols-2">
                {about.facts.map((fact) => (
                  <div
                    key={fact.key}
                    className="border-b border-hairline py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:even:pl-6 sm:odd:pr-6"
                  >
                    <dt className="label-mono">{fact.key}</dt>
                    <dd className="mt-2 text-sm text-ink-secondary">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <EditorialImage
              src={portraits.main.src}
              alt={portraits.main.alt}
              ratio={portraits.main.ratio}
              sizes="(max-width: 1024px) 100vw, 32vw"
              parallax={70}
            />
            <p className="mt-5 max-w-[34ch] font-mono text-[0.6875rem] leading-relaxed tracking-[0.04em] text-ink-faint">
              {profile.location} · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
