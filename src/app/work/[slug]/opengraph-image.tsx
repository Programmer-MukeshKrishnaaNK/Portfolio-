import { getProject, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const ACCENT_HEX = {
  violet: "#a78bfa",
  cyan: "#6ee7f0",
  neutral: "#b4b4bd",
} as const;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return renderOgCard({
      eyebrow: profile.fullName,
      title: "Selected work",
      subtitle: profile.positioning,
    });
  }

  return renderOgCard({
    eyebrow: `${project.year} · Case study`,
    title: project.name,
    subtitle: project.tagline,
    accent: ACCENT_HEX[project.accent],
  });
}
