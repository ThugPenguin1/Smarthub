# Guide: next.config.ts

## What is this file?
`next.config.ts` is the **main configuration file for Next.js**. It tells Next.js how to build, run, and optimize your project. Every Next.js project has one.

## What does each setting do?

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai"],
  images: { ... },
};
```

| Setting | What it does | Why it's set this way |
|---|---|---|
| `output: "standalone"` | Tells Next.js to bundle everything into a standalone server. The `bun run build` script uses this to create a deployable `.next/standalone/` folder. | Required for production deployment in this sandbox. |
| `typescript.ignoreBuildErrors: true` | Skips TypeScript type-checking during `next build`. The build won't fail even if there are type errors. | Speeds up builds during development. You should still run `bun run lint` separately to catch issues. |
| `reactStrictMode: false` | Turns off React Strict Mode. Strict Mode double-renders components in development to catch bugs. | Turned off here because it can cause double-execution of effects which is annoying during development. |
| `allowedDevOrigins: ["*.space-z.ai"]` | Allows the dev server to accept requests from `*.space-z.ai` domains (the preview gateway). | Without this, you get a warning in the dev log about cross-origin requests from the preview panel. |
| `images.formats: ["image/avif", "image/webp"]` | Tells Next.js Image to serve AVIF and WebP formats (modern, smaller image formats). | AVIF/WebP are 30-50% smaller than JPEG/PNG. Browsers that support them get smaller images. |
| `images.remotePatterns: [...]` | Whitelist of external image domains that Next.js Image is allowed to optimize. | We use Unsplash images (`images.unsplash.com` and `plus.unsplash.com`). Without this whitelist, Next.js Image would refuse to load them. |

## The images section explained
```typescript
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "plus.unsplash.com" },
  ],
}
```
When you use `<Image src="https://images.unsplash.com/..." />`, Next.js:
1. Checks if `images.unsplash.com` is in `remotePatterns` (it is)
2. Downloads the image from Unsplash
3. Converts it to AVIF or WebP
4. Serves the optimized version from your own domain
5. Caches it so subsequent loads are fast

**If you add images from a new domain** (e.g. your own S3 bucket), you MUST add the hostname here or the images won't load.

## When would you edit this file?
- **Adding a new image domain**: Add it to `remotePatterns`
- **Enabling strict mode**: Change `reactStrictMode` to `true` for production
- **Adding headers/redirects/rewrites**: Add `headers()`, `redirects()`, or `rewrites()` functions

## Common beginner questions

**Q: Why does the build ignore TypeScript errors?**
A: Because during rapid development, type errors shouldn't block your build. You should still run `bun run lint` to catch them. For a real production deploy, consider setting `ignoreBuildErrors: false`.

**Q: What happens if I use an image from a domain not in remotePatterns?**
A: The `<Image>` component will throw an error. Either add the domain to `remotePatterns`, or use a regular `<img>` tag (which bypasses optimization).

**Q: What is "standalone" output?**
A: It bundles your app + dependencies into a single folder (`.next/standalone/`) that can be deployed without installing node_modules on the server. The `bun run start` script runs this standalone server.
