"use client";

/**
 * ============================================================================
 * FILE: cta-band.tsx — Reusable Call-to-Action Band Block
 * ============================================================================
 * WHAT IT IS:
 *   A reusable full-width "call to action" band used near the bottom of
 *   every page to prompt the user to take the next step (Get Started,
 *   Talk to Us, Book a Tour, etc.).
 *
 * WHAT IT DOES:
 *   - Renders a horizontally-centred title + optional lead + a single
 *     primary button.
 *   - Has two visual variants: `teal` (default, teal→emerald gradient
 *     background) and `dark` (slate-950 background).
 *   - Adds decorative background layers: a subtle grid pattern overlay
 *     and a blurred white glow at the top, for visual interest.
 *   - The button uses RouterLink so navigation is instant (no full page
 *     reload) and respects cmd+click to open in a new tab.
 *
 * HOW IT FITS IN:
 *   A "block" component used at the bottom of every page. The file also
 *   exports a second variant, `CTABandNode`, which accepts arbitrary
 *   children (e.g. multiple buttons) instead of a single RouterLink button.
 * ============================================================================
 */

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { RouterLink } from "@/lib/router";

/**
 * CTABand — the primary CTA band component with a single button.
 *
 * Inputs (props):
 *   - title:       string  — the big <h2> title text.
 *   - lead?:       string  — optional supporting paragraph.
 *   - buttonLabel: string  — text shown on the CTA button.
 *   - buttonTo?:   "contact" | "services" | "pricing" — which route the
 *                   button navigates to. Default "contact".
 *   - variant?:    "teal" | "dark" — visual variant. Default "teal".
 *
 * Produces: a full-width <section> with decorative grid + glow, centred
 * title/lead, and a primary button that navigates via RouterLink.
 */
export function CTABand({
  title,
  lead,
  buttonLabel,
  buttonTo = "contact",
  variant = "teal",
}: {
  title: string;
  lead?: string;
  buttonLabel: string;
  buttonTo?: "contact" | "services" | "pricing";
  variant?: "teal" | "dark";
}) {
  // Boolean shortcut: true when variant is "teal" (the default). Used to
  // pick between the teal gradient background and the dark slate background.
  const isTeal = variant === "teal";
  return (
    // The <section> uses overflow-hidden so the decorative grid/glow
    // layers don't spill outside the rounded edges (if any). Padding is
    // responsive: more vertical space on large screens.
    <section
      className={`relative overflow-hidden py-20 lg:py-24 ${
        isTeal
          ? "bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700"
          : "bg-slate-950"
      }`}
    >
      {/* ============== DECORATIVE GRID PATTERN ============== */}
      {/* A subtle white grid drawn with two linear-gradients (one
          horizontal, one vertical) producing a 56×56px grid. The whole
          layer is at 8% opacity so it's barely visible — just adds
          texture. `pointer-events-none` ensures it never blocks clicks. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* ============== DECORATIVE GLOW ============== */}
      {/* A large blurred white blob positioned at the top centre. The
          `blur-3xl` (very heavy blur) turns it into a soft glow that
          adds depth without being distracting. */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

      {/* ============== CONTENT ============== */}
      {/* Centred content: title, optional lead, and the CTA button.
          `relative` is important so this layer sits above the absolute
          decorative layers above. */}
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Title <h2>. White text (works on both teal and dark variants).
            Responsive sizes scale from 3xl on mobile to 5xl on large. */}
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {/* Optional lead paragraph. Slightly translucent white so it
          reads as a secondary element. */}
        {lead && (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-100/90 sm:text-lg">
            {lead}
          </p>
        )}
        {/* ============== CTA BUTTON ============== */}
        {/* White button with teal text — high contrast against the
          teal/dark background. `btn-shimmer` is a custom CSS animation
          class (defined in globals.css) that adds a subtle shimmer
          sweep. The `asChild` pattern lets us wrap a RouterLink so the
          whole thing is a clickable link styled as a button. */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="btn-shimmer bg-white text-teal-700 shadow-xl shadow-slate-900/20 hover:bg-teal-50"
          >
            <RouterLink to={buttonTo}>
              {buttonLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </RouterLink>
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * CTABandNode — an alternative CTA band that accepts arbitrary children.
 *
 * Use this when you need multiple buttons, or buttons that aren't simple
 * RouterLinks (e.g. a phone-tel button + a RouterLink button side by
 * side). The visual styling is identical to CTABand's teal variant.
 *
 * Inputs (props):
 *   - title:    string    — the big <h2> title text.
 *   - lead?:    string    — optional supporting paragraph.
 *   - children?: ReactNode — the action area (typically one or more
 *                   Button elements supplied by the caller).
 *
 * Produces: same as CTABand but with the caller's JSX rendered where the
 * single button would be.
 */
export function CTABandNode({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 py-20 lg:py-24">
      {/* Same decorative grid pattern as CTABand. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Same decorative glow as CTABand. */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

      {/* Centred content. The `children` prop is rendered where the
          button would be — this is the key difference from CTABand. */}
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {lead && (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-100/90 sm:text-lg">
            {lead}
          </p>
        )}
        {/* Caller-provided action area (typically buttons). */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      </div>
    </section>
  );
}
