import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const quizSessions = pgTable("quiz_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  answers: jsonb("answers").notNull(),
  personalityType: integer("personality_type"),
  characterName: text("character_name"),
  traits: jsonb("traits"),
  description: text("description"),
  strengths: jsonb("strengths"),
  growthAreas: jsonb("growth_areas"),
  relatedCharacters: jsonb("related_characters"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizSessionSchema = createInsertSchema(quizSessions).pick({
  sessionId: true,
  answers: true,
});

export const processQuizSchema = z.object({
  answers: z.record(z.string()),
  sessionId: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QuizSession = typeof quizSessions.$inferSelect;
export type InsertQuizSession = z.infer<typeof insertQuizSessionSchema>;
export type ProcessQuizRequest = z.infer<typeof processQuizSchema>;

export interface QuizResult {
  type: number;
  name: string;
  englishName: string;
  traits: string[];
  description: string;
  strengths: string[];
  growthAreas: string[];
  relatedCharacters: Array<{
    type: number;
    name: string;
    englishName: string;
  }>;
}
