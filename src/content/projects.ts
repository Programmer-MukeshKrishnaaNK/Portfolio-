import type { Project, ProjectSlug } from "@/types";

/**
 * The three case studies.
 *
 * Written as problem → solution → architecture → decisions → impact. No
 * feature lists: a feature list tells you what was built, and the only
 * interesting question is why it was built that way and what it cost.
 *
 * Cover and detail images are real captures of the deployed products, not
 * mockups.
 */

const midnightLibrary: Project = {
  slug: "midnight-library",
  rank: 1,
  name: "The Midnight Library",
  tagline: "A reading sanctuary with a resident librarian",
  year: "2025",
  role: "Product design, architecture, implementation",
  accent: "violet",
  teaser:
    "A reading environment built around attention rather than throughput, with a Gemini-backed librarian that has read the room.",
  stack: [
    "Next.js",
    "TypeScript",
    "Google Gemini",
    "Streaming",
    "Tailwind",
    "Netlify",
  ],
  links: {
    live: "https://the-midnight-library.netlify.app/",
    repo: "https://github.com/Programmer-MukeshKrishnaaNK/The-Midnight-Library",
  },

  problem:
    "Reading software optimises for the things it can count. Streaks, pages per day, highlights saved — metrics that measure consumption and quietly reshape reading into a productivity exercise. The recent answer to this has been to bolt a chat panel onto the side of the page, which produces something worse: a text box that is fast, generic, and fundamentally hostile to sustained attention. You stop reading in order to use it.",

  solution:
    "The Midnight Library treats the reading surface as the entire product and the model as a resident rather than a feature. There is one column, one light source, and no chrome that isn't load-bearing. The librarian holds continuity across a session — what you have read, what you asked forty minutes ago, which threads you left open — and answers in the register of a person who has been in the room the whole time. Slowness is a design position here, not a performance failure: a reading environment that flickers is a reading environment you leave.",

  metrics: [
    {
      value: "BYOK",
      label: "Access model",
      note: "Readers open the doors with their own Gemini key",
    },
    {
      value: "0",
      label: "Shared secrets",
      note: "No pooled key to leak, meter, or ration",
    },
    { value: "1", label: "Reading column", note: "No chrome that isn't load-bearing" },
    {
      value: "3",
      label: "Designed wait states",
      note: "Skeleton, atmosphere, content — never a spinner",
    },
  ],

  chapters: [
    {
      index: "01",
      title: "Warm light, not darkness",
      body: [
        "The obvious reading of the name is a dark interface, and that was the first thing to go. A library at midnight is not a dark room — it is a warm one, lit low, with everything outside it dark. The product is parchment and lamplight: a warm off-white ground, a bookish serif, and a single terracotta accent that appears only on the one control that matters.",
        "That choice made the rest of the type work straightforward. On a warm ground you can set long-form text at a genuinely comfortable measure without the halation that light-on-black produces at reading sizes, which is the specific reason most 'dark reading apps' end up being used for skimming rather than reading.",
      ],
    },
    {
      index: "02",
      title: "The reader brings the key",
      body: [
        "The doors open with a passage key — the reader's own Gemini API key, entered on the threshold. That is a product decision before it is a technical one. A pooled key means a shared quota, a rationing scheme, an account system to enforce it, and one credential whose leak is everyone's problem.",
        "Handing that boundary to the reader removes all four at once. There is no signup, no usage tier, no per-seat cost, and nothing on the server worth stealing. What it costs is the hardest first thirty seconds in the product, which is why the gate is designed as a doorway rather than a form — it explains where the key comes from, in the same voice as everything behind it.",
      ],
    },
    {
      index: "03",
      title: "The librarian is a system, not a prompt",
      body: [
        "Treating the model as a single prompt string is what makes AI features feel interchangeable. Here the request is assembled by a composer that draws from separate sources — a versioned instruction file, a rolling synopsis of the session, the most recent turns verbatim, and the passage currently on screen — each in its own delimited block with its own trust level.",
        "That separation is what makes the behaviour debuggable. When an answer is wrong, the question is which block was wrong, and the answer is usually visible in one place rather than smeared across an unstructured prompt.",
      ],
    },
  ],

  architecture: {
    title: "Request path",
    caption:
      "The reader's key never leaves their session, and the passage never enters the instruction block — it is passed as delimited data with its own trust level.",
    nodes: [
      {
        id: "reader",
        label: "Reader Surface",
        kind: "client",
        detail: "Single column · warm ground",
        col: 0,
        row: 1,
      },
      {
        id: "renderer",
        label: "Stream Renderer",
        kind: "client",
        detail: "Sentence-buffered markdown",
        col: 0,
        row: 2,
      },
      {
        id: "gate",
        label: "Passage Key",
        kind: "store",
        detail: "Reader's own key, session-scoped",
        col: 1,
        row: 0,
      },
      {
        id: "route",
        label: "Librarian",
        kind: "route",
        detail: "Streaming request handler",
        col: 1,
        row: 1,
      },
      {
        id: "guard",
        label: "Input Guard",
        kind: "service",
        detail: "Passage delimited as untrusted",
        col: 2,
        row: 0,
      },
      {
        id: "composer",
        label: "Prompt Composer",
        kind: "service",
        detail: "Versioned instruction + blocks",
        col: 2,
        row: 1,
      },
      {
        id: "ladder",
        label: "Context Ladder",
        kind: "service",
        detail: "Recent verbatim · rest compressed",
        col: 2,
        row: 2,
      },
      {
        id: "gemini",
        label: "Gemini",
        kind: "model",
        detail: "Streaming · structured output",
        col: 3,
        row: 1,
      },
      {
        id: "store",
        label: "Session State",
        kind: "store",
        detail: "Synopsis + open threads",
        col: 3,
        row: 2,
      },
    ],
    edges: [
      { from: "gate", to: "route", label: "key" },
      { from: "reader", to: "route", label: "intent" },
      { from: "route", to: "guard", label: "passage" },
      { from: "guard", to: "composer" },
      { from: "ladder", to: "composer", label: "synopsis" },
      { from: "composer", to: "gemini" },
      { from: "gemini", to: "route", label: "tokens", stream: true },
      { from: "route", to: "renderer", label: "buffered", stream: true },
      { from: "renderer", to: "reader" },
      { from: "ladder", to: "store" },
    ],
  },

  decisions: [
    {
      id: "d1",
      title: "Let the reader bring their own key",
      context:
        "A shared API key turns every reader into a line item. It needs accounts to attribute usage, tiers to cap it, and a rotation plan for the day it leaks — none of which is the product.",
      decision:
        "The reader supplies their own Gemini key at the door. It is scoped to their session, and the application holds no pooled credential at all.",
      tradeoff:
        "The hardest thirty seconds of the product are now the first thirty, and anyone without a key bounces. That is a real conversion cost, accepted deliberately: it buys an application with no accounts, no quota logic, and nothing on the server worth stealing.",
    },
    {
      id: "d2",
      title: "Buffer the stream to sentence boundaries",
      context:
        "Raw token streaming reflows the paragraph on almost every frame. In a wide, bright dashboard that reads as speed. In a narrow reading column it reads as a fault — the text visibly stutters and re-wraps under the eye.",
      decision:
        "Tokens accumulate and flush at sentence boundaries, with a ceiling so a long sentence never stalls the surface.",
      tradeoff:
        "A little added latency per sentence, and the loss of the typewriter effect that makes a product look fast in a demo. Worth it: the reading surface stopped moving, which was the entire point.",
    },
    {
      id: "d3",
      title: "A summarisation ladder instead of a growing window",
      context:
        "A long session is the success case, and the naive approach — append every turn to the context — makes the success case the expensive one. Cost and latency both climb with engagement, which is precisely backwards.",
      decision:
        "The most recent turns are kept verbatim. Everything older is compressed into a running synopsis and cached, so the request size stops growing with the session.",
      tradeoff:
        "Detail from early in a long session degrades into summary, so a question about something said ninety minutes ago gets a good answer rather than an exact one.",
    },
    {
      id: "d4",
      title: "Passage text is data, never instruction",
      context:
        "The application feeds reader-supplied book text into a model prompt. Interpolated directly into the instruction block, a passage containing something shaped like a command becomes one.",
      decision:
        "Excerpts are passed in a delimited block explicitly marked untrusted, the instruction block is never string-interpolated with reader content, and anything driving the interface comes back in a constrained shape.",
      tradeoff:
        "The response shape is one more thing to version alongside the prompt, and a genuinely novel output requires a deploy rather than a prompt tweak.",
    },
  ],

  impact: [
    "No accounts, no quotas, and no pooled credential — the access model removed an entire tier of backend surface before it was ever built.",
    "The reading surface does not move during a response: no reflow, no layout shift, and no spinner anywhere in the product.",
    "Prompt behaviour is versioned in the repository and diffable, which turns 'the model got worse' from a hunch into something you can bisect.",
  ],

  cover: {
    src: "/work/midnight-library/cover.jpg",
    alt: "The Midnight Library entry screen: warm parchment ground, serif wordmark, and the passage key field",
    ratio: 1.6,
  },
  shots: [
    {
      src: "/work/midnight-library/mobile.jpg",
      alt: "The Midnight Library on a phone-width screen",
      caption:
        "The doorway at 390px. The measure narrows, the ornament drops away, and the one control that matters keeps its full width.",
      ratio: 0.4621,
    },
  ],
};

const etherLofi: Project = {
  slug: "ether-lofi",
  rank: 2,
  name: "Ether Lofi Experience",
  tagline: "A focus workspace that survives a four-hour session",
  year: "2025",
  role: "Product design, architecture, implementation",
  accent: "cyan",
  teaser:
    "Audio, timer, and scratchpad on one surface — because the tax on deep work is not starting, it is every context switch after.",
  stack: [
    "Next.js",
    "TypeScript",
    "Web Audio API",
    "Canvas",
    "IndexedDB",
    "Vercel",
  ],
  links: {
    live: "https://ether-lofi-experience-wheat.vercel.app/",
    repo: "https://github.com/Programmer-MukeshKrishnaaNK/ether-lofi-experience",
  },

  problem:
    "Focus tooling is fragmented in a way that undoes its own purpose. The timer lives in one tab, the music in another, the place you write things down in a third. Every switch between them costs re-entry, and the tools that are supposed to protect attention end up being the most reliable interruption in the session. Worse, most of them fail exactly when a session gets long: timers drift when the tab sleeps, audio dies on a locked phone, and notes live in memory until a refresh takes them.",

  solution:
    "Ether puts all three on one surface and then spends its engineering budget on the failure modes that only appear after hour two. The audio visualiser is a genuine readout of the signal rather than decoration, the timer reconciles against wall-clock time instead of trusting its own interval, and the scratchpad persists as you type. The interface is deliberately unremarkable to look at while working — it earns its keep by still being correct when you look up.",

  metrics: [
    { value: "13", label: "Versions to ship" },
    {
      value: "3",
      label: "Tools, one surface",
      note: "Audio, timer, and scratchpad — no second tab",
    },
    {
      value: "64",
      label: "Frequency bands",
      note: "Logarithmic, so the display tracks pitch",
    },
    {
      value: "0",
      label: "Context switches",
      note: "Nothing in the product opens somewhere else",
    },
  ],

  chapters: [
    {
      index: "01",
      title: "The entrance is part of the product",
      body: [
        "Ether opens on almost nothing: a wordmark, a single point of light, and silence. That is not a splash screen being precious. Browsers will not start audio without a genuine user gesture, so the product needs a deliberate first click no matter what — and given that the click is mandatory, it may as well be the moment the room goes quiet rather than a permission prompt bolted onto a dashboard.",
        "It also sets the contract for everything after it. Nothing in Ether demands attention, so the one time it asks for something is the threshold, and never again.",
      ],
    },
    {
      index: "02",
      title: "The visualiser had to be honest",
      body: [
        "A visualiser that ignores the audio is a screensaver, and people can tell within about ten seconds. An early version was technically reading the signal and still felt fake, because it binned frequencies linearly — which hands most of the screen width to a range that music barely occupies. The bars on the left thrashed and everything else sat dead.",
        "Remapping to a logarithmic scale fixed it and taught the more useful lesson: the visualiser was never a rendering problem. It was a signal-interpretation problem wearing a rendering problem's clothes.",
      ],
    },
    {
      index: "03",
      title: "Deep work is a state you protect, not a mode you enter",
      body: [
        "There is no focus mode in Ether, and that is deliberate. A mode implies a boundary you cross, which implies a decision, which is one more thing standing between you and the work.",
        "Instead the surface simply never demands attention. Nothing animates unless you are looking at it, nothing notifies, and the only element that moves on its own is the timer you chose to start. The measure of success is that you forget the tool is running.",
      ],
    },
  ],

  architecture: {
    title: "Audio graph",
    caption:
      "Analysis taps off the gain node rather than sitting inline, so nothing in the visualiser path can colour or interrupt what you actually hear.",
    nodes: [
      {
        id: "source",
        label: "MediaElementSource",
        kind: "external",
        detail: "Resumed from user gesture",
        col: 0,
        row: 1,
      },
      {
        id: "gain",
        label: "GainNode",
        kind: "service",
        detail: "Perceptual, not linear",
        col: 1,
        row: 1,
      },
      {
        id: "dest",
        label: "Destination",
        kind: "external",
        detail: "Audible path",
        col: 2,
        row: 0,
      },
      {
        id: "analyser",
        label: "AnalyserNode",
        kind: "service",
        detail: "FFT · smoothed",
        col: 2,
        row: 2,
      },
      {
        id: "mapper",
        label: "Log Bin Mapper",
        kind: "service",
        detail: "64 bands, 20Hz–16kHz",
        col: 3,
        row: 2,
      },
      {
        id: "painter",
        label: "Canvas Painter",
        kind: "client",
        detail: "rAF · offscreen buffer",
        col: 4,
        row: 2,
      },
    ],
    edges: [
      { from: "source", to: "gain" },
      { from: "gain", to: "dest", label: "audible" },
      { from: "gain", to: "analyser", label: "tap" },
      { from: "analyser", to: "mapper", stream: true },
      { from: "mapper", to: "painter", stream: true },
    ],
  },

  iterations: [
    {
      range: "v1–v3",
      title: "Layout, and the discovery that it was the easy part",
      body: "Three passes to land the single-surface composition. It looked finished and was nowhere near it — every remaining version went on things that only appear once the app has been open for an hour.",
    },
    {
      range: "v4",
      title: "Audio dead on iOS",
      body: "Worked everywhere except a real iPhone, which is the only place it needed to work. Mobile Safari starts the AudioContext suspended and will only resume it inside a genuine user gesture — a resume call in an effect, or one deferred behind an await, is silently ignored. The fix was moving resume into the synchronous path of the play handler.",
      failure: true,
    },
    {
      range: "v5–v7",
      title: "The visualiser ate the frame budget",
      body: "Analysis and painting ran in the same animation frame, and reading frequency data every frame at a large FFT size pushed frames past their budget whenever anything else was happening. Typing in the scratchpad made the bars stutter, which is a damning thing for a focus tool.",
      failure: true,
    },
    {
      range: "v8",
      title: "Split analysis from painting",
      body: "Smaller FFT, analysis decoupled from the paint loop, and the bar geometry precomputed into an offscreen buffer that only redraws on resize. Frame cost dropped and stayed down.",
    },
    {
      range: "v9–v11",
      title: "The timer lied",
      body: "Interval callbacks are throttled hard in a background tab and stop entirely when a phone locks. A 25-minute session reliably came back long — and the bug only reproduced if you actually left, which meant three versions of chasing it before the cause was obvious.",
      failure: true,
    },
    {
      range: "v12",
      title: "Reconcile against the clock, not the interval",
      body: "The timer stores a target timestamp and derives remaining time from the wall clock on every tick and on every visibility change. The interval became a repaint trigger with no authority over state. Drift went to zero.",
    },
    {
      range: "v13",
      title: "Persistence, then ship",
      body: "Scratchpad writes debounced to IndexedDB with the session restored on load, and every piece of state that mattered moved out of memory. Shipped.",
    },
  ],

  decisions: [
    {
      id: "d1",
      title: "Wall-clock reconciliation over interval counting",
      context:
        "Any timer that counts its own ticks is wrong the moment the browser throttles it, and browsers throttle aggressively in exactly the situation a focus timer is designed for — a tab you have left alone.",
      decision:
        "State holds a target timestamp. Remaining time is derived from the wall clock on each tick and recomputed when the tab becomes visible, so returning corrects instantly rather than resuming a stale count.",
      tradeoff:
        "A user who changes their system clock mid-session gets a discontinuity. Vanishingly rare, and preferable to a timer that is quietly wrong for everyone who switches tabs.",
    },
    {
      id: "d2",
      title: "Logarithmic frequency binning",
      context:
        "Linear FFT bins allocate screen space by frequency rather than by musical relevance, so most of the visualiser sits inert while a handful of low bins do all the moving.",
      decision:
        "64 bands mapped logarithmically across 20Hz to 16kHz, matching how pitch is actually perceived, with smoothing to stop per-frame strobing.",
      tradeoff:
        "Individual bands no longer correspond to a single FFT bin, so the display is not usable as a measurement instrument. It was never meant to be one — it needs to be true, not precise.",
    },
    {
      id: "d3",
      title: "Precompute geometry into an offscreen buffer",
      context:
        "Recomputing bar positions, rounding, and gradients on every animation frame is a large amount of arithmetic to arrive at the same numbers sixty times a second.",
      decision:
        "Static geometry renders once into an offscreen canvas and is only invalidated on resize. The per-frame loop does nothing but read amplitudes and draw.",
      tradeoff:
        "Two canvases to keep in sync and a resize path that has to be correct — bounded complexity, in exchange for most of the frame budget back.",
    },
  ],

  impact: [
    "Long sessions end with the timer accurate and the scratchpad intact — the two things that broke in every earlier version.",
    "Analysis no longer competes with the interface for the same frame, so typing and audio stopped fighting each other.",
    "Thirteen versions is the honest number. Nine of them existed because something only failed after the app had been open long enough to matter.",
  ],

  cover: {
    src: "/work/ether-lofi/cover.jpg",
    alt: "The Ether entry screen: a serif wordmark and a single point of light on near-black",
    ratio: 1.6,
  },
  shots: [
    {
      src: "/work/ether-lofi/mobile.jpg",
      alt: "Ether on a phone-width screen",
      caption:
        "The threshold at 390px. The gesture that starts the audio is the same one that starts the session.",
      ratio: 0.4621,
    },
  ],
};

const smartReservation: Project = {
  slug: "smart-reservation",
  rank: 3,
  name: "Smart Restaurant Reservation",
  tagline: "AURUM — booking designed around the diner's decision",
  year: "2024",
  role: "Product design, brand system, implementation",
  accent: "neutral",
  teaser:
    "Most booking interfaces render the restaurant's database. This one renders the diner's question and answers it, without ever leaving the restaurant's world.",
  stack: ["Next.js", "TypeScript", "Tailwind", "Server Actions", "Vercel"],
  links: {
    live: "https://smart-restaurant-reservation-websit.vercel.app/",
    repo: "https://github.com/Programmer-MukeshKrishnaaNK/Smart-Restaurant-Reservation-Website-System",
  },

  problem:
    "Restaurant booking interfaces are, almost without exception, a direct rendering of the restaurant's availability table: a grid of times, greyed out where the tables are gone. That hands the diner a constraint-satisfaction problem — reconcile party size, a rough window, and a wall of half-hour slots — at the exact moment they simply want to know whether Friday is possible. It is also where a considered restaurant loses the thread: a room with a real identity ends the customer journey in a generic grey time-picker.",

  solution:
    "AURUM is a fine-dining room in Madurai, and the site is built as the room's own voice rather than a booking vendor's. The flow is inverted: the diner states intent — how many, roughly when — and the system proposes specific times with a reason attached to each. Availability arithmetic happens on the server where it belongs, so the interface only ever shows options that will actually succeed. The identity holds all the way to the confirmation screen: an editorial serif at display sizes, deep black and gold, and photography that carries the food rather than decorating around it.",

  metrics: [
    { value: "3", label: "Steps to a confirmed table" },
    {
      value: "1",
      label: "Visual system",
      note: "Landing page through to confirmation",
    },
    { value: "375→2560", label: "Verified viewport range" },
    {
      value: "0",
      label: "Dead-end selections",
      note: "Proposals are backed by live inventory",
    },
  ],

  chapters: [
    {
      index: "01",
      title: "Propose, don't enumerate",
      body: [
        "A grid of thirty time slots is not a choice, it is a search. Replacing it with two or three proposals — each carrying a short reason, such as the quieter end of service or the last table before the kitchen changes over — turns the interaction back into a decision a person can make in a second.",
        "It also removes an entire class of failure. Because proposals are generated from live inventory with a hold already staged, there is no such thing as picking a slot and being told it has gone.",
      ],
    },
    {
      index: "02",
      title: "The brand has to survive the transaction",
      body: [
        "Identity work usually stops at the marketing page and hands off to a booking widget that looks like every other booking widget. The last screen a diner sees before committing is the one most likely to be generic, which is exactly backwards.",
        "AURUM sets its display type in a high-contrast serif at sizes that would be reckless anywhere else, and earns them with a near-black ground and a single gold accent. The type scale, the photographic treatment, and the spacing rhythm are the same object from the first view through to the confirmation — nothing changes register when money and intent enter the conversation.",
      ],
    },
  ],

  architecture: {
    title: "Reservation flow",
    caption:
      "The hold is staged before proposals are shown, which is what makes a proposed time a promise rather than a guess.",
    nodes: [
      { id: "diner", label: "Diner", kind: "client", detail: "Intent: party + window", col: 0, row: 1 },
      { id: "intake", label: "Intent Intake", kind: "route", detail: "Server action", col: 1, row: 1 },
      { id: "solver", label: "Availability Solver", kind: "service", detail: "Turn times + pacing rules", col: 2, row: 1 },
      { id: "tables", label: "Table Inventory", kind: "store", detail: "Row-level locks", col: 3, row: 1 },
      { id: "hold", label: "Hold", kind: "service", detail: "Staged before display", col: 2, row: 2 },
      { id: "confirm", label: "Confirm + Notify", kind: "route", detail: "Transactional commit", col: 3, row: 2 },
    ],
    edges: [
      { from: "diner", to: "intake", label: "intent" },
      { from: "intake", to: "solver" },
      { from: "solver", to: "tables", label: "query" },
      { from: "solver", to: "hold" },
      { from: "hold", to: "diner", label: "proposals" },
      { from: "diner", to: "confirm", label: "accept" },
      { from: "confirm", to: "tables", label: "commit" },
    ],
  },

  decisions: [
    {
      id: "d1",
      title: "Stage the hold before showing proposals",
      context:
        "Two diners looking at the same Friday will be offered the same table. Whoever confirms second gets an error on the last screen of the flow — the most expensive possible place to fail.",
      decision:
        "A short-lived hold is placed on each proposed slot at the moment it is displayed, released automatically on expiry or when a different proposal is accepted.",
      tradeoff:
        "Inventory is briefly held for people who will not book, which suppresses apparent availability during peak browsing. Correct trade: a slightly conservative view of Friday costs far less than a failed confirmation.",
    },
    {
      id: "d2",
      title: "Server-side availability, no client mirror",
      context:
        "Caching availability on the client makes the interface faster and makes it lie, because table state changes underneath a cache that has no way to know.",
      decision:
        "Availability is computed on the server per request. The client holds no inventory state and renders only what it was handed.",
      tradeoff:
        "A round trip on every refinement instead of instant local filtering. Mitigated with optimistic pending states — and an interface that is briefly slower is strictly better than one that is confidently wrong.",
    },
    {
      id: "d3",
      title: "Display serif at sizes that need a dark ground",
      context:
        "A high-contrast serif set large is the fastest way to make a restaurant feel expensive, and the fastest way to make it feel cheap if the hairlines break up.",
      decision:
        "Near-black ground, a single gold accent reserved for the primary action, and display sizes only where the line can be set without hyphenation.",
      tradeoff:
        "The palette leaves almost no room for a second accent colour, so every subsequent state — errors, disabled, confirmation — had to be solved with weight and spacing instead of hue.",
    },
  ],

  impact: [
    "A confirmed table in three steps, with no path through the flow that ends in an unavailable slot.",
    "One visual system from first view to confirmation — the identity no longer stops at the booking screen.",
    "Verified from 375px to 2560px, with the proposal layout reflowing rather than scaling down.",
  ],

  cover: {
    src: "/work/smart-reservation/cover.jpg",
    alt: "AURUM homepage: black and gold fine-dining identity with the reservation call to action",
    ratio: 1.6,
  },
  shots: [
    {
      src: "/work/smart-reservation/mobile.jpg",
      alt: "AURUM on a phone-width screen",
      caption:
        "390px. The display serif holds its scale, the navigation collapses, and the primary action stays a full-width target.",
      ratio: 0.4621,
    },
  ],
};

export const projects: Project[] = [midnightLibrary, etherLofi, smartReservation];

export const projectsBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
) as Record<ProjectSlug, Project>;

export function getProject(slug: string): Project | undefined {
  return projectsBySlug[slug as ProjectSlug];
}

/** Next project in rank order, wrapping — powers the case-study footer. */
export function getNextProject(slug: ProjectSlug): Project {
  const ordered = [...projects].sort((a, b) => a.rank - b.rank);
  const i = ordered.findIndex((p) => p.slug === slug);
  return ordered[(i + 1) % ordered.length];
}
