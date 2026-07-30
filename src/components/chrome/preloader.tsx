"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { bootSequence, profile } from "@/content/profile";
import { easeOutQuiet } from "@/lib/motion";
import { useLenis } from "@/components/chrome/smooth-scroll";

/* Typing cadence. Paced so the 88 characters of the boot sequence take very
   nearly the full minimum on their own — 88·17ms + 5·230ms + 320ms ≈ 2.97s.
   The alternative was to keep the old 1.9s cadence and hold a finished log on
   screen for a second, which is exactly the dead pause this is meant to avoid:
   the sequence should still be moving when it ends. */
const CHAR_MS = 17;
const LINE_HOLD_MS = 230;
const START_DELAY_MS = 320;

/** Floor, not a delay — see `waitForReady` for why those differ. */
const MIN_VISIBLE_MS = 3000;

/* Failsafe. `load` does not fire while any subresource is still pending, so a
   single stalled request could otherwise trap the overlay indefinitely. Well
   past any honest load; only reachable when something is genuinely wrong. */
const MAX_VISIBLE_MS = 10000;

const SESSION_KEY = "ql:booted";

/**
 * Resolves when the page is actually ready to be looked at.
 *
 * Both conditions matter for a site whose first impression is typographic:
 * `load` covers subresources, and `fonts.ready` prevents the display type
 * re-flowing from a fallback face in the first frame after the overlay
 * retracts — which would undo the seamlessness the sequence exists to create.
 */
function waitForReady(): Promise<unknown> {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true }),
        );

  return Promise.all([loaded, document.fonts?.ready ?? Promise.resolve()]);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The loading sequence.
 *
 * Three rules keep this from being the thing people skip:
 *
 *  1. It never gates content. The page is fully rendered underneath — this is
 *     an overlay that removes itself. If JavaScript fails outright, the site
 *     is still there.
 *  2. It runs once per session. A cinematic intro on every navigation stops
 *     being cinematic on the second viewing and becomes a toll.
 *  3. It does not exist under `prefers-reduced-motion`, and an inline script
 *     in the document head hides it before first paint on a repeat visit, so
 *     neither case gets a flash of an overlay that was about to be dismissed.
 *
 * The log lines are real: each names something the page actually does before
 * it is interactive. Fabricated progress is the tell that separates a loading
 * sequence from a loading screen.
 */
export function Preloader() {
  const [phase, setPhase] = useState<"boot" | "exit" | "done">("boot");
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const lenis = useLenis();
  const startedRef = useRef(false);

  const totalChars = bootSequence.reduce((sum, l) => sum + l.length, 0);
  const doneChars =
    bootSequence.slice(0, lineIndex).reduce((sum, l) => sum + l.length, 0) +
    typed.length;
  const progress = Math.min(100, Math.round((doneChars / totalChars) * 100));

  /* Decide whether to run at all. Deferred to an effect because the answer
     depends on sessionStorage and a media query, neither of which exists
     during the server render. */
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const repeatVisit =
      document.documentElement.classList.contains("booted") ||
      sessionStorage.getItem(SESSION_KEY) === "1";
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (repeatVisit || reduced) {
      setPhase("done");
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    let line = 0;
    let char = 0;
    const startedAt = performance.now();

    const step = () => {
      if (cancelled) return;

      if (line >= bootSequence.length) {
        /* Two independent gates, whichever finishes last:
             - the remainder of the 3s minimum, so a warm cache still gets
               the full sequence rather than a flash
             - genuine readiness, so a slow first visit is never handed a
               half-painted page
           Racing the failsafe means neither gate can hang the overlay. */
        const remaining = Math.max(
          0,
          MIN_VISIBLE_MS - (performance.now() - startedAt),
        );

        Promise.race([
          Promise.all([waitForReady(), wait(remaining)]),
          wait(MAX_VISIBLE_MS - (performance.now() - startedAt)),
        ]).then(() => {
          if (cancelled) return;
          sessionStorage.setItem(SESSION_KEY, "1");
          setPhase("exit");
        });

        return;
      }

      const current = bootSequence[line];

      if (char < current.length) {
        char += 1;
        setTyped(current.slice(0, char));
        timer = setTimeout(step, CHAR_MS);
        return;
      }

      line += 1;
      char = 0;
      setLineIndex(line);
      setTyped("");
      timer = setTimeout(step, LINE_HOLD_MS);
    };

    timer = setTimeout(step, START_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  /* Hold the scroll position while the overlay is up. Both locks are needed:
     Lenis owns the animated position, the body style covers the frames before
     Lenis has initialised. */
  useEffect(() => {
    if (phase === "done") return;

    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      document.body.style.overflow = previous;
    };
  }, [phase, lenis]);

  return (
    <AnimatePresence onExitComplete={() => setPhase("done")}>
      {phase === "boot" ? (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[150] origin-top bg-ground"
          initial={{ scaleY: 1 }}
          /* The log clears first, then the panel retracts upward — the same
             gesture the images use, so the intro belongs to the site rather
             than sitting in front of it. */
          exit={{
            scaleY: 0,
            transition: { duration: 0.95, ease: easeOutQuiet, delay: 0.22 },
          }}
        >
          <motion.div
            className="flex h-full flex-col justify-between px-gutter py-10 md:py-12"
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
          >
            <div className="flex items-start justify-between">
              <span className="label-mono text-ink-secondary">
                {profile.fullName}
              </span>
              <span
                data-numeric
                className="label-mono text-ink-faint"
                role="status"
                aria-live="polite"
                aria-label={`Loading ${progress} percent`}
              >
                {String(progress).padStart(3, "0")}
              </span>
            </div>

            <ol className="space-y-2 font-mono text-[0.75rem] leading-relaxed sm:text-sm">
              {bootSequence.slice(0, lineIndex).map((line) => (
                <li key={line} className="text-ink-faint">
                  <span className="text-cyan-soft/50">›</span> {line}
                </li>
              ))}
              {lineIndex < bootSequence.length ? (
                <li className="text-ink-secondary">
                  <span className="text-cyan-soft">›</span> {typed}
                  <span className="ml-1 inline-block h-[0.95em] w-[7px] translate-y-[0.14em] animate-pulse bg-cyan-soft align-baseline" />
                </li>
              ) : null}
            </ol>

            <div className="relative h-px w-full bg-hairline">
              <motion.div
                className="absolute inset-y-0 left-0 origin-left bg-ink/70"
                style={{ width: "100%" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
