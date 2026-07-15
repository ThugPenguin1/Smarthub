"use client";

/*
 * =====================================================================
 * FILE: legal.tsx — Reusable legal page component (routes: "privacy",
 *        "terms", "complaints", "disclosures" — URLs: #/privacy, #/terms,
 *        #/complaints, #/disclosures)
 * =====================================================================
 * WHAT THIS FILE IS
 *   A single reusable component that renders any of the 4 legal pages
 *   (Privacy Policy, Terms of Service, Complaints Procedure, Regulatory
 *   Disclosures). The `which` prop selects which legal document to show.
 *
 * WHAT IT DOES
 *   Renders <LegalPage which="privacy" /> (or "terms" / "complaints" /
 *   "disclosures") — a PageHero with a doc-specific image, an intro paragraph,
 *   a list of {heading, paragraph} sections, a contact card with the company's
 *   legal name + address + email + phone, and a closing CTABand.
 *
 * HOW IT FITS IN
 *   - Exported as `LegalPage`. Imported once by src/app/page.tsx and rendered
 *     4 times (once per legal route) with a different `which` prop each time.
 *   - Copy comes from `t.legal[which]` (a doc object with `updated`, `title`,
 *     `intro`, and `sections[]`). The legal docs live in extra-content.ts
 *     and get merged into `t` by lang-context.tsx.
 *   - The LegalKey type and HERO_IMAGES map (below) select the right hero image
 *     per document.
 * =====================================================================
 */

import { useLang } from "@/lib/i18n/lang-context";
import { PageHero } from "@/components/blocks/page-hero";
import { CTABand } from "@/components/blocks/cta-band";
import { companyFacts } from "@/lib/site-data";
import type { Lang } from "@/lib/i18n/translations";

// The 4 legal document keys. Each corresponds to a route and a `t.legal[which]`
// entry. TypeScript enforces that the `which` prop must be one of these strings.
type LegalKey = "privacy" | "terms" | "complaints" | "disclosures";

// One hero image per legal document. A `Record<LegalKey, string>` ensures the
// map has exactly one entry per key — if you add a new LegalKey, TypeScript
// will error until you add its image here too.
const HERO_IMAGES: Record<LegalKey, string> = {
  privacy:
    "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=2400&q=80",
  terms:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=80",
  complaints:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2400&q=80",
  disclosures:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80",
};

/**
 * LegalPage — renders one of the 4 legal documents.
 *
 * Props:
 *   - `which`: LegalKey — selects which document to render.
 *
 * Returns: a React fragment with PageHero + intro + sections + contact card + CTABand.
 *
 * Hooks: useLang() → { t, lang }.
 *
 * Why a single component for 4 pages? The 4 legal docs share the exact same
 * layout — only the copy and hero image differ. Reusing one component avoids
 * duplicating ~80 lines of JSX 4 times.
 */
export function LegalPage({ which }: { which: LegalKey }) {
  const { t, lang } = useLang();
  // Pull the document object (title, updated date, intro, sections[]) for the
  // requested legal key from the translation dictionary.
  const doc = t.legal[which];

  return (
    <>
      {/* PAGE HERO: small-height dark image banner. The image is chosen from
          HERO_IMAGES using the `which` prop. The eyebrow shows the doc's
          "last updated" date; the title is the doc's title. */}
      <PageHero
        eyebrow={doc.updated}
        title={doc.title}
        image={HERO_IMAGES[which]}
        height="sm"
      />

      {/* LEGAL BODY: a narrow max-w-3xl reading column. Renders the intro
          paragraph, then maps over doc.sections (each {heading, paragraph}). */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6">
          {/* Intro paragraph — leads off the document. */}
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            {doc.intro}
          </p>

          {/* Sections — each has a heading (s.h) and a paragraph (s.p). */}
          <div className="mt-10 space-y-8">
            {doc.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                  {s.h}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{s.p}</p>
              </div>
            ))}
          </div>

          {/* Contact footer card — shows the legal entity name + address +
              email + phone. The address is language-aware (English / trad. / simp.).
              The "Contact us" heading is also inline-translated by language. */}
          <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-display text-base font-bold text-slate-900">
              {lang === "en" ? "Contact us" : lang === "zh-HK" ? "聯絡我哋" : "联络我们"}
            </h3>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <div>{companyFacts.legalName}</div>
              <div>
                {lang === "en"
                  ? companyFacts.address
                  : lang === "zh-HK"
                  ? companyFacts.addressZh
                  : companyFacts.addressCn}
              </div>
              <div>
                <a href={`mailto:${companyFacts.email}`} className="text-teal-700 hover:underline">
                  {companyFacts.email}
                </a>
              </div>
              <div>
                <a href={`tel:${companyFacts.phone.replace(/\s/g, "")}`} className="text-teal-700 hover:underline">
                  {companyFacts.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA band — reuses the homepage CTA copy (t.pages.home.cta*). */}
      <CTABand
        title={t.pages.home.ctaTitle}
        lead={t.pages.home.ctaLead}
        buttonLabel={t.pages.home.ctaButton}
        buttonTo="contact"
      />
    </>
  );
}
