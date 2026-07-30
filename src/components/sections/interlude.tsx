import { portraits } from "@/content/profile";
import { Container } from "@/components/primitives/layout";
import { Reveal } from "@/components/primitives/reveal";
import { EditorialImage } from "@/components/primitives/editorial-image";

/**
 * A full-bleed pause between the argument and the evidence.
 *
 * The image runs to the viewport edges but keeps its native aspect ratio —
 * forcing a landscape portrait into a tall viewport-height band would crop
 * straight through the subject, which is exactly the failure the brief was
 * written to avoid. Bleeding horizontally and letting the height fall out of
 * the ratio gives the cinematic width without touching the framing.
 */
export function Interlude() {
  return (
    <section aria-label="Portrait" className="relative py-stack">
      <div className="px-gutter">
        <EditorialImage
          src={portraits.forest.src}
          alt={portraits.forest.alt}
          ratio={portraits.forest.ratio}
          sizes="100vw"
          parallax={110}
          className="mx-auto w-full max-w-[110rem]"
        />
      </div>

      <Container>
        <Reveal className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
          <p className="label-mono">Off the clock</p>
          <p className="max-w-[46ch] text-sm leading-relaxed text-ink-muted">
            The habit that transfers: noticing what is actually in front of you
            rather than what you expected to be there. It is the same skill
            that finds the bug on hour four.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
