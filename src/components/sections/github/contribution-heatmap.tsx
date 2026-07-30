"use client";

import { useState } from "react";

import type { ContributionCalendar } from "@/types";
import { cn } from "@/lib/utils";

/* Cyan is the system/live accent, so activity intensity is the one place a
   sequential ramp of it is justified. */
const LEVEL_CLASS = [
  "bg-white/[0.05]",
  "bg-cyan-soft/20",
  "bg-cyan-soft/40",
  "bg-cyan-soft/65",
  "bg-cyan-soft/90",
] as const;

const DAY_LABELS = ["Mon", "Wed", "Fri"] as const;

/**
 * Contribution calendar.
 *
 * Accessibility decision worth naming: the grid is exposed as a single
 * labelled image rather than as ~370 individually focusable cells. Making
 * every day tabbable would bury a keyboard user in a year of squares to get
 * past one decorative element; the summary label carries the actual
 * information.
 *
 * Hover feeds one shared readout above the grid instead of mounting a tooltip
 * per cell — same information, one element instead of hundreds.
 */
export function ContributionHeatmap({
  calendar,
}: {
  calendar: ContributionCalendar;
}) {
  const [hovered, setHovered] = useState<{
    date: string;
    count: number;
  } | null>(null);

  const readout = hovered
    ? `${hovered.count} ${hovered.count === 1 ? "contribution" : "contributions"} · ${new Date(
        hovered.date,
      ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`
    : `${calendar.total.toLocaleString()} contributions in the last year`;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p
          data-numeric
          className="font-mono text-[0.6875rem] tracking-[0.04em] text-ink-secondary"
          role="status"
          aria-live="polite"
        >
          {readout}
        </p>

        <div className="flex items-center gap-2">
          <span className="label-mono">Less</span>
          <div className="flex gap-1">
            {LEVEL_CLASS.map((cls, i) => (
              <span
                key={i}
                aria-hidden
                className={cn("size-2.5 rounded-[2px]", cls)}
              />
            ))}
          </div>
          <span className="label-mono">More</span>
        </div>
      </div>

      <div
        className="-mx-gutter mt-6 overflow-x-auto px-gutter pb-2"
        onPointerLeave={() => setHovered(null)}
      >
        <div className="flex min-w-max gap-3">
          <div
            aria-hidden
            className="flex w-8 shrink-0 flex-col justify-between py-[calc(0.375rem)] font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-ink-faint"
          >
            {DAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div
            role="img"
            aria-label={`GitHub contribution calendar: ${calendar.total.toLocaleString()} contributions in the last year`}
            className="flex gap-[3px]"
          >
            {calendar.weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <span
                    key={day.date}
                    aria-hidden
                    onPointerEnter={() =>
                      setHovered({ date: day.date, count: day.count })
                    }
                    className={cn(
                      "size-[11px] rounded-[2px] transition-transform duration-200 hover:scale-[1.35]",
                      LEVEL_CLASS[day.level],
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
