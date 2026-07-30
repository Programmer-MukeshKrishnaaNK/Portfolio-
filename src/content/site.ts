import type {
  PhilosophyEntry,
  ProcessStage,
  StackGroup,
  TimelineEntry,
} from "@/types";

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const about = {
  eyebrow: "Index",
  heading: "I design the system, then I build it.",
  body: [
    "Most of what separates a product that feels considered from one that doesn't happens before anything is visible. It is in the shape of the data, the states nobody demoed, the decision to make one interaction slower so another can be instant. I do that work and then I write the code, because handing a specification across a boundary loses precisely the details that were the point.",
    "I am a student, and I build with AI in the loop — which changes how fast a version appears, and nothing at all about whether it was the right one. The judgement is still the job: what to build, what the data should look like, which trade-off to accept, and which of the three plausible answers is actually correct under load. What I care about is the part of a product that only shows up under use — the fourth hour of a session, the second concurrent user, the network that drops mid-request. Anyone can build the happy path. The interesting engineering is in everything the happy path is standing on.",
  ],
  /** Small factual asides rendered as a mono list beside the portrait. */
  facts: [
    { key: "Focus", value: "Product engineering, end to end" },
    { key: "Depth", value: "Design systems, streaming interfaces, motion" },
    { key: "Method", value: "Systems first, vertical slices, honest trade-offs" },
    { key: "Tooling", value: "AI-assisted, judgement-led" },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Philosophy                                                                 */
/* -------------------------------------------------------------------------- */

export const philosophy: PhilosophyEntry[] = [
  {
    index: "01",
    title: "Every state gets designed, not just the good one",
    body: "Empty, loading, partial, errored, offline, rate-limited, and too-much-data are all states a product spends real time in. The happy path is the easiest fifth of the work and the only fifth most products finish. A spinner is what you ship when you decided not to design the wait.",
  },
  {
    index: "02",
    title: "A decision without a cost was a default",
    body: "If a choice had no trade-off, nothing was actually chosen. I write down what each one cost — the latency added, the flexibility lost, the maintenance taken on — because a rationale with the price removed is just marketing with better vocabulary.",
  },
  {
    index: "03",
    title: "Systems before screens",
    body: "A screen is one snapshot of a system in one state. Build the system — the tokens, the data shapes, the state machine — and the screens come out consistent for free. Build the screens first and you spend the rest of the project reconciling them with each other.",
  },
  {
    index: "04",
    title: "Speed is not uniformly a virtue",
    body: "Some interactions should be instantaneous and some should take a beat. Confirming a destructive action should feel weightier than dismissing a toast. Deciding which is which is design work, and defaulting everything to fast is a way of avoiding it.",
  },
  {
    index: "05",
    title: "Iteration is not indecision",
    body: "Thirteen versions is not a failure to plan. It is what happens when you keep a product open long enough to meet the bugs that only exist after hour two — the drifted timer, the leaked listener, the cache that was confidently wrong. Those versions are the work, not the overhead.",
  },
  {
    index: "06",
    title: "AI moves the bottleneck, it does not remove it",
    body: "Building with a model in the loop makes the first version arrive faster, and makes taste the scarce resource rather than typing. The questions that decide whether a product is good are unchanged: what the data should look like, which state was never designed, which trade-off is worth its cost. I use the speed to try three approaches and throw two away — not to ship the first thing that compiled.",
  },
];

/* -------------------------------------------------------------------------- */
/* Engineering process                                                        */
/* -------------------------------------------------------------------------- */

export const process: ProcessStage[] = [
  {
    index: "01",
    name: "Interrogate",
    duration: "Before anything is drawn",
    body: "Write the problem in one paragraph without naming a solution. Then write the non-goals, which are harder and more useful. Most of what a product should not do is decided here, by default, if it isn't decided here on purpose.",
    artefacts: ["Problem statement", "Non-goals", "Failure inventory"],
  },
  {
    index: "02",
    name: "Model",
    duration: "Data before pixels",
    body: "Define the types and the state machine first. If the data shape is wrong, no amount of interface work rescues it — and if the state machine is complete, most of the interface becomes a rendering problem rather than a design problem.",
    artefacts: ["Type definitions", "State chart", "Architecture sketch"],
  },
  {
    index: "03",
    name: "Compose",
    duration: "One system, one slice",
    body: "Tokens, primitives, and exactly one screen built end to end. A vertical slice surfaces every integration problem in the first week, which is when they are cheap. Building horizontally — all the components, then all the screens — hides them until the last one.",
    artefacts: ["Token layer", "Primitives", "Vertical slice"],
  },
  {
    index: "04",
    name: "Build",
    duration: "Slice by slice",
    body: "Each subsequent slice ships complete: happy path, failure states, keyboard access, and motion together. Nothing goes on a list to be added later, because the list is where accessibility and error handling go to die.",
    artefacts: ["Feature slices", "State coverage", "Motion pass"],
  },
  {
    index: "05",
    name: "Harden",
    duration: "The unglamorous week",
    body: "Frame budgets measured rather than assumed, layout shift driven to zero, every interactive element reached by keyboard, reduced-motion verified as a real path rather than a switch that removes content.",
    artefacts: ["Perf budget", "A11y audit", "Reduced-motion path"],
  },
  {
    index: "06",
    name: "Iterate",
    duration: "After it is live",
    body: "Use it for long enough to find the failures that only appear under duration — the drift, the leak, the stale cache. Then fix them and record what the fix cost. This is the stage most projects skip and the one that produces everything worth writing about.",
    artefacts: ["Duration testing", "Decision records", "Version history"],
  },
];

/* -------------------------------------------------------------------------- */
/* Technology                                                                 */
/* -------------------------------------------------------------------------- */

export const stack: StackGroup[] = [
  {
    name: "Interface",
    note: "Composition, state, and the type layer that keeps them honest.",
    items: [
      { name: "TypeScript", role: "Strict, no escape hatches" },
      { name: "React", role: "Server and client boundaries" },
      { name: "Next.js", role: "App Router, streaming, server actions" },
      { name: "Tailwind CSS", role: "Token-driven, v4 CSS-first" },
      { name: "Radix", role: "Accessible primitives" },
    ],
  },
  {
    name: "Motion",
    note: "Transform, opacity, and filter only. Nothing that touches layout.",
    items: [
      { name: "Framer Motion", role: "Spring physics, shared layout" },
      { name: "Lenis", role: "Scroll normalisation" },
      { name: "Canvas 2D", role: "Real-time visualisation" },
      { name: "Web Audio", role: "Analysis and routing" },
    ],
  },
  {
    name: "Runtime",
    note: "Where the work actually happens, and what it is trusted with.",
    items: [
      { name: "Node", role: "Services and tooling" },
      { name: "Edge runtime", role: "Streaming response paths" },
      { name: "Postgres", role: "Transactional inventory" },
      { name: "IndexedDB", role: "Local durability" },
    ],
  },
  {
    name: "Intelligence",
    note: "Model output treated as untrusted input with a schema on it.",
    items: [
      { name: "Google Gemini", role: "Streaming, structured output" },
      { name: "Response schemas", role: "Typed model boundaries" },
      { name: "Context ladders", role: "Flat cost over long sessions" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Timeline                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Anchored to shipped work rather than biography — add education or role
 * entries here in the same shape and they slot into the rail automatically.
 */
export const timeline: TimelineEntry[] = [
  {
    period: "2024",
    title: "AURUM — a booking flow with a voice",
    body: "Inverted a restaurant booking flow from availability grid to intent-first proposals, and carried one visual system — black, gold, and a high-contrast serif — from the landing page through to confirmation. First project where the brand and the engineering were the same decision.",
    tags: ["Product design", "Server actions", "Brand system"],
  },
  {
    period: "Early 2025",
    title: "Ether Lofi — thirteen versions",
    body: "A focus workspace that took thirteen versions because nine of its failures only appeared after the app had been open for hours. Learned to test for duration, and to distrust any timer that counts its own ticks.",
    tags: ["Web Audio", "Canvas", "Debugging"],
  },
  {
    period: "2025",
    title: "The Midnight Library",
    body: "Built a reading environment where the model is a resident rather than a feature — warm lamplight instead of the obvious dark theme, a bring-your-own-key model that removed accounts and quotas entirely, and a designed wait in place of a spinner.",
    tags: ["Gemini", "Streaming", "Prompt architecture"],
  },
  {
    period: "Now",
    title: "Studying, and shipping alongside it",
    body: "Building products where the engineering decisions are worth writing down, and writing them down. Open to product engineering work that treats design and implementation as one job.",
    tags: ["Available"],
  },
];

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const contact = {
  eyebrow: "Contact",
  heading: "Let's build something worth documenting.",
  body: "If you are working on a product where the design and the engineering are the same problem, I'd like to hear about it. Fastest route is email — I read everything and reply to anything specific.",
} as const;
