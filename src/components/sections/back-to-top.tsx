"use client";

/**
 * ============================================================================
 * FILE: back-to-top.tsx — Floating "Back to Top" Button
 * ============================================================================
 * WHAT IT IS:
 *   A small dark circular button with an up-arrow that floats above the
 *   WhatsApp button in the bottom-right corner.
 *
 * WHAT IT DOES:
 *   - Stays hidden until the user scrolls down 600px from the top.
 *   - When clicked, smoothly scrolls the window back to the top.
 *   - Hides again if the user scrolls back up above the 600px threshold.
 *
 * HOW IT FITS IN:
 *   A small "section" overlay component mounted once in the app shell. Sits
 *   visually above the WhatsApp float (uses `bottom-20` vs `bottom-5`) so
 *   the two buttons don't overlap. Uses the lang context only for the
 *   translated `aria-label` string.
 * ============================================================================
 */

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/lib/i18n/lang-context";

/**
 * BackToTop — the floating back-to-top button.
 *
 * Inputs: none (reads `t.backToTop` for the aria-label).
 * Produces: a fixed-position dark circular button that appears only when
 * the page is scrolled past 600px. Clicking it smooth-scrolls to the top.
 */
export function BackToTop() {
  // Pull translated aria-label string for screen readers.
  const { t } = useLang();
  // Whether the button should be visible. Starts false so the button is
  // hidden on initial page load (we don't want it on a fresh page that
  // hasn't been scrolled).
  const [visible, setVisible] = useState(false);

  /**
   * Scroll listener effect.
   * - Registers a passive scroll listener that flips `visible` to true once
   *   the user has scrolled past 600px from the top.
   * - 600px is roughly one viewport-height down, chosen so the button only
   *   appears when the user has clearly engaged with the page content.
   * - Calls `onScroll()` once on mount to set the correct initial state
   *   (handles refresh-on-scroll scenarios).
   * - Cleanup removes the listener on unmount.
   */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Early return: if not visible, render nothing. This is cleaner than
  // always rendering and toggling opacity, because the button is completely
  // non-interactive (no tab stop, no screen-reader announcement) when hidden.
  if (!visible) return null;

  // The button itself. Note:
  //   - `bottom-20` (5rem) instead of `bottom-5` so it sits ABOVE the
  //     WhatsApp float (which is at bottom-5).
  //   - `z-40` (vs the WhatsApp float's z-50) so the WhatsApp button wins
  //     any visual overlap — though `bottom-20` already prevents overlap.
  //   - `behavior: "smooth"` on scrollTo animates the scroll back to top.
  return (
    <button
      aria-label={t.backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
