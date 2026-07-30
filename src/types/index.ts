/**
 * Content models.
 *
 * Every string that appears on this site originates in `src/content` and is
 * shaped by a type in this file. Components receive data, never literals, so
 * copy can be rewritten without opening a single component — and a typo in a
 * project's shape fails at build time rather than in production.
 */

export type ProjectSlug =
  | "midnight-library"
  | "ether-lofi"
  | "smart-reservation";

/** Which accent a project claims. Violet is reserved for the flagship. */
export type ProjectAccent = "violet" | "cyan" | "neutral";

export interface Metric {
  value: string;
  label: string;
  /** Optional qualifier — how the number was arrived at, if it needs one. */
  note?: string;
}

/**
 * An architecture decision record, compressed. The `tradeoff` field is not
 * optional on purpose: a decision presented without its cost is marketing.
 */
export interface Decision {
  id: string;
  title: string;
  context: string;
  decision: string;
  tradeoff: string;
}

export type ArchNodeKind =
  | "client"
  | "route"
  | "service"
  | "model"
  | "store"
  | "external";

export interface ArchNode {
  id: string;
  label: string;
  kind: ArchNodeKind;
  detail: string;
  /** Column/row position in the diagram lattice. */
  col: number;
  row: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  /** Streaming edges render as a moving dash; request edges are static. */
  stream?: boolean;
}

export interface ArchDiagram {
  title: string;
  caption: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

/** One rung of an iteration ladder — the honest version history. */
export interface Iteration {
  range: string;
  title: string;
  body: string;
  /** Marks the rungs where something actually broke. */
  failure?: boolean;
}

export interface ProjectChapter {
  index: string;
  title: string;
  body: string[];
}

export interface Project {
  slug: ProjectSlug;
  /** Display order in the featured list. 1 is the flagship. */
  rank: number;
  name: string;
  /** Sits under the name everywhere the project is referenced. */
  tagline: string;
  year: string;
  role: string;
  accent: ProjectAccent;
  /** One line for the teaser. Must survive being read on its own. */
  teaser: string;
  stack: string[];
  links?: { live?: string; repo?: string };

  problem: string;
  solution: string;
  metrics: Metric[];

  chapters: ProjectChapter[];
  decisions: Decision[];
  architecture?: ArchDiagram;
  iterations?: Iteration[];
  impact: string[];

  /** Editorial imagery. Paths resolve under /public. */
  cover: { src: string; alt: string; ratio: number };
  shots: { src: string; alt: string; caption: string; ratio: number }[];
}

export interface PhilosophyEntry {
  index: string;
  title: string;
  body: string;
}

export interface ProcessStage {
  index: string;
  name: string;
  duration: string;
  body: string;
  artefacts: string[];
}

export interface StackGroup {
  name: string;
  note: string;
  items: { name: string; role: string }[];
}

export interface TimelineEntry {
  period: string;
  title: string;
  body: string;
  tags: string[];
}

export interface NavItem {
  label: string;
  href: string;
  /** Section id for scroll-spy on the home page. */
  id?: string;
}

/* -------------------------------------------------------------------------- */
/* GitHub                                                                     */
/* -------------------------------------------------------------------------- */

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  /** GitHub's own 0–4 intensity bucket. */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  total: number;
  weeks: ContributionDay[][];
}

export interface LanguageShare {
  name: string;
  /** Percentage of tracked bytes, 0–100. */
  share: number;
}

export interface GitHubSnapshot {
  login: string;
  repos: Repo[];
  calendar: ContributionCalendar | null;
  languages: LanguageShare[];
  totals: { repos: number; stars: number; followers: number };
  /** True when the live API answered; false when the typed fallback is in use. */
  live: boolean;
}
