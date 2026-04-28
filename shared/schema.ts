import { pgTable, serial, text, varchar, integer, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("student"),
  age: integer("age"),
  city: varchar("city", { length: 120 }),
  emailVerified: integer("email_verified").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull(),
}, (table) => ({
  expireIdx: index("IDX_session_expire").on(table.expire),
}));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  address: text("address").notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  total: integer("total").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productSlug: varchar("product_slug", { length: 200 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  image: text("image"),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  size: varchar("size", { length: 50 }),
  color: varchar("color", { length: 50 }),
});

export const academyProgress = pgTable("academy_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseSlug: varchar("course_slug", { length: 200 }).notNull(),
  lessonSlug: varchar("lesson_slug", { length: 200 }).notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
}, (table) => ({
  uniq: uniqueIndex("academy_progress_user_lesson_uniq").on(table.userId, table.courseSlug, table.lessonSlug),
}));

export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  gameKey: varchar("game_key", { length: 50 }).notNull(),
  playerName: varchar("player_name", { length: 80 }).notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  gameIdx: index("leaderboard_game_idx").on(table.gameKey, table.score),
}));

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  emailVerified: true,
  passwordHash: true,
}).extend({
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PublicUser = Omit<User, "passwordHash">;

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const insertOrderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  items: z.array(z.object({
    productSlug: z.string(),
    productName: z.string(),
    image: z.string().nullable().optional(),
    price: z.number().int().nonnegative(),
    quantity: z.number().int().positive(),
    size: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
  })).min(1),
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type OrderWithItems = Order & { items: OrderItem[] };

export const insertProgressSchema = createInsertSchema(academyProgress).omit({
  id: true,
  completedAt: true,
  userId: true,
});
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof academyProgress.$inferSelect;

export const insertLeaderboardSchema = createInsertSchema(leaderboardEntries).omit({
  id: true,
  createdAt: true,
}).extend({
  playerName: z.string().min(1).max(80),
  score: z.number().int(),
});
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;

export const insertContactSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(5),
});
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
