/**
 * Express + MongoDB API and optional static SPA (after `npm run build`).
 * Dev: run with Vite (`npm run dev`) — UI proxies `/api` here.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createApiRouter } from "./apiRoutes.js";
import { getDb, ensureIndexes } from "./db/mongodb.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

function loadEnv() {
  const candidates = [
    path.join(process.cwd(), ".env"),
    path.join(process.cwd(), ".env.local"),
    path.join(projectRoot, ".env"),
    path.join(projectRoot, ".env.local"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      return;
    }
  }
  dotenv.config();
}
loadEnv();
const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

app.use("/api", createApiRouter());

const distDir = path.join(__dirname, "..", "dist");
const distReady = fs.existsSync(path.join(distDir, "index.html"));

if (distReady) {
  app.use(express.static(distDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(path.join(distDir, "index.html"), (err) => {
      if (err) next(err);
    });
  });
} else {
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.status(503).send("Run npm run build first, or use npm run dev (Vite + API).");
  });
}

async function start() {
  try {
    const db = await getDb();
    await ensureIndexes(db);
    console.log("MongoDB connected, indexes ensured.");
  } catch (e) {
    console.error("MongoDB startup failed — fix MONGODB_URI / network / Atlas IP allowlist:", e.message || e);
  }

  app.listen(PORT, () => {
    console.log(`API: http://127.0.0.1:${PORT}/api/health`);
  });
}

start();
