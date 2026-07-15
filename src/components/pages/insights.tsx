"use client";

/*
 * =====================================================================
 * FILE: insights.tsx — The Insights / blog page (route: "insights", URL: #/insights)
 * =====================================================================
 * WHAT THIS FILE IS
 *   The articles/insights listing page. Showcases a featured article, a grid
 *   of more articles, and a newsletter signup form.
 *
 * WHAT IT DOES
 *   Renders <InsightsPage /> — a PageHero, a featured article card (large,
 *   two-column with image + text), a 3-column grid of 5 article cards, a
 *   dark newsletter signup panel, and a closing CTABand.
 *
 * HOW IT FITS IN
 *   - Exported as `InsightsPage`, rendered by RouterOutlet when route === "insights".
 *   - Article data comes from the useInsightList() custom hook (defined below)
 *     which merges the 3 base items from t.insights.items with 2 extra
 *     language-aware items defined inline.
 *   - The newsletter form uses local useState to toggle a success message —
 *     there is no backend; it's a UI demo.
 * =====================================================================
 */

import { useLang } from "@/lib/i18n/lang-context";
import { pageContent } from "@/lib/i18n/page-content";
import { PageHero } from "@/components/blocks/page-hero";
import { SectionHeading } from "@/components/blocks/section-heading";
import { CTABand } from "@/components/blocks/cta-band";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Six stock photos for the article cards. Indexed with modulo in the grid so
// extra articles beyond the 6th reuse earlier images.
const INSIGHT_IMAGES = [
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
];

/**
 * useInsightList — custom hook that builds the article list.
 *
 * Returns: an array of { cat, date, title, excerpt } objects.
 *
 * Strategy: starts with the 3 base items from t.insights.items (translated in
 * the dictionary), then appends 2 extra items whose copy is selected by
 * language inline using a ternary chain. Returns 5 articles total.
 *
 * Why a hook? It reads from useLang() so the list re-renders when the language
 * changes. Encapsulating it keeps the page component clean.
 */
function useInsightList() {
  const { t, lang } = useLang();
  const p = pageContent[lang].pages.insights;
  const base = t.insights.items;
  return [
    ...base,
    {
      cat: "Compliance",
      date: "Q2 2026 · 7 min read",
      title:
        lang === "en"
          ? "AML / KYC for TCSP Licensees — What the Companies Registry Now Expects"
          : lang === "zh-HK"
          ? "TCSP 持牌者嘅 AML / KYC——公司註冊處而家期望甚麼"
          : "TCSP 持牌者的 AML / KYC——公司注册处现在期望什么",
      excerpt:
        lang === "en"
          ? "A practical guide to the customer due diligence records every TCSP must keep, and how to survive a Companies Registry inspection."
          : lang === "zh-HK"
          ? "實戰指南——每間 TCSP 必須保存嘅客戶盡職調查紀錄，同如何通過公司註冊處巡查。"
          : "实战指南——每间 TCSP 必须保存的客户尽职调查纪录，及如何通过公司注册处巡查。",
    },
    {
      cat: "Workspace",
      date: "Q1 2026 · 4 min read",
      title:
        lang === "en"
          ? "5 Reasons Wan Chai Beats Central for SME Headquarters in 2026"
          : lang === "zh-HK"
          ? "2026 年中小企總部選址——灣仔勝過中環嘅 5 個理由"
          : "2026 年中小企总部选址——湾仔胜过中环的 5 个理由",
      excerpt:
        lang === "en"
          ? "Rent arbitrage, MTR access, F&B density, talent pool and lifestyle — why Wan Chai is the smart HQ choice this year."
          : lang === "zh-HK"
          ? "租金套利、港鐵通行、餐飲密度、人才庫同生活質素——灣仔係今年嘅明智總部之選。"
          : "租金套利、地铁通行、餐饮密度、人才库与生活素质——湾仔是今年的明智总部之选。",
    },
  ];
}

export function InsightsPage() {
  const { t, lang } = useLang();
  const p = pageContent[lang].pages.insights;
  // Build the article list (3 base + 2 extra = 5 articles).
  const insights = useInsightList();
  // Newsletter form state: `subscribed` toggles the success message; `email`
  // is the controlled input value.
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  /**
   * onSubscribe — form submit handler for the newsletter signup.
   * Inputs: the form submit event.
   * Behavior: prevents the default form POST, sets `subscribed` to true,
   *   clears the email field, then resets `subscribed` back to false after 3
   *   seconds so the success message disappears. (No backend call — demo only.)
   */
  function onSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  }

  return (
    <>
      {/* PAGE HERO: medium-height dark image banner with eyebrow, H1, and lead. */}
      <PageHero
        eyebrow={p.heroEyebrow}
        title={p.heroTitle}
        lead={p.heroLead}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=80"
        height="md"
      />

      {/* ===== FEATURED ===== */}
      {/* FEATURED ARTICLE: a large two-column card. Left side is the article's
          hero image with a rose-colored "Featured" badge; right side has the
          category, date, title, excerpt, and a "Read article" affordance. */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <article className="lift-card group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <Image
                src={INSIGHT_IMAGES[1]}
                alt={p.featured.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                {t.insightsExtra.featuredBadge}
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-teal-50 px-2.5 py-1 font-bold uppercase tracking-wider text-teal-700">
                  {p.featured.cat}
                </span>
                <span className="font-medium uppercase tracking-wider text-slate-400">
                  {p.featured.date}
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-slate-900 transition group-hover:text-teal-700 sm:text-3xl">
                {p.featured.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {p.featured.excerpt}
              </p>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                {t.insightsExtra.readArticle}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ===== GRID ===== */}
      {/* ARTICLE GRID: centered SectionHeading + a 3-column grid of 5 article
          cards (md:2, lg:3). Each card is an <a> that links back to #/insights
          with onClick prevented (the articles aren't real yet — clicking is a
          no-op so visitors stay on the page). */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow={t.insightsExtra.allArticles} title={p.heroTitle} align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((item, i) => (
              // Plain <a> (not RouterLink) because article links are no-ops for now.
              // `onClick={(e) => e.preventDefault()}` stops the browser from
              // navigating away. The href still appears in the status bar for
              // accessibility/SEO friendliness.
              <a
                key={i}
                href="#/insights"
                onClick={(e) => e.preventDefault()}
                className="lift-card group flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                aria-label={item.title}
              >
                {/* Card image — uses INSIGHT_IMAGES[i % length] so extra articles
                    (beyond the 6th) cycle back to earlier images. */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={INSIGHT_IMAGES[i % INSIGHT_IMAGES.length]}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700 backdrop-blur">
                    {item.cat}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {item.date}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-slate-900 transition group-hover:text-teal-700">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                    {t.insightsExtra.readMore}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      {/* NEWSLETTER SECTION: a dark gradient panel with a faint grid pattern
          overlay, a mail icon, heading, body, and an email signup form. On
          submit, the button label briefly switches to a success message. */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900 p-8 shadow-xl sm:p-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative text-center">
              <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-400 text-white shadow-lg">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                {p.newsletterTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
                {p.newsletterBody}
              </p>
              {/* Signup form — controlled input + submit button. Calls
                  onSubscribe on submit; button label toggles to the success
                  message when `subscribed` is true. */}
              <form
                onSubmit={onSubscribe}
                className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row"
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={p.newsletterPlaceholder}
                  className="border-white/15 bg-white/10 text-white placeholder:text-slate-400 focus:border-teal-400"
                />
                <Button
                  type="submit"
                  className="shrink-0 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-900 hover:from-teal-300 hover:to-emerald-300"
                >
                  {subscribed ? p.newsletterSuccess : p.newsletterCta}
                  {!subscribed && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA band — reuses homepage CTA copy for consistency. */}
      <CTABand
        title={pageContent[lang].pages.home.ctaTitle}
        lead={pageContent[lang].pages.home.ctaLead}
        buttonLabel={pageContent[lang].pages.home.ctaButton}
        buttonTo="contact"
      />
    </>
  );
}
