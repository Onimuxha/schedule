import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "63741840038ce4029a53f48e673f05c0fb43f250eb82fec65e995159c995b0569e5af40da965bbb3101d60c55fd71213432b9936ed2ea093069bb2cf09eed5d2";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Middleware to verify token
const verifyToken = (req: Request, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Ensure decoded is an object (JwtPayload) before accessing id
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      req.userId = (decoded as any).id;
      next();
    } else {
      res.status(401).json({ error: "Invalid token payload" });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res, next) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  // Register user
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }

      // Create new user
      const user = await storage.createUser({ username, password });
      res.status(201).json({ message: "User created", user });
    } catch (error) {
      next(error);
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ message: "Login successful", token, userId: user.id });
    } catch (error) {
      next(error);
    }
  });

  // Push notifications subscribe
  app.post("/api/notifications/subscribe", async (req, res, next) => {
    try {
      const subscription = req.body;

      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: "Invalid subscription" });
      }

      console.log("✅ Push subscription received:", subscription.endpoint);
      // TODO: Save to database
      res.status(201).json({ message: "Subscribed to notifications" });
    } catch (error) {
      next(error);
    }
  });

  // Send notification
  app.post("/api/notifications/send", async (req, res, next) => {
    try {
      const { title, body } = req.body;

      if (!title || !body) {
        return res.status(400).json({ error: "Title and body required" });
      }

      console.log(`✅ Sending notification: ${title}`);
      // TODO: Use web-push to send
      res.json({ message: "Notification sent" });
    } catch (error) {
      next(error);
    }
  });

  // Save schedule (protected route)
  app.post("/api/schedule/save", verifyToken, async (req: Request, res, next) => {
    try {
      const { schedule } = req.body;
      await storage.saveSchedule(req.userId!, schedule);
      res.json({ message: "Schedule saved" });
    } catch (error) {
      next(error);
    }
  });

  // Get schedule (protected route)
  app.get("/api/schedule", verifyToken, async (req: Request, res, next) => {
    try {
      const schedule = await storage.getSchedule(req.userId!);
      res.json({ schedule });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
