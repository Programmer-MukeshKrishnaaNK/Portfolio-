import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import "./globals.css";

import { profile } from "@/content/profile";
import { Nav } from "@/components/chrome/nav";
import { Footer } from "@/components/chrome/footer";
import { Preloader } from "@/components/chrome/preloader";
import { CursorGlow } from "@/components/chrome/cursor-glow";
import { ScrollProgress } from "@/components/chrome/scroll-progress";
import { SmoothScroll } from "@/components/chrome/smooth-scroll";
import { HairlineGrid } from "@/components/primitives/layout";
import { TooltipProvider } from "@/components/ui/tooltip";

/* Geist carries the display voice, Inter the reading voice, Geist Mono the
   instrumentation. `display: swap` on all three: a blocking font is a blank
   screen, and this palette is legible in the fallback. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.fullName} — ${profile.role}`,
    template: `%s — ${profile.fullName}`,
  },
  description: profile.positioning,
  applicationName: `${profile.fullName} — Portfolio`,
  authors: [{ name: profile.fullName, url: profile.siteUrl }],
  creator: profile.fullName,
  keywords: [
    "product engineer",
    "design engineer",
    "Next.js",
    "TypeScript",
    "design systems",
    "interface engineering",
    profile.fullName,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    siteName: profile.fullName,
    title: `${profile.fullName} — ${profile.role}`,
    description: profile.positioning,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.fullName} — ${profile.role}`,
    description: profile.positioning,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  /* No maximum-scale and no user-scalable=no. Blocking zoom is the most
     common accessibility failure on sites that look like this one. */
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  alternateName: profile.name,
  jobTitle: profile.role,
  description: profile.positioning,
  email: `mailto:${profile.email}`,
  url: profile.siteUrl,
  sameAs: profile.socials
    .map((s) => s.href)
    .filter((href) => href.startsWith("http")),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      /* `dark` is permanent: this is a single-theme site, and the class keeps
         every shadcn primitive on the same token set as the rest of the page. */
      className={`dark ${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          /* Runs before first paint. On a repeat visit within the session it
             marks the document so CSS can drop the loading overlay with no
             flash — React would only be able to remove it a frame later. */
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('ql:booted')==='1'){document.documentElement.classList.add('booted')}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Safety net. Framer Motion serialises each element's `initial` state
            into the server-rendered HTML, which means a visitor whose
            JavaScript never runs would be left looking at content that is
            permanently at opacity 0. This restores the resting state for them.
            Costs nothing for everyone else — the browser drops it the moment
            scripting is available. */}
        <noscript>
          <style>{`#main *,header *{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh bg-ground text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <SmoothScroll>
          <TooltipProvider delayDuration={200}>
            <Preloader />
            <HairlineGrid />
            <CursorGlow />
            <ScrollProgress />
            <Nav />

            <main id="main" className="relative z-10">
              {children}
            </main>

            <Footer />
          </TooltipProvider>
        </SmoothScroll>

        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
