"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { profile } from "@/content/profile";
import { easeOutQuiet } from "@/lib/motion";
import { Container } from "@/components/primitives/layout";
import { TextReveal } from "@/components/primitives/text-reveal";
import { MagneticCta } from "@/components/primitives/links";
import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * The hero is type and light, and nothing else.
 *
 * A portrait here would be the expected move and would spend the site's most
 * valuable space on the least specific claim. The photographs get full
 * editorial treatment further down, where there is room for them to breathe.
 * What the first screen has to do is state a position.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  /* Perspective. Kept to ±1.4° — enough that the type feels like it occupies
     space, far too little to read as a tilt effect. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-1.4, 1.4]), {
    stiffness: 60,
    damping: 20,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [1.4, -1.4]), {
    stiffness: 60,
    damping: 20,
  });

  /* The hero recedes slightly as the next section arrives, so the two are
     never both competing for attention at the same depth. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useEffect(() => {
    if (!fine || reduced) return;

    function onMove(event: PointerEvent) {
      px.set(event.clientX / window.innerWidth - 0.5);
      py.set(event.clientY / window.innerHeight - 0.5);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduced, px, py]);

  const tilt = fine && !reduced;

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-10 pt-28 md:pb-12 md:pt-36"
    >
      <AmbientLight />

      <Container className="relative z-10 flex flex-1 flex-col justify-center">
        <motion.div
          style={reduced ? undefined : { opacity, y }}
          className="will-change-transform"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="flex items-center gap-4"
          >
            <span className="h-px w-10 bg-hairline-strong" />
            <span className="label-mono text-ink-muted">
              {profile.roles.join(" · ")}
            </span>
          </motion.div>

          <motion.h1
            style={
              tilt
                ? { rotateX, rotateY, transformPerspective: 1400 }
                : undefined
            }
            className="mt-10 max-w-[16ch] font-display text-display font-medium will-change-transform md:mt-12"
          >
            {/* The gradient rides on the words, not the heading — see the
                note in TextReveal for why the container cannot carry it. */}
            <TextReveal
              text="Craft is what"
              delay={0.35}
              className="block"
              wordClassName="text-gradient-ink"
            />
            <TextReveal
              text="survives the"
              delay={0.45}
              className="block"
              wordClassName="text-gradient-ink"
            />
            <TextReveal
              text="fourth hour."
              delay={0.55}
              className="block"
              wordClassName="text-gradient-ink"
            />
          </motion.h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: easeOutQuiet }}
            className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8"
          >
            <p className="max-w-[46ch] text-lead text-ink-secondary lg:col-span-5">
              {profile.positioning}
            </p>

            <div className="flex flex-wrap items-start gap-4 lg:col-span-5 lg:col-start-8">
              <MagneticCta href="/#work">See the work</MagneticCta>
              <MagneticCta href="/#contact">Get in touch</MagneticCta>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      <Container className="relative z-10">
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.35 }}
          className="flex flex-wrap items-end justify-between gap-6 border-t border-hairline pt-6"
        >
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <li className="label-mono">
              <span className="text-ink-faint">Focus</span>{" "}
              <span className="ml-2 text-ink-secondary">
                Product engineering
              </span>
            </li>
            <li className="label-mono">
              <span className="text-ink-faint">Status</span>{" "}
              <span className="ml-2 text-ink-secondary">
                {profile.availabilityShort}
              </span>
            </li>
          </ul>

          <LocalTime />
        </motion.div>
      </Container>

    </section>
  );
}

/**
 * A slow, low-amplitude light source behind the type. Two blurred radials on
 * a single composited layer — it moves far too slowly to register as
 * animation and exists only to stop the background reading as flat black.
 */
function AmbientLight() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <motion.div
        /* Scaled to the viewport. At a fixed 46rem the pool is twice the
           width of a phone screen, which turns ambient light into a colour
           wash across the whole hero. */
        className="absolute left-[8%] top-[12%] size-[24rem] rounded-full opacity-[0.10] blur-[90px] md:size-[46rem] md:blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent-violet) 0%, transparent 62%)",
        }}
        animate={reduced ? undefined : { x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[4%] top-[38%] size-[20rem] rounded-full opacity-[0.09] blur-[90px] md:size-[38rem] md:blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent-cyan) 0%, transparent 62%)",
        }}
        animate={reduced ? undefined : { x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Live local time. Small, and the only thing on the page that ticks. */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="label-mono" data-numeric>
      <span className="text-ink-faint">Local</span>{" "}
      {/* Reserved width so the value appearing after hydration does not
          nudge the row it sits in. */}
      <span className="ml-2 inline-block min-w-[4.5ch] text-ink-secondary">
        {time ?? "—"}
      </span>
      <span className="ml-1 text-ink-faint">IST</span>
    </p>
  );
}

/* A scroll cue lived here and was cut. It sat at the bottom centre, directly
   on top of the metadata bar, and it was telling the viewer something the
   metadata bar and the visible next section already said. Two elements
   competing for the same corner to communicate the same thing is one element
   too many. */
