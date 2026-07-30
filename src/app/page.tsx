import { Suspense } from "react";

import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Philosophy } from "@/components/sections/philosophy";
import { Interlude } from "@/components/sections/interlude";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Process } from "@/components/sections/process";
import { WorkIndex } from "@/components/sections/work-index";
import { GitHub } from "@/components/sections/github";
import { GitHubSkeleton } from "@/components/sections/github/skeleton";
import { Technology } from "@/components/sections/technology";
import { Timeline } from "@/components/sections/timeline";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Philosophy />
      <Interlude />
      <FeaturedWork />
      <Process />
      <WorkIndex />

      {/* The only section that waits on the network. Suspended so a slow or
          rate-limited GitHub response streams in late instead of holding back
          the entire document. */}
      <Suspense fallback={<GitHubSkeleton />}>
        <GitHub />
      </Suspense>

      <Technology />
      <Timeline />
      <Contact />
    </>
  );
}
