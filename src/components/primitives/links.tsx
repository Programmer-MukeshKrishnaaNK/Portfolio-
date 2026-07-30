"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/primitives/magnetic";

/**
 * A link whose underline is drawn rather than declared.
 *
 * The underline wipes out to the right and back in from the left, so the
 * gesture has a direction that matches reading order. It is a pseudo-element
 * scaled on the X axis — no layout, no repaint of the text itself.
 *
 * `currentColor` is intentional: the underline inherits whatever the link
 * inherits, so it stays correct on ink, cyan, and violet without variants.
 */
export function UnderlineLink({
  children,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        "group/underline relative inline-flex items-center gap-1.5",
        "transition-colors duration-300",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-current",
            "transition-transform duration-[450ms] ease-out-quiet",
            "group-hover/underline:origin-left group-hover/underline:scale-x-0",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current",
            "transition-transform delay-[220ms] duration-[450ms] ease-out-quiet",
            "group-hover/underline:scale-x-100",
          )}
        />
      </span>
    </Link>
  );
}

/**
 * The primary call to action.
 *
 * Magnetism is set low and the fill sweeps from the bottom, which gives the
 * hover a direction rather than a flash. The arrow travels on both axes so
 * the whole thing resolves as one gesture instead of three separate ones.
 */
export function MagneticCta({
  href,
  children,
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const inner = (
    <span
      className={cn(
        "group/cta relative inline-flex items-center gap-3 overflow-hidden rounded-full",
        /* `whitespace-nowrap`: a two-line pill with the arrow drifting to the
           far right stops reading as a button. */
        "whitespace-nowrap border border-hairline-strong px-7 py-3.5",
        "font-mono text-label uppercase tracking-[0.16em] text-ink",
        "transition-colors duration-500 hover:text-ground",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-ink transition-transform duration-[600ms] ease-out-quiet group-hover/cta:scale-y-100"
      />
      <span className="relative z-10">{children}</span>
      <ArrowUpRight
        aria-hidden
        className="relative z-10 size-3.5 transition-transform duration-500 ease-out-quiet group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
      />
    </span>
  );

  return (
    <Magnetic strength={0.2} className="inline-block">
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-block rounded-full"
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className="inline-block rounded-full">
          {inner}
        </Link>
      )}
    </Magnetic>
  );
}
