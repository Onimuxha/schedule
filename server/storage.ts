import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveSchedule(userId: string, schedule: any): Promise<void>;
  getSchedule(userId: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private schedules: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.schedules = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { ...insertUser, id, password: hashedPassword };
    this.users.set(id, user);
    return user;
  }

  async saveSchedule(userId: string, schedule: any): Promise<void> {
    this.schedules.set(userId, schedule);
    console.log(`✅ Schedule saved for user ${userId}`);
  }

  async getSchedule(userId: string): Promise<any> {
    return this.schedules.get(userId) || null;
  }
}

export const storage = new MemStorage();
