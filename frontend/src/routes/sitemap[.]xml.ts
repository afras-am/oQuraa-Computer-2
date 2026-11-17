import { createFileRoute } from "@tanstack/react-router";
import { getSitemapPaths } from "@/lib/catalog.functions";

const STATIC = ["/", "/products", "/categories", "/brands", "/offers", "/compare", "/about", "/contact", "/services", "/warranty", "/faq", "/privacy-policy", "/terms"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        // If the API is unreachable, still serve the static pages.
        const dynamic = await getSitemapPaths()
          .then((r) => r.paths)
          .catch(() => [] as string[]);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...STATIC, ...dynamic]
          .map((p) => `  <url><loc>${origin}${p}</loc></url>`)
          .join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
