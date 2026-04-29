import type { Express } from "express";
import type { Server } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupVite(app: Express, server: Server) {
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteLogger = createLogger();

  const vite = await createViteServer({
    configFile: path.resolve(__dirname, "..", "vite.config.ts"),
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true as const,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api/")) return next();
    try {
      const indexPath = path.resolve(__dirname, "..", "index.html");
      let template = fs.readFileSync(indexPath, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export async function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist");
  if (!fs.existsSync(distPath)) {
    throw new Error(`Build directory not found: ${distPath}. Run npm run build first.`);
  }
  const express = (await import("express")).default;

  // Hashed assets in /assets/* are immutable — cache for a year.
  app.use(
    "/assets",
    express.static(path.join(distPath, "assets"), {
      immutable: true,
      maxAge: "365d",
      etag: false,
    }),
  );

  // Service worker + manifest must always be revalidated so updates ship fast.
  app.get(["/sw.js", "/manifest.webmanifest"], (_req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    next();
  });

  // Other public files (icons, locale json, favicon) — modest caching.
  app.use(
    express.static(distPath, {
      maxAge: "1d",
      etag: true,
    }),
  );

  app.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) return next();
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
