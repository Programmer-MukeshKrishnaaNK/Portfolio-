import { Container } from "@/components/primitives/layout";
import { MagneticCta } from "@/components/primitives/links";

export const metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

/**
 * 404. Written as a state of the site rather than an apology — the same
 * register as every other designed state in the system.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center py-section">
      <Container>
        <p className="label-mono">Error · 404</p>

        <h1 className="mt-10 max-w-[14ch] font-display text-mega font-medium text-gradient-ink">
          This page was never built.
        </h1>

        <p className="mt-10 max-w-[46ch] text-lead text-ink-secondary">
          The address resolved, but there is nothing at it. Most likely a link
          that outlived the thing it pointed at.
        </p>

        <div className="mt-stack flex flex-wrap gap-4">
          <MagneticCta href="/">Back to the start</MagneticCta>
          <MagneticCta href="/#work">See the work</MagneticCta>
        </div>
      </Container>
    </section>
  );
}
