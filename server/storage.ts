import { db, pool } from "./db";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  users, orders, orderItems, academyProgress, leaderboardEntries, contactMessages, userPreferences,
  type User, type InsertUser, type PublicUser,
  type Order, type OrderItem, type InsertOrder, type OrderWithItems,
  type Progress, type InsertProgress,
  type LeaderboardEntry, type InsertLeaderboard,
  type ContactMessage, type InsertContact,
  type UserPreferences, type UserPreferencesInput,
} from "../shared/schema";
import bcrypt from "bcryptjs";

function toPublic(u: User): PublicUser {
  const { passwordHash, ...rest } = u;
  return rest;
}

export interface IStorage {
  createUser(input: InsertUser): Promise<PublicUser>;
  getUserById(id: number): Promise<PublicUser | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  verifyPassword(plain: string, hash: string): Promise<boolean>;

  createOrder(input: InsertOrder, userId: number | null): Promise<OrderWithItems>;
  getOrdersByUser(userId: number): Promise<OrderWithItems[]>;

  markLessonComplete(userId: number, courseSlug: string, lessonSlug: string): Promise<Progress>;
  getProgressByUser(userId: number): Promise<Progress[]>;

  saveLeaderboard(input: InsertLeaderboard): Promise<LeaderboardEntry>;
  getLeaderboardByGame(gameKey: string, limit?: number): Promise<LeaderboardEntry[]>;
  clearLeaderboardByGame(gameKey: string): Promise<void>;

  createContact(input: InsertContact): Promise<ContactMessage>;

  getUserPreferences(userId: number): Promise<UserPreferences>;
  upsertUserPreferences(userId: number, patch: UserPreferencesInput): Promise<UserPreferences>;
}

class DbStorage implements IStorage {
  async createUser(input: InsertUser): Promise<PublicUser> {
    const passwordHash = await bcrypt.hash(input.password, 10);
    const [row] = await db.insert(users).values({
      email: input.email.toLowerCase().trim(),
      fullName: input.fullName,
      passwordHash,
      role: input.role ?? "student",
      age: input.age ?? null,
      city: input.city ?? null,
    }).returning();
    return toPublic(row);
  }

  async getUserById(id: number): Promise<PublicUser | undefined> {
    const [row] = await db.select().from(users).where(eq(users.id, id));
    return row ? toPublic(row) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [row] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
    return row;
  }

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async createOrder(input: InsertOrder, userId: number | null): Promise<OrderWithItems> {
    const total = input.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const [order] = await db.insert(orders).values({
      userId: userId ?? null,
      customerName: input.customerName,
      email: input.email.toLowerCase().trim(),
      phone: input.phone ?? null,
      address: input.address,
      city: input.city,
      country: input.country,
      total,
    }).returning();

    const inserted = await db.insert(orderItems).values(
      input.items.map(it => ({
        orderId: order.id,
        productSlug: it.productSlug,
        productName: it.productName,
        image: it.image ?? null,
        price: it.price,
        quantity: it.quantity,
        size: it.size ?? null,
        color: it.color ?? null,
      }))
    ).returning();

    return { ...order, items: inserted };
  }

  async getOrdersByUser(userId: number): Promise<OrderWithItems[]> {
    const rows = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    if (rows.length === 0) return [];
    const ids = rows.map(r => r.id);
    const items = await db.select().from(orderItems).where(sql`${orderItems.orderId} IN (${sql.join(ids.map(i => sql`${i}`), sql`, `)})`);
    return rows.map(o => ({ ...o, items: items.filter(i => i.orderId === o.id) }));
  }

  async markLessonComplete(userId: number, courseSlug: string, lessonSlug: string): Promise<Progress> {
    const [row] = await db.insert(academyProgress).values({
      userId, courseSlug, lessonSlug,
    }).onConflictDoUpdate({
      target: [academyProgress.userId, academyProgress.courseSlug, academyProgress.lessonSlug],
      set: { completedAt: sql`NOW()` },
    }).returning();
    return row;
  }

  async getProgressByUser(userId: number): Promise<Progress[]> {
    return db.select().from(academyProgress).where(eq(academyProgress.userId, userId));
  }

  async saveLeaderboard(input: InsertLeaderboard): Promise<LeaderboardEntry> {
    const [row] = await db.insert(leaderboardEntries).values(input).returning();
    return row;
  }

  async getLeaderboardByGame(gameKey: string, limit = 10): Promise<LeaderboardEntry[]> {
    return db.select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.gameKey, gameKey))
      .orderBy(desc(leaderboardEntries.score), desc(leaderboardEntries.createdAt))
      .limit(limit);
  }

  async clearLeaderboardByGame(gameKey: string): Promise<void> {
    await db.delete(leaderboardEntries).where(eq(leaderboardEntries.gameKey, gameKey));
  }

  async createContact(input: InsertContact): Promise<ContactMessage> {
    const [row] = await db.insert(contactMessages).values(input).returning();
    return row;
  }

  async getUserPreferences(userId: number): Promise<UserPreferences> {
    const [row] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    if (row) return row;
    const [created] = await db
      .insert(userPreferences)
      .values({ userId })
      .onConflictDoNothing({ target: userPreferences.userId })
      .returning();
    if (created) return created;
    const [again] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return again;
  }

  async upsertUserPreferences(userId: number, patch: UserPreferencesInput): Promise<UserPreferences> {
    const next: Record<string, unknown> = { userId, updatedAt: sql`NOW()` };
    if (patch.language !== undefined) next.language = patch.language;
    if (patch.signLanguageMode !== undefined) {
      next.signLanguageMode = typeof patch.signLanguageMode === "boolean"
        ? (patch.signLanguageMode ? 1 : 0)
        : patch.signLanguageMode;
    }
    if (patch.theme !== undefined) next.theme = patch.theme;

    const updateSet: Record<string, unknown> = { updatedAt: sql`NOW()` };
    for (const k of ["language", "signLanguageMode", "theme"] as const) {
      if (k in next) updateSet[k] = next[k];
    }

    const [row] = await db
      .insert(userPreferences)
      .values(next as any)
      .onConflictDoUpdate({ target: userPreferences.userId, set: updateSet })
      .returning();
    return row;
  }
}

export const storage: IStorage = new DbStorage();
export { pool };
