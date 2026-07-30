import { contact } from "@/content/site";
import { profile } from "@/content/profile";
import { Container, Section } from "@/components/primitives/layout";
import { Reveal, RevealRule } from "@/components/primitives/reveal";
import { TextReveal } from "@/components/primitives/text-reveal";
import { MagneticCta, UnderlineLink } from "@/components/primitives/links";

/**
 * Contact.
 *
 * No form. A form on a personal site adds a field to fill, a spam surface to
 * defend, and a delivery path that can fail silently — in exchange for
 * nothing the sender wanted. The email address, set large enough to read
 * across the room, is the whole interface.
 */
export function Contact() {
  return (
    <Section id="contact" className="pb-stack">
      <Container>
        <RevealRule />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <Reveal className="flex items-baseline gap-4">
            <span className="label-mono text-ink-faint">09</span>
            <span className="label-mono text-ink-muted">{contact.eyebrow}</span>
          </Reveal>
          <Reveal>
            <span className="flex items-center gap-2.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-soft opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-cyan-soft" />
              </span>
              <span className="label-mono text-cyan-soft">
                {profile.availability}
              </span>
            </span>
          </Reveal>
        </div>

        <TextReveal
          as="h2"
          text={contact.heading}
          className="mt-stack block max-w-[15ch] font-display text-mega font-medium"
          wordClassName="text-gradient-ink"
        />

        <div className="mt-stack grid gap-stack lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="max-w-[46ch] text-lead text-ink-secondary">
                {contact.body}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.16}>
              {/* The address is the primary control, so it is typeset as one
                  rather than tucked into a button. */}
              <a
                href={`mailto:${profile.email}`}
                className="group/mail inline-block max-w-full"
              >
                <span className="block break-all font-display text-[clamp(1.5rem,4.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink">
                  {profile.email}
                </span>
                <span
                  aria-hidden
                  className="mt-3 block h-px w-full origin-left scale-x-100 bg-hairline-strong transition-transform duration-[600ms] ease-out-quiet group-hover/mail:scale-x-0"
                />
              </a>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-stack flex flex-wrap items-center gap-4">
                <MagneticCta href={`mailto:${profile.email}`} external>
                  Send an email
                </MagneticCta>
                <MagneticCta href={profile.githubUrl} external>
                  View GitHub
                </MagneticCta>
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <ul className="mt-stack flex flex-wrap gap-x-8 gap-y-3 border-t border-hairline pt-6">
                {profile.socials.map((social) => (
                  <li key={social.label}>
                    <UnderlineLink
                      href={social.href}
                      target={
                        social.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        social.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      /* Horizontal padding too: a one-character label like
                         "X" is only 8px wide, so vertical padding alone
                         leaves the target under the minimum. */
                      className="px-2 py-1.5 -mx-2 -my-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted hover:text-ink"
                    >
                      {social.label}
                    </UnderlineLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
