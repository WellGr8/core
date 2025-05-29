import { users, quizSessions, type User, type InsertUser, type QuizSession, type InsertQuizSession, type QuizResult } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;
  getQuizSession(sessionId: string): Promise<QuizSession | undefined>;
  updateQuizSession(sessionId: string, result: QuizResult): Promise<QuizSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const [session] = await db
      .insert(quizSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getQuizSession(sessionId: string): Promise<QuizSession | undefined> {
    const [session] = await db
      .select()
      .from(quizSessions)
      .where(eq(quizSessions.sessionId, sessionId));
    return session || undefined;
  }

  async updateQuizSession(sessionId: string, result: QuizResult): Promise<QuizSession | undefined> {
    const [session] = await db
      .update(quizSessions)
      .set({ 
        personalityType: result.type,
        characterName: result.name,
        traits: result.traits as any,
        description: result.description,
        strengths: result.strengths as any,
        growthAreas: result.growthAreas as any,
        relatedCharacters: result.relatedCharacters as any,
      })
      .where(eq(quizSessions.sessionId, sessionId))
      .returning();
    return session || undefined;
  }
}

export const storage = new DatabaseStorage();
