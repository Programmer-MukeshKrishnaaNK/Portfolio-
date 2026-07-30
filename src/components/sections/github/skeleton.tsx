import { Container, Section } from "@/components/primitives/layout";

/**
 * Streaming fallback for the GitHub section.
 *
 * Holds the same geometry the loaded section will occupy — header, stat row,
 * calendar band, two-column repo grid — so the arriving data replaces
 * placeholder shapes in place rather than pushing the rest of the page down.
 * That is the whole job of a skeleton, and the reason this is not a spinner.
 */
export function GitHubSkeleton() {
  return (
    <Section id="github" aria-busy="true" aria-label="Loading GitHub activity">
      <Container>
        <div className="rule" />

        <div className="mt-6 flex items-baseline gap-4">
          <span className="label-mono text-ink-faint">06</span>
          <span className="label-mono text-ink-muted">GitHub</span>
        </div>

        <div className="mt-stack h-[3.5rem] w-[min(28rem,80%)] animate-pulse rounded-sm bg-white/[0.035]" />

        <div className="mt-section grid grid-cols-2 gap-px border-y border-hairline md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="py-6 md:px-6 md:first:pl-0">
              <div className="h-8 w-20 animate-pulse rounded-sm bg-white/[0.035]" />
              <div className="mt-3 h-2.5 w-24 animate-pulse rounded-sm bg-white/[0.025]" />
            </div>
          ))}
        </div>

        <div className="mt-section h-[7.5rem] w-full animate-pulse rounded-sm bg-white/[0.025]" />

        <div className="mt-section grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 bg-ground p-8">
              <div className="h-3.5 w-32 animate-pulse rounded-sm bg-white/[0.035]" />
              <div className="h-2.5 w-full animate-pulse rounded-sm bg-white/[0.025]" />
              <div className="h-2.5 w-3/5 animate-pulse rounded-sm bg-white/[0.025]" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
