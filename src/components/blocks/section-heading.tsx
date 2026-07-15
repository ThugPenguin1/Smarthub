"use client";

/**
 * ============================================================================
 * FILE: section-heading.tsx — Reusable Section Heading Block
 * ============================================================================
 * WHAT IT IS:
 *   A small reusable "heading" block used at the top of every content
 *   section on every page. Provides a consistent eyebrow pill + <h2> +
 *   optional lead paragraph pattern.
 *
 * WHAT IT DOES:
 *   - Renders an optional small uppercase eyebrow pill (with a teal dot).
 *   - Renders a bold <h2> title in a display font.
 *   - Optionally renders a lead paragraph below the title.
 *   - Supports left-aligned (default) or center-aligned text.
 *   - Supports a `dark` prop that switches the colour scheme for use on
 *     dark backgrounds (e.g. inside dark sections).
 *
 * HOW IT FITS IN:
 *   A "block" component used everywhere. Pages import this and pass it an
 *   eyebrow, title, lead, alignment, and dark flag instead of re-writing
 *   the same heading markup on every section. The colours and spacing are
 *   tuned to match `PageHero` and other brand blocks for visual consistency.
 * ============================================================================
 */

import { ReactNode } from "react";

/**
 * SectionHeading — the reusable section heading block.
 *
 * Inputs (props):
 *   - eyebrow?: string         — optional small label shown in the pill.
 *                                Optional because some sections omit it.
 *   - title:   ReactNode       — the <h2> title. ReactNode (not string)
 *                                so callers can include styled spans.
 *   - lead?:   string          — optional supporting paragraph.
 *   - align?:  "left" | "center" — alignment. Default "left".
 *   - dark?:   boolean         — if true, switches text/badge colours for
 *                                use on dark backgrounds. Default false.
 *
 * Produces: a `<div>` (not a section) containing optional eyebrow pill,
 * <h2>, and optional lead paragraph. Constrained to max-w-3xl so the
 * heading never gets too wide on large screens.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    // Container div. When centered, `mx-auto text-center` constrains the
    // width and centers the text. `max-w-3xl` keeps the heading readable
    // even on very wide screens (long lines of text are hard to read).
    <div
      className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}
    >
      {/* ============== EYEBROW PILL (optional) ============== */}
      {/* Rendered only if `eyebrow` was passed. The pill's colours depend
          on the `dark` flag:
            - dark=true:  teal-400/10 background, teal-200 text (light pill
                          for dark backgrounds).
            - dark=false: teal-50 background, teal-700 text (dark pill for
                          light backgrounds). */}
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
            dark
              ? "bg-teal-400/10 text-teal-200"
              : "bg-teal-50 text-teal-700"
          }`}
        >
          {/* Small dot inside the pill. Colour also depends on `dark`. */}
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              dark ? "bg-teal-300" : "bg-teal-500"
            }`}
          />
          {eyebrow}
        </span>
      )}
      {/* ============== <h2> TITLE ============== */}
      {/* Big bold display-font heading. `mt-5` separates it from the
          eyebrow pill. Responsive sizes scale from 3xl on mobile up to
          2.75rem on large screens. Title colour depends on `dark`. */}
      <h2
        className={`mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {/* ============== LEAD PARAGRAPH (optional) ============== */}
      {/* Rendered only if `lead` was passed. Slightly muted colour so it
          doesn't compete with the title. Lead colour depends on `dark`. */}
      {lead && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
