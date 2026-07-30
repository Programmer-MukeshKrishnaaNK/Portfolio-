import { profile } from "@/content/profile";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = `${profile.fullName} — ${profile.role}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgCard({
    eyebrow: profile.fullName,
    title: "Craft is what survives the fourth hour.",
    subtitle: profile.positioning,
  });
}
