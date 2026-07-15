"use client";

/**
 * ============================================================================
 * FILE: language-switcher.tsx — Language Dropdown
 * ============================================================================
 * WHAT IT IS:
 *   A small dropdown button that lets the user switch the site language
 *   between English (EN), Traditional Chinese (繁), and Simplified
 *   Chinese (简).
 *
 * WHAT IT DOES:
 *   - Renders a pill-shaped trigger button with a globe icon and the
 *     current language's short code (EN / 繁 / 简).
 *   - On click, opens a dropdown menu listing all three languages.
 *   - The currently-active language has a teal check mark next to it.
 *   - Clicking a language calls `setLang()` from the lang context, which:
 *       1. Updates the global language state.
 *       2. Persists the choice to localStorage.
 *       3. Triggers a re-render of every component that reads `t`.
 *
 * HOW IT FITS IN:
 *   Used inside the navbar (desktop + mobile). Could also be reused in
 *   the footer or other locations. Uses the shadcn/ui DropdownMenu
 *   primitive for accessibility-correct behaviour (keyboard nav, focus
 *   management, click-outside-to-close, etc.).
 * ============================================================================
 */

import { useLang } from "@/lib/i18n/lang-context";
import { LANGS, Lang } from "@/lib/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

/**
 * LanguageSwitcher — the language dropdown component.
 *
 * Inputs (props):
 *   - compact?: boolean — currently unused (kept for future variants).
 *
 * Produces: a pill button with globe icon + current short code, that
 * opens a dropdown with the three languages (English / 繁體中文 / 简体中文).
 * Selecting a language updates the global lang context.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  // Pull `lang` (the current language code) and `setLang` (the setter
  // that updates the global state + persists to localStorage) from the
  // language context.
  const { lang, setLang } = useLang();
  // Find the LANGS entry that matches the current language. Falls back
  // to LANGS[0] (English) if no match — defensive coding.
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  // DropdownMenu is a shadcn/ui primitive that handles:
  //   - open/close state
  //   - keyboard navigation (arrow keys, escape)
  //   - focus management (restores focus to trigger on close)
  //   - click-outside-to-close
  //   - correct ARIA roles for screen readers
  // We just compose its sub-components together.
  return (
    <DropdownMenu>
      {/* Trigger: a pill button with globe icon + current short code.
          `asChild` lets us use our own <button> instead of the default. */}
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Switch language"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/40"
        >
          <Globe className="h-3.5 w-3.5" />
          {/* The short code: "EN", "繁", or "简" */}
          <span>{current.short}</span>
        </button>
      </DropdownMenuTrigger>
      {/* The dropdown panel. `align="end"` makes it open from the right
          edge of the trigger (so it doesn't overflow the viewport). */}
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {/* Map over the LANGS array (defined in translations.ts) to
            render one item per language. */}
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            // Cast the code string to the Lang union type. Calling
            // setLang updates the global state, which causes every
            // component that reads `t` to re-render in the new language.
            onClick={() => setLang(l.code as Lang)}
            className="cursor-pointer justify-between"
          >
            {/* Full label: "English", "繁體中文", or "简体中文" */}
            <span>{l.label}</span>
            {/* Show a teal check mark next to the currently-active
                language so the user can see which one is selected. */}
            {l.code === lang && <Check className="h-3.5 w-3.5 text-teal-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
