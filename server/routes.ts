import { Router } from "express";
import { storage } from "./storage";
import { requireAuth } from "./auth";
import {
  insertUserSchema, loginSchema, insertOrderSchema,
  insertProgressSchema, insertLeaderboardSchema, insertContactSchema,
  userPreferencesSchema,
} from "../shared/schema";
import { ZodError } from "zod";

export function buildRoutes() {
  const r = Router();

  function handleError(res: any, err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "بيانات غير صالحة", details: err.flatten() });
    }
    const msg = err instanceof Error ? err.message : "خطأ غير معروف";
    console.error("[routes] error:", msg);
    return res.status(500).json({ error: msg });
  }

  // ===== Auth =====
  r.post("/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByEmail(data.email);
      if (existing) return res.status(409).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
      const user = await storage.createUser(data);
      req.session.userId = user.id;
      res.status(201).json({ user });
    } catch (e) { handleError(res, e); }
  });

  r.post("/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      if (!user) return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
      const ok = await storage.verifyPassword(data.password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
      req.session.userId = user.id;
      const { passwordHash, ...pub } = user;
      res.json({ user: pub });
    } catch (e) { handleError(res, e); }
  });

  r.post("/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });

  r.get("/auth/me", async (req, res) => {
    if (!req.session.userId) return res.json({ user: null });
    const user = await storage.getUserById(req.session.userId);
    res.json({ user: user ?? null });
  });

  // ===== Orders =====
  r.post("/orders", async (req, res) => {
    try {
      const data = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(data, req.session.userId ?? null);
      res.status(201).json({ order });
    } catch (e) { handleError(res, e); }
  });

  r.get("/orders/mine", requireAuth, async (req, res) => {
    try {
      const list = await storage.getOrdersByUser(req.session.userId!);
      res.json({ orders: list });
    } catch (e) { handleError(res, e); }
  });

  // ===== Academy progress =====
  r.post("/academy/progress", requireAuth, async (req, res) => {
    try {
      const data = insertProgressSchema.parse(req.body);
      const row = await storage.markLessonComplete(req.session.userId!, data.courseSlug, data.lessonSlug);
      res.status(201).json({ progress: row });
    } catch (e) { handleError(res, e); }
  });

  r.get("/academy/progress", requireAuth, async (req, res) => {
    try {
      const list = await storage.getProgressByUser(req.session.userId!);
      res.json({ progress: list });
    } catch (e) { handleError(res, e); }
  });

  // ===== Leaderboard =====
  r.get("/leaderboard/:gameKey", async (req, res) => {
    try {
      const list = await storage.getLeaderboardByGame(req.params.gameKey, 10);
      res.json({ entries: list });
    } catch (e) { handleError(res, e); }
  });

  r.post("/leaderboard", async (req, res) => {
    try {
      const data = insertLeaderboardSchema.parse(req.body);
      const row = await storage.saveLeaderboard(data);
      res.status(201).json({ entry: row });
    } catch (e) { handleError(res, e); }
  });

  r.delete("/leaderboard/:gameKey", async (req, res) => {
    try {
      await storage.clearLeaderboardByGame(req.params.gameKey);
      res.json({ ok: true });
    } catch (e) { handleError(res, e); }
  });

  // ===== User Preferences (auto-sync from i18n / a11y / theme) =====
  r.get("/preferences", requireAuth, async (req, res) => {
    try {
      const prefs = await storage.getUserPreferences(req.session.userId!);
      res.json({ preferences: prefs });
    } catch (e) { handleError(res, e); }
  });

  r.put("/preferences", requireAuth, async (req, res) => {
    try {
      const data = userPreferencesSchema.parse(req.body);
      const prefs = await storage.upsertUserPreferences(req.session.userId!, data);
      res.json({ preferences: prefs });
    } catch (e) { handleError(res, e); }
  });

  // ===== Health (used by self-healing client) =====
  r.get("/health", (_req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });

  // ===== Contact =====
  r.post("/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const row = await storage.createContact(data);
      res.status(201).json({ message: row });
    } catch (e) { handleError(res, e); }
  });

  return r;
}
