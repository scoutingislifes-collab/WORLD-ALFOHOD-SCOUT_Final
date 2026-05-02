import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export function buildSessionMiddleware() {
  const PgStore = connectPg(session);
  const store = new PgStore({
    pool,
    tableName: "sessions",
    createTableIfMissing: false,
  });

  return session({
    store,
    secret: process.env.SESSION_SECRET || "cheetahs-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    },
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "غير مصرح به" });
  }
  next();
}
