"use client";

/**
 * ============================================================================
 * FILE: whatsapp-float.tsx — Floating WhatsApp Button
 * ============================================================================
 * WHAT IT IS:
 *   A circular green WhatsApp button that floats in the bottom-right corner
 *   of every page.
 *
 * WHAT IT DOES:
 *   - Renders a fixed-position green circle with the WhatsApp logo.
 *   - Shows a pulsing "ping" ring animation for the first 3.5 seconds after
 *     mount, then stops it (so it doesn't distract the user forever).
 *   - Shows a small tooltip ("WhatsApp") on hover.
 *   - Opens a WhatsApp chat in a new tab when clicked.
 *
 * HOW IT FITS IN:
 *   This is a small "section" component mounted once in the app shell. It
 *   sits alongside `BackToTop` and `CookieConsent` as one of the floating
 *   overlay UI pieces. It uses the lang context only for the translated
 *   tooltip / aria-label string.
 * ============================================================================
 */

import { useLang } from "@/lib/i18n/lang-context";
import { useEffect, useState } from "react";

/**
 * WhatsAppFloat — the floating WhatsApp action button.
 *
 * Inputs: none (reads `t.nav.whatsapp` for the tooltip/aria-label string).
 * Produces: a fixed-position circular <a> element in the bottom-right that
 * links to wa.me/<number> in a new tab, with a 3.5s pulse animation and a
 * hover tooltip.
 */
export function WhatsAppFloat() {
  // Pull translated WhatsApp label (used for both the aria-label and the
  // hover tooltip text).
  const { t } = useLang();
  // Whether the pulse ring is still animating. Starts true, flips to false
  // after 3.5 seconds.
  const [pulsing, setPulsing] = useState(true);

  /**
   * Pulse timeout effect.
   * - On mount, schedule a 3500ms timer that sets `pulsing` to false.
   * - Returning `clearTimeout(id)` in the cleanup function ensures that if
   *   the component unmounts before 3.5s (rare, but possible during fast
   *   navigation), we don't try to update state on an unmounted component.
   */
  useEffect(() => {
    const id = setTimeout(() => setPulsing(false), 3500);
    return () => clearTimeout(id);
  }, []);

  // The <a> tag is the entire button. It uses fixed positioning so it stays
  // glued to the bottom-right corner regardless of scroll position.
  return (
    <a
      href="https://wa.me/85255013516"
      target="_blank"
      rel="noopener noreferrer"
      // `aria-label` is read by screen readers since the link has no text
      // content (only an SVG icon). This makes the button accessible.
      aria-label={t.nav.whatsapp}
      // `group` enables group-hover utilities on children (the tooltip).
      // `fixed bottom-5 right-5 z-50` pins it to the corner above other UI.
      // The `bg-[#25D366]` is WhatsApp's official brand green.
      className="group fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 transition hover:scale-110 hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
    >
      {/* WhatsApp logo as inline SVG. `aria-hidden` because the parent <a>
          already has an aria-label, so we don't want screen readers to read
          the SVG too. */}
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.04 2C6.534 2 2.062 6.472 2.062 11.98c0 1.762.465 3.488 1.348 4.998L2 22l5.15-1.35a9.95 9.95 0 004.89 1.275h.004c5.507 0 9.98-4.473 9.98-9.98S17.552 2 12.04 2" />
      </svg>
      {/* ============== HOVER TOOLTIP ============== */}
      {/* A small dark pill that appears to the LEFT of the button on hover.
          - `pointer-events-none` so it never blocks clicks.
          - `opacity-0` by default, `group-hover:opacity-100` reveals it
            when the parent <a> (which has the `group` class) is hovered. */}
      <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {t.nav.whatsapp}
      </span>
      {/* ============== PULSE RING (first 3.5s only) ============== */}
      {/* A copy of the green circle sitting behind the button (`-z-10`),
          animating with Tailwind's `animate-ping` (a scale + fade keyframe).
          Rendered only while `pulsing` is true (the first 3.5 seconds). */}
      {pulsing && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30" />
      )}
    </a>
  );
}
