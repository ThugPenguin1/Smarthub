import type { NextConfig } from "next";

/**
 * ============================================================================
 * NEXT.JS CONFIGURATION
 * ============================================================================
 * This file configures how Next.js builds and runs the project.
 *
 * For Vercel deployment:
 *   - No `output: "standalone"` needed (Vercel handles deployment itself)
 *   - Vercel auto-detects Next.js and runs `next build` automatically
 *
 * For local development:
 *   - `bun run dev` starts the dev server on port 3000
 * ============================================================================
 */
const nextConfig: NextConfig = {
  // Vercel doesn't need `output: "standalone"` — it handles builds natively.
  // If deploying to a custom server (Docker, VPS), uncomment the line below:
  // output: "standalone",

  // Skip TypeScript errors during build (we run `bun run lint` separately).
  // Set to `false` for stricter production builds.
  typescript: {
    ignoreBuildErrors: true,
  },

  // React Strict Mode double-renders components in dev to catch bugs.
  // Turn off for less console noise during development.
  reactStrictMode: false,

  // Domains allowed to make cross-origin requests to the dev server.
  // Harmless on Vercel — only affects local dev.
  allowedDevOrigins: ["*.space-z.ai"],

  // Next.js Image optimization settings
  images: {
    // Serve modern formats (smaller files, faster loads)
    formats: ["image/avif", "image/webp"],
    // Whitelist of external image domains that Next.js Image can optimize.
    // To add a new image source, add its hostname here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      // Add your own image CDN here when you replace the Unsplash placeholders:
      // { protocol: "https", hostname: "smarthubc.com" },
    ],
  },
};

export default nextConfig;
