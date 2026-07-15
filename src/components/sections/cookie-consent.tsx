"use client";

/**
 * ============================================================================
 * FILE: cookie-consent.tsx — Cookie Consent Banner
 * ============================================================================
 * WHAT IT IS:
 *   A small white card that pops up in the bottom-right corner on the user's
 *   first visit, asking them to accept or reject non-essential cookies.
 *
 * WHAT IT DOES:
 *   - On mount, checks localStorage for a previously saved consent value.
 *   - If no prior choice exists, waits 800ms (so it doesn't flash on initial
 *     paint) and then shows the banner.
 *   - Offers two buttons: "Accept all" and "Necessary only". Both save the
 *     choice to localStorage and hide the banner.
 *   - Also has an X close button that defaults to "necessary only".
 *   - The banner does NOT reappear on subsequent visits because the choice
 *     is persisted.
 *
 * HOW IT FITS IN:
 *   A "section" overlay component mounted once in the app shell. Uses the
 *   lang context for translated strings. The actual analytics-init logic is
 *   a placeholder — when real analytics is added, the `choose()` function
 *   will be extended to call init/defer based on the value.
 * ============================================================================
 */

import { useLang } from "@/lib/i18n/lang-context";
import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// The localStorage key under which we persist the user's consent choice.
// Using a named constant (instead of the string literal everywhere) avoids
// typos and makes it easy to rename later.
const CONSENT_KEY = "smarthub-cookie-consent";

/**
 * CookieConsent — the cookie consent banner component.
 *
 * Inputs: none (reads `t.cookie.*` for translated strings).
 * Produces: a fixed-position dialog card in the bottom-right corner, shown
 * only on the first visit (when no prior consent exists in localStorage).
 */
export function CookieConsent() {
  // Pull translated strings (title, body, button labels, "learn more").
  const { t } = useLang();
  // Whether the banner is currently visible. Starts false; flipped to true
  // after an 800ms delay IF no prior consent is found.
  const [visible, setVisible] = useState(false);

  /**
   * First-visit check effect.
   * - Reads localStorage for `CONSENT_KEY`.
   * - If a value exists (user has already chosen), do nothing — the banner
   *   should never reappear.
   * - If no value exists, schedule an 800ms timeout to show the banner.
   *   The delay prevents the banner from flashing on initial paint, which
   *   would feel jarring.
   * - `try/catch` around localStorage handles browsers that disable it
   *   (e.g. private mode in some Safari versions).
   * - The cleanup clears the timeout if the component unmounts early.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        // small delay so it doesn't flash on initial paint
        const id = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(id);
      }
    } catch {}
  }, []);

  /**
   * `choose` — records the user's consent choice and hides the banner.
   *
   * Input:  `value` — either "all" (accept all cookies) or "necessary"
   *         (reject non-essential cookies).
   * Effect: Writes the value to localStorage and sets `visible` to false.
   *
   * The placeholder comment below shows where real analytics would be
   * initialised if the user accepted all cookies. For now, the function
   * just records the choice.
   */
  function choose(value: "all" | "necessary") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setVisible(false);
    // Placeholder: when real analytics is added, init/defer based on value
    // if (value === "all") initAnalytics();
  }

  // Early return: if the banner isn't visible, render nothing.
  if (!visible) return null;

  // The dialog is a fixed-position container with role="dialog" and an
  // aria-label so screen readers announce it as a dialog. The inner card
  // has a white background, rounded corners and a large shadow so it
  // stands out against the page.
  return (
    <div
      role="dialog"
      aria-label={t.cookie.title}
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md sm:left-auto sm:right-4 sm:bottom-4 sm:mx-0"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
        {/* Top row: icon tile + content + close button. */}
        <div className="flex items-start gap-3">
          {/* Cookie icon in a teal-tinted rounded tile. */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
            <Cookie className="h-5 w-5" />
          </div>
          {/* Content column: title, body, action buttons. */}
          <div className="flex-1">
            <h2 className="font-display text-sm font-bold text-slate-900">
              {t.cookie.title}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {t.cookie.body}{" "}
              {/* "Learn more" link — currently a placeholder that points to
                  the privacy page. Uses a small helper component defined
                  at the bottom of this file. */}
              <RouterLinkPlaceholder label={t.cookie.learnMore} />
            </p>
            {/* Action buttons: "Accept all" (primary teal) and
                "Necessary only" (outlined). Both call `choose()` with the
                appropriate value. */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => choose("all")}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
              >
                {t.cookie.acceptAll}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => choose("necessary")}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                {t.cookie.necessaryOnly}
              </Button>
            </div>
          </div>
          {/* X close button — defaults to "necessary only" consent. */}
          <button
            aria-label="Close"
            onClick={() => choose("necessary")}
            className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * RouterLinkPlaceholder — a small "Learn more" link to the privacy page.
 *
 * This is a temporary stand-in for a real `RouterLink`. It uses a plain
 * `<a href="#/privacy">` so it works without needing the router context,
 * which keeps this component self-contained. When the real RouterLink is
 * consistently available, this can be swapped for it.
 *
 * Input:  `label` — the text to display (e.g. "Learn more").
 * Produces: a teal underlined link pointing to #/privacy.
 */
function RouterLinkPlaceholder({ label }: { label: string }) {
  return (
    <a href="#/privacy" className="font-medium text-teal-700 hover:underline">
      {label}
    </a>
  );
}
