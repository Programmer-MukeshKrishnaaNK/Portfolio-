import type { Iteration } from "@/types";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/primitives/reveal";

/**
 * The version ladder.
 *
 * Rungs where something broke are marked. That marking is the point of the
 * whole component: a version history with the failures smoothed out reads as
 * thirteen tidy improvements, which is both untrue and far less interesting
 * than what actually happened.
 */
export function Iterations({ iterations }: { iterations: Iteration[] }) {
  const failures = iterations.filter((i) => i.failure).length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5">
        <p className="label-mono">Version history</p>
        <p className="label-mono" data-numeric>
          {iterations.length} stages · {failures} caused by a defect
        </p>
      </div>

      <RevealGroup className="relative" stagger={0.06}>
        {/* Continuous rail behind the rungs. */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 top-0 hidden w-px bg-hairline md:block"
        />

        {iterations.map((iteration) => (
          <RevealItem key={iteration.range}>
            <article className="relative grid gap-3 border-b border-hairline py-8 md:grid-cols-12 md:gap-8 md:pl-10">
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-[2.45rem] hidden size-1.5 -translate-x-[0.19rem] rounded-full md:block",
                  iteration.failure ? "bg-violet-soft" : "bg-ink-faint",
                )}
              />

              <div className="md:col-span-3">
                <div className="flex items-center gap-3">
                  <span
                    data-numeric
                    className={cn(
                      "font-mono text-sm tracking-[0.02em]",
                      iteration.failure ? "text-violet-soft" : "text-ink-secondary",
                    )}
                  >
                    {iteration.range}
                  </span>
                  {iteration.failure ? (
                    <span className="rounded-full border border-violet-soft/30 px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-violet-soft/90">
                      Defect
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="md:col-span-9">
                <h3 className="font-display text-lg font-medium tracking-[-0.02em] text-ink">
                  {iteration.title}
                </h3>
                <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
                  {iteration.body}
                </p>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
