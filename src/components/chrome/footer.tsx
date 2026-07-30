import Link from "next/link";

import { profile } from "@/content/profile";
import { Container } from "@/components/primitives/layout";
import { Reveal, RevealRule } from "@/components/primitives/reveal";
import { UnderlineLink } from "@/components/primitives/links";

/**
 * The footer closes the composition rather than ending it — the oversized
 * wordmark is the last thing on the page and is sized to be the largest type
 * on the site after the hero, which is what makes the scroll feel bookended.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 pb-10 pt-stack">
      <Container>
        <RevealRule />

        <div className="mt-stack grid gap-stack lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label-mono">Elsewhere</p>
            <ul className="mt-6 space-y-3">
              {profile.socials.map((social) => (
                <li key={social.label}>
                  <UnderlineLink
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="px-2 py-1 -mx-2 -my-1 text-lead text-ink-secondary hover:text-ink"
                  >
                    {social.label}
                  </UnderlineLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="label-mono">Colophon</p>
            <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-ink-muted">
              Built with Next.js and TypeScript. Type set in Geist and Inter,
              with Geist Mono for instrumentation. Motion is spring-driven and
              composited; scrolling is normalised with Lenis. Every reveal on
              this page has a resting state, so nothing here depends on
              animation to be readable.
            </p>
          </div>
        </div>

        {/* Oversized wordmark. Clipped deliberately at the baseline so it
            reads as a masthead rather than as a heading. */}
        <Reveal className="mt-section overflow-hidden pb-[0.06em]">
          <span
            aria-hidden
            className="block select-none font-display text-[clamp(3rem,17vw,15rem)] font-medium leading-[0.82] tracking-[-0.05em] text-gradient-ink"
          >
            {profile.fullName}
          </span>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <p className="label-mono">
            © {year} — {profile.location}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${profile.email}`}
              className="label-mono py-2 -my-2 transition-colors hover:text-ink"
            >
              {profile.email}
            </a>
            <Link
              href="#top"
              className="label-mono py-2 -my-2 transition-colors hover:text-ink"
            >
              Back to top ↑
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
