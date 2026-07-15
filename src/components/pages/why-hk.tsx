"use client";

/*
 * =====================================================================
 * FILE: why-hk.tsx — The "Why Hong Kong" page (route: "why-hk", URL: #/why-hong-kong)
 * =====================================================================
 * WHAT THIS FILE IS
 *   The page that makes the case for setting up a business in Hong Kong.
 *   Aimed at entrepreneurs deciding whether HK is the right jurisdiction.
 *
 * WHAT IT DOES
 *   Renders <WhyHKPage /> — a PageHero, then a 6-card benefits grid (each
 *   card with a number watermark and an icon), a teal stats band with a grid
 *   pattern overlay, a full-bleed image band with overlay text, and a final
 *   dark-variant CTABand.
 *
 * HOW IT FITS IN
 *   - Exported as `WhyHKPage`, rendered by RouterOutlet when route === "why-hk".
 *   - Note the URL is /why-hong-kong but the route key is "why-hk" (the
 *     router maps between them in src/lib/router.tsx).
 *   - Copy comes from pageContent[lang].pages.whyhk (`p`) for hero/stats/CTA,
 *     and from t.whyhk.cards for the 6 benefit cards. The image-band text
 *     comes from t.whyHkExtra (merged in from extra-content.ts).
 * =====================================================================
 */

import { useLang } from "@/lib/i18n/lang-context";
import { pageContent } from "@/lib/i18n/page-content";
import { PageHero } from "@/components/blocks/page-hero";
import { SectionHeading } from "@/components/blocks/section-heading";
import { CTABand } from "@/components/blocks/cta-band";
import { Banknote, Globe, Scale, ShieldCheck, Plane, Users } from "lucide-react";
import Image from "next/image";

// Lucide icons paired by index with the 6 benefit cards from t.whyhk.cards.
const WHY_ICONS = [Banknote, Globe, Scale, ShieldCheck, Plane, Users];

/**
 * WhyHKPage — top-level page component for the /why-hong-kong route.
 *
 * Inputs: none (reads from the language context).
 * Returns: a React fragment with PageHero + benefits grid + stats band +
 *   image band + dark CTABand.
 *
 * Hooks: useLang() → { t, lang }.
 */
export function WhyHKPage() {
  const { t, lang } = useLang();
  // Page-level copy (hero, stats array, CTA labels).
  const p = pageContent[lang].pages.whyhk;

  return (
    <>
      {/* PAGE HERO: medium-height dark image banner with eyebrow, H1, and lead. */}
      <PageHero
        eyebrow={p.heroEyebrow}
        title={p.heroTitle}
        lead={p.heroLead}
        image="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=2400&q=80"
        height="md"
      />

      {/* ===== BENEFITS GRID ===== */}
      {/* BENEFITS GRID SECTION: 3-column responsive grid of 6 cards (sm:2, lg:3).
          Each card has a large faint number watermark (01–06) in the corner,
          a colored icon tile, an H3 title, and a description. */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.whyhk.cards.map((c, i) => {
              // Pick the icon for this card; fallback to ShieldCheck if missing.
              const Icon = WHY_ICONS[i] ?? ShieldCheck;
              return (
                <div
                  key={i}
                  className="lift-card group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  {/* Number watermark — large faint "01"–"06" in the top-right corner.
                      `pointer-events-none` so it never intercepts clicks. */}
                  <span className="pointer-events-none absolute -right-3 -top-4 font-display text-8xl font-bold text-slate-50">
                    0{i + 1}
                  </span>
                  <div className="relative">
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {c.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HK STATS ===== */}
      {/* HK STATS BAND: teal gradient background with a faint grid pattern overlay.
          Renders a centered H2 title and a 6-column grid of stat tiles
          (2 on mobile, 3 on sm, 6 on lg). Maps over p.stats. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 py-20 text-white lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center font-display text-3xl font-bold sm:text-4xl">
            {p.statsTitle}
          </h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {p.stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  {s.num}
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-teal-100">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HK IMAGE BAND ===== */}
      {/* HK IMAGE BAND: full-bleed 400px-tall Hong Kong skyline image with a
          left-to-right dark gradient overlay. Left-aligned overlay text uses
          `t.whyHkExtra.bandTitle` and `t.whyHkExtra.bandBody` (extra-content
          dictionary, not the main pageContent). */}
      <section className="relative h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=2400&q=80"
          alt="Hong Kong skyline"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-xl text-white">
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              {t.whyHkExtra.bandTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-200">
              {t.whyHkExtra.bandBody}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA band — uses the "dark" variant (slate-950 background)
          instead of the default teal gradient, to fit this page's mood. */}
      <CTABand
        title={p.ctaTitle}
        lead={p.ctaLead}
        buttonLabel={p.ctaButton}
        buttonTo="contact"
        variant="dark"
      />
    </>
  );
}
