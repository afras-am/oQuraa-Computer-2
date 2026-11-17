import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { catalogRouter } from "./routes/catalog.routes";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");

  const origins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  // Browsers call the API directly, so the frontend origin must be allowed.
  app.use(cors({ origin: origins, methods: ["GET"] }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/api/v1", catalogRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
      res.status(400).json({ error: "Invalid request", issues: err.issues });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  };
  app.use(onError);

  return app;
}
