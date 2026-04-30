/**
 * שרת קטן ל־Render (וכל הוסט שמפעיל Node) עם:
 * – /price-sheet.csv → משיכה משרת מהסביבה (כמו Netlify Functions)
 * – שאר הקבצים מ־dist/ + SPA (index.html) לנתיבי React Router
 *
 * Render: הגדירו Web Service עם Build: npm ci && npm run build, Start: node server.mjs
 * והוסיפו GOOGLE_SHEETS_PRODUCTS_CSV_URL בסביבה (וראו render.yaml דוגמה).
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT, 10) || 5173;

const CSV_UPSTREAM =
  process.env.GOOGLE_SHEETS_PRODUCTS_CSV_URL?.trim() ||
  process.env.VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL?.trim();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

function safeResolvedPath(rel) {
  const candidate = path.normalize(path.join(ROOT, rel)).replace(/\\/g, "/");
  const rootNorm = path.normalize(ROOT).replace(/\\/g, "/");
  if (!candidate.startsWith(rootNorm.endsWith("/") ? rootNorm : `${rootNorm}/`)) return null;
  return candidate.replace(/\//g, path.sep);
}

function sendBuffer(res, status, headers, buf) {
  res.writeHead(status, headers);
  res.end(buf);
}

async function servePriceSheetCsv(res) {
  if (!CSV_UPSTREAM) {
    sendBuffer(res, 503, { "Content-Type": "text/plain; charset=utf-8" }, "GOOGLE_SHEETS_PRODUCTS_CSV_URL missing");
    return;
  }
  try {
    const fr = await fetch(CSV_UPSTREAM, { headers: { Accept: "text/csv,*/*" } });
    const text = await fr.text();
    if (!fr.ok) {
      sendBuffer(res, 502, { "Content-Type": "text/plain; charset=utf-8" }, `Upstream HTTP ${fr.status}`);
      return;
    }
    const t = text.trimStart();
    if (t.startsWith("<!") || text.includes("<html")) {
      sendBuffer(res, 502, { "Content-Type": "text/plain; charset=utf-8" }, "Expected CSV, received HTML");
      return;
    }
    sendBuffer(res, 200, { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "public, max-age=60" }, text);
  } catch {
    sendBuffer(res, 502, { "Content-Type": "text/plain; charset=utf-8" }, "Failed to fetch sheet");
  }
}

function tryStatic(pathname, res) {
  const rel = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = safeResolvedPath(rel);
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const buf = fs.readFileSync(filePath);
  sendBuffer(res, 200, { "Content-Type": type }, buf);
  return true;
}

const server = http.createServer((req, res) => {
  const host = req.headers.host || "localhost";
  let pathname = "/";
  try {
    pathname = new URL(req.url || "/", `http://${host}`).pathname;
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }

  if (pathname === "/price-sheet.csv") {
    void servePriceSheetCsv(res);
    return;
  }

  if (tryStatic(pathname, res)) return;

  const indexPath = safeResolvedPath("index.html");
  if (!indexPath || !fs.existsSync(indexPath)) {
    sendBuffer(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "dist/index.html missing — run npm run build");
    return;
  }
  const buf = fs.readFileSync(indexPath);
  sendBuffer(res, 200, { "Content-Type": "text/html; charset=utf-8" }, buf);
});

server.listen(PORT, () => {
  console.log(`[royal-fruit] listening on ${PORT}, dist=${ROOT}`);
});
