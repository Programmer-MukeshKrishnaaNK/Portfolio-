import type { ProjectAccent } from "@/types";

/**
 * Accent lookup.
 *
 * Centralised because the palette rule — violet belongs to the flagship,
 * cyan to live/system state, neutral to everything else — only holds if
 * there is exactly one place that maps a project to a colour. Scatter these
 * class strings across components and the discipline lasts about a week.
 */
export const accent: Record<
  ProjectAccent,
  { text: string; dot: string; ring: string; spotlight: "cyan" | "violet" | "neutral" }
> = {
  violet: {
    text: "text-violet-soft",
    dot: "bg-violet-soft",
    ring: "group-hover/card:ring-violet-soft/25",
    spotlight: "violet",
  },
  cyan: {
    text: "text-cyan-soft",
    dot: "bg-cyan-soft",
    ring: "group-hover/card:ring-cyan-soft/25",
    spotlight: "cyan",
  },
  neutral: {
    text: "text-ink-secondary",
    dot: "bg-ink-muted",
    ring: "group-hover/card:ring-white/20",
    spotlight: "neutral",
  },
};
