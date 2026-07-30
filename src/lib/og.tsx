import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared Open Graph card.
 *
 * Deliberately typographic. A social card is rendered at thumbnail size in
 * most feeds, so a screenshot of a dark interface becomes an unreadable grey
 * rectangle — large type on near-black survives the downscale, which is the
 * only requirement that actually matters here.
 *
 * No web fonts are loaded: fetching Geist at render time adds a network
 * dependency to an image that must never fail, and the system sans is close
 * enough at this scale to be worth the reliability.
 */
export function renderOgCard({
  eyebrow,
  title,
  subtitle,
  accent = "#6ee7f0",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Single soft light source, matching the site's hero. */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${accent}22 0%, transparent 62%)`,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: accent,
            }}
          />
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8f8f99",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: title.length > 28 ? 76 : 96,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: "#ffffff",
              maxWidth: 960,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.4,
              color: "#b4b4bd",
              maxWidth: 820,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: 28,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#7c7c86",
          }}
        >
          <div style={{ display: "flex" }}>Product Engineer</div>
          <div style={{ display: "flex" }}>Portfolio</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
