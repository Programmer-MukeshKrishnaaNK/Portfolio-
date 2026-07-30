import type { NavItem } from "@/types";

/**
 * Identity. Single source of truth for the whole site — name, contact,
 * social links, metadata, structured data, sitemap, and OG cards all read
 * from here.
 */
export const profile = {
  name: "Mukesh",
  fullName: "Mukesh Krishnaa NK",
  githubUser: "Programmer-MukeshKrishnaaNK",
  githubUrl: "https://github.com/Programmer-MukeshKrishnaaNK",
  email: "mindsofmukesh@gmail.com",

  /**
   * Canonical origin, used for absolute URLs in metadata, OG tags, and the
   * sitemap. Update this the moment the site has a real domain — it is the
   * only value here that cannot be derived from anything else.
   */
  siteUrl: "https://mukeshkrishnaa.vercel.app",

  role: "Product Engineer",
  /** The three-part positioning, shown wherever there is room for it. */
  roles: ["Student", "Product Engineer", "AI-Assisted Builder"],

  /** The one line that has to do the most work on the site. */
  positioning:
    "I build software the way other people build instruments — the mechanism matters as much as the sound it makes.",

  location: "India",
  availability: "Open to product engineering work",
  /** Used where the line has to survive a 375px column without orphaning. */
  availabilityShort: "Open to new work",

  /**
   * Every outbound identity, in one list.
   *
   * The footer, the contact section, and the `sameAs` array in the Person
   * structured data all read from here, so adding a profile in one place
   * publishes it everywhere — including to search engines, which use
   * `sameAs` to reconcile these accounts with the person.
   *
   * Ordered by how much of the work each one actually shows.
   */
  socials: [
    { label: "GitHub", href: "https://github.com/Programmer-MukeshKrishnaaNK" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mukesh-krishnaa-nk-44488b371/",
    },
    { label: "X", href: "https://x.com/thelifeofmukesh" },
    { label: "Instagram", href: "https://www.instagram.com/thelifeof_mukesh/" },
    { label: "Email", href: "mailto:mindsofmukesh@gmail.com" },
  ],
} as const;

/**
 * Portrait registry.
 *
 * Ratios are the files' true pixel dimensions, declared here so every layout
 * reserves exact space before the image decodes — the single largest source
 * of layout shift on an image-led page.
 */
export const portraits = {
  forest: {
    src: "/portraits/forest.jpg",
    alt: `${profile.fullName} photographed among conifers, black and white`,
    /** width / height */
    ratio: 992 / 664,
  },
  interior: {
    src: "/portraits/interior.jpg",
    alt: `${profile.fullName} seated in an interior, black and white`,
    ratio: 1496 / 848,
  },
  /**
   * The primary profile photograph.
   *
   * Source is a 4000×2252 landscape frame. It is pre-cropped to this exact
   * ratio at build-prep time rather than being letterboxed or re-cropped by
   * CSS, so the slot geometry — and therefore the surrounding layout — is
   * byte-for-byte what it was before the swap. The crop is centred on the
   * subject, not on the frame, because a plain centre crop clipped him.
   */
  main: {
    src: "/portraits/main.jpg",
    alt: `Portrait of ${profile.fullName} in the mountains, black and white`,
    ratio: 460 / 500,
  },
} as const;

export const nav: NavItem[] = [
  { label: "Index", href: "/#index", id: "index" },
  { label: "Work", href: "/#work", id: "work" },
  { label: "Process", href: "/#process", id: "process" },
  { label: "Stack", href: "/#stack", id: "stack" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

/**
 * The initialization sequence for the loading experience. Written to read as
 * a real boot log rather than as fake progress — each line names something
 * the page genuinely does before it is interactive.
 */
export const bootSequence = [
  "resolving design tokens",
  "mounting scroll engine",
  "decoding portraits",
  "linking case studies",
  "ready",
] as const;
