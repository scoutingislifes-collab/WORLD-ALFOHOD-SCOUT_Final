import express from "express";
import { createServer } from "http";
import { buildSessionMiddleware } from "./auth";
import { buildRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";

async function bootstrap() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.set("trust proxy", 1);

  app.use(buildSessionMiddleware());

  app.use("/api", buildRoutes());

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    next();
  });

  const server = createServer(app);

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  const port = Number(process.env.PORT) || 5000;
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    console.log(`[server] listening on http://0.0.0.0:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("[bootstrap] fatal:", err);
  process.exit(1);
});
