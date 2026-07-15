"use client";

/*
 * =====================================================================
 * FILE: not-found.tsx — The 404 "page not found" page (route: "not-found")
 * =====================================================================
 * WHAT THIS FILE IS
 *   The page shown when a visitor hits a URL that doesn't match any route
 *   (e.g. #/typo or #/nonexistent). Also reachable as the fallback route.
 *
 * WHAT IT DOES
 *   Renders <NotFoundPage /> — a centered layout with a huge gradient "404"
 *   number, a headline, a body paragraph, and two buttons: "Back to home"
 *   (navigates to /) and "Go back" (calls window.history.back()).
 *
 * HOW IT FITS IN
 *   - Exported as `NotFoundPage`, rendered by RouterOutlet when route ===
 *     "not-found". The router's `parseHash()` returns "not-found" for any
 *     unrecognized hash path.
 *   - Copy comes from t.notFound (merged in from extra-content.ts).
 * =====================================================================
 */

import { useLang } from "@/lib/i18n/lang-context";
import { Button } from "@/components/ui/button";
import { RouterLink } from "@/lib/router";
import { Home, ArrowLeft } from "lucide-react";

/**
 * NotFoundPage — the 404 page component.
 *
 * Inputs: none (reads from the language context).
 * Returns: a single <section> with the 404 UI.
 *
 * Hooks: useLang() → { t } (only the translation dictionary is needed here).
 */
export function NotFoundPage() {
  const { t } = useLang();

  return (
    // Full-bleed section, centered content, with two decorative blurred blobs
    // in the background for visual softness. `min-h-[70vh]` keeps it tall
    // enough to feel like a real "page" rather than a tiny error box.
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/30 to-rose-50/30 py-20">
      {/* Two decorative blurred circles — pure visual flourish. */}
      <div className="pointer-events-none absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-32 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        {/* Big "404" — a giant gradient-filled number using bg-clip-text trick. */}
        {/* Big 404 */}
        <div className="font-display text-[10rem] font-bold leading-none text-transparent sm:text-[14rem] bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500 bg-clip-text">
          404
        </div>

        {/* Headline + body paragraph from t.notFound. */}
        <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
          {t.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
          {t.notFound.body}
        </p>

        {/* Two buttons: primary "Back to home" (RouterLink → /), secondary
            "Go back" (calls window.history.back()). The secondary button is a
            plain <a href="#"> so it doesn't trigger the router; the onClick
            handler does the work. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25 hover:from-teal-600 hover:to-teal-700"
          >
            <RouterLink to="home">
              <Home className="mr-2 h-4 w-4" />
              {t.notFound.cta}
            </RouterLink>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => typeof window !== "undefined" && window.history.back()}
          >
            <a href="#">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.notFound.cta === "Back to home" ? "Go back" : "返回"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
