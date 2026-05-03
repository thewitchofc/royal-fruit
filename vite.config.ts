import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllSeoPaths } from "./src/lib/seoRoutes";
import { normalizeSiteUrlFromEnv, SITE_OG_IMAGE_PATH, SITE_URL_BUILD_PLACEHOLDER } from "./src/lib/siteConfig";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = normalizeSiteUrlFromEnv(env.VITE_SITE_URL);
  const ogImageAbs = `${siteUrl}${SITE_OG_IMAGE_PATH}`;

  const sheetsProxy = {
    "/google-sheet-csv": {
      target: "https://docs.google.com",
      changeOrigin: true,
      secure: true,
      rewrite: (path: string) => path.replace(/^\/google-sheet-csv/, "") || "/",
    },
  };

  function priceSheetMiddleware(
    req: { url?: string },
    res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (chunk?: string) => void },
    next: () => void,
  ) {
    const raw = req.url ?? "";
    const pathOnly = raw.split("?")[0] ?? "";
    if (pathOnly !== "/price-sheet.csv") {
      next();
      return;
    }
    const csvUrl =
      env.GOOGLE_SHEETS_PRODUCTS_CSV_URL?.trim() || env.VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL?.trim();
    if (!csvUrl) {
      res.statusCode = 503;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(
        "המחירון לא הוגדר: הוסיפו GOOGLE_SHEETS_PRODUCTS_CSV_URL (או VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL) ב-.env ו-VITE_PRICE_SHEET_VIA_PROXY=1",
      );
      return;
    }
    void fetch(csvUrl, { headers: { Accept: "text/csv,*/*" } })
      .then(async (r) => {
        const text = await r.text();
        if (!r.ok) {
          res.statusCode = r.status;
          res.end(text.slice(0, 600));
          return;
        }
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.statusCode = 200;
        res.end(text);
      })
      .catch(() => {
        res.statusCode = 502;
        res.end("שגיאה בטעינת הגיליון");
      });
  }

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (id.includes("react-router")) return "vendor-router";
            if (id.includes("react-dom")) return "vendor-react-dom";
            if (id.includes("/react/") || id.endsWith("node_modules/react/index.js")) return "vendor-react";
          },
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      include: ["src/**/*.test.{ts,tsx}"],
    },
    server: {
      proxy: sheetsProxy,
    },
    preview: {
      proxy: sheetsProxy,
    },
    plugins: [
      react(),
      {
        name: "price-sheet-dev-proxy",
        configureServer(server) {
          server.middlewares.use(priceSheetMiddleware);
        },
        configurePreviewServer(server) {
          server.middlewares.use(priceSheetMiddleware);
        },
      },
      {
        name: "seo-robots-sitemap",
        buildStart() {
          if (mode === "production" && !env.VITE_SITE_URL?.trim()) {
            console.warn(
              `\n[Vite][SEO] VITE_SITE_URL חסר בבניית production. נעשה שימוש ב־${SITE_URL_BUILD_PLACEHOLDER} ל־sitemap/robots ולמטא ב־index.html — הגדירו VITE_SITE_URL בפריסה (למשל ב-Netlify).\n`,
            );
          }
        },
        transformIndexHtml(html) {
          const canonical = `${siteUrl}/`;
          const extra = `\n    <link rel="canonical" href="${escapeXml(canonical)}" />\n    <meta property="og:image" content="${escapeXml(ogImageAbs)}" />\n    <meta name="twitter:image" content="${escapeXml(ogImageAbs)}" />\n`;
          return html.replace("</head>", `${extra}  </head>`);
        },
        closeBundle() {
          const paths = getAllSeoPaths();
          const urls = paths.map((p) => {
            const locRaw = p === "/" ? `${siteUrl}/` : `${siteUrl}${p}`;
            const loc = escapeXml(locRaw);
            const priority =
              p === "/"
                ? "1.0"
                : p === "/privacy" || p === "/accessibility"
                  ? "0.35"
                  : "0.85";
            return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
          });
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
          const outDir = resolve(__dirname, "dist");
          writeFileSync(resolve(outDir, "sitemap.xml"), sitemap, "utf8");
          writeFileSync(
            resolve(outDir, "robots.txt"),
            [
              "User-agent: *",
              "Allow: /",
              "",
              "User-agent: facebookexternalhit",
              "Allow: /",
              "",
              "User-agent: Facebot",
              "Allow: /",
              "",
              `Sitemap: ${siteUrl}/sitemap.xml`,
              "",
            ].join("\n"),
            "utf8",
          );
        },
      },
    ],
  };
});
