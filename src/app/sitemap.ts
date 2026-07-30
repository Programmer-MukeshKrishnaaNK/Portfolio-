import type { MetadataRoute } from "next";

import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: profile.siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${profile.siteUrl}/work/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      /* The flagship outranks the other two, matching how the site itself
         weights them. */
      priority: project.rank === 1 ? 0.9 : 0.7,
    })),
  ];
}
