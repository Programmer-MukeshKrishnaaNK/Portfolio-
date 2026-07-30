"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { nav, profile } from "@/content/profile";
import { useActiveSection } from "@/hooks/use-active-section";
import { Magnetic } from "@/components/primitives/magnetic";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/* Module scope so the array identity is stable across renders — otherwise the
   observer in useActiveSection tears down and rebuilds on every scroll tick. */
const SECTION_IDS = nav
  .map((item) => item.id)
  .filter((id): id is string => Boolean(id));

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeSection = useActiveSection(isHome ? SECTION_IDS : []);
  const [lifted, setLifted] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 40;
    /* Guarded so a scroll only re-renders the header when the state actually
       flips, not on every frame. */
    setLifted((prev) => (prev === next ? prev : next));
  });

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-[110]",
        "transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-quiet",
        lifted
          ? "border-b border-hairline bg-ground/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[92rem] items-center justify-between px-gutter",
          "transition-[padding] duration-500 ease-out-quiet",
          lifted ? "py-4" : "py-6",
        )}
      >
        <Link
          href="/"
          /* `py-2 -my-2` throughout the chrome: grows the hit target to clear
             the 24px minimum without moving anything visually. */
          className="group/mark flex items-baseline gap-2.5 py-2 -my-2"
          aria-label={`${profile.fullName} — home`}
        >
          <span className="font-display text-sm font-medium tracking-[-0.01em] text-ink">
            {profile.fullName}
          </span>
          <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint sm:inline">
            {profile.role}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {nav.map((item) => {
            const active = isHome && item.id === activeSection;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "group/nav relative py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em]",
                  "transition-colors duration-300",
                  active ? "text-ink" : "text-ink-faint hover:text-ink",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current",
                    "transition-transform duration-500 ease-out-quiet",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover/nav:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2.5 lg:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-soft opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-cyan-soft" />
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
              Available
            </span>
          </span>

          <Magnetic strength={0.18} className="hidden md:block">
            <Link
              href="/#contact"
              className="rounded-full border border-hairline-strong px-5 py-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:border-ink/40 hover:bg-ink hover:text-ground"
            >
              Get in touch
            </Link>
          </Magnetic>

          <MobileMenu activeSection={activeSection} isHome={isHome} />
        </div>
      </div>
    </motion.header>
  );
}

/**
 * Mobile navigation, built on the Radix dialog primitive.
 *
 * Rolling a custom overlay here would mean reimplementing the focus trap,
 * the escape handler, the scroll lock, the `aria-modal` semantics, and the
 * return-focus-on-close behaviour — all of which this gets correct already.
 */
function MobileMenu({
  activeSection,
  isHome,
}: {
  activeSection: string | null;
  isHome: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label="Open navigation"
        className="flex size-11 items-center justify-center rounded-full border border-hairline-strong text-ink md:hidden"
      >
        <span aria-hidden className="flex flex-col gap-[5px]">
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </span>
      </DialogTrigger>

      <DialogContent
        showCloseButton
        className="top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none bg-ground p-0 ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">Navigation</DialogTitle>
        <div className="flex h-full flex-col justify-between px-gutter py-10">
          <span className="label-mono">{profile.fullName}</span>

          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {nav.map((item, i) => {
              const active = isHome && item.id === activeSection;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 * i + 0.08,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "true" : undefined}
                    className="flex items-baseline gap-4 py-2"
                  >
                    <span className="label-mono w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-subtitle tracking-[-0.02em]",
                        active ? "text-ink" : "text-ink-secondary",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="space-y-3">
            <div className="rule" />
            <a
              href={`mailto:${profile.email}`}
              className="block font-mono text-xs tracking-[0.04em] text-ink-muted"
            >
              {profile.email}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
