import express, { Express } from "express";
import { createServer } from "http";
import path from "path";
import cors from "cors";
import cookie from "cookie-parser";
import dotenv from "dotenv";

// Load env vars early
dotenv.config();
const envFile =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Services
import Router from "./routes";
import SessionsService from "./services/sessions";
import MongoDBClient from "./config/mongodb";

class Server {
  private static instance: Server | null = null;

  app: Express;
  httpServer: ReturnType<typeof createServer>;
  port: number;
  dev: boolean;

  sessions: SessionsService;
  router: Router;

  private constructor(dev: boolean, port: number) {
    this.dev = dev;
    this.port = port;

    this.app = express();
    this.httpServer = createServer(this.app);

    this.checkEnv();
    this.sessions = SessionsService.prototype.getInstance();
    this.router = Router.prototype.getInstance();
  }

  public static getInstance(): Server {
    if (!this.instance)
      this.instance = new Server(process.env.NODE_ENV !== "production", 3000);
    return this.instance;
  }

  public async startServer(): Promise<void> {
    this.loadMiddlewares();
    this.sessions.loadToServer(this.app);
    this.router.registerRoutes(this.app);

    new MongoDBClient(process.env.MONGODB_URI as string).connect();

    this.httpServer.listen(this.port, () => {
      console.log(`[Server] Listening on port ${this.port}`);
    });
  }

  private checkEnv(): void {
    const requiredEnv = [
      "SESSION_SECRET",
      "SESSION_COLLECTION_NAME",
      "MONGODB_URI",
      "EMAIL_HOST",
      "EMAIL_PORT",
      "EMAIL_SECURE",
      "EMAIL_FROM",
      "EMAIL_USER",
      "EMAIL_PASS",
      "FRONT_END_ORIGIN",
    ];

    // Console log all the .env variables for debugging purposes
    console.log("[ENV] Loaded variables:", requiredEnv.join(", "));
    // Check if all required env variables are set
    // and log them to the console
    requiredEnv.forEach((key) => {
      if (!process.env[key]) {
        console.error(`[ENV ERROR] Missing variable: ${key}`);
      }
    });

    const missing = requiredEnv.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      console.error(
        "[ENV ERROR] Missing required variables:",
        missing.join(", "),
      );
      process.exit(1);
    }
  }

  private loadMiddlewares(): void {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(cookie(process.env.SESSION_SECRET as string));
    this.app.use(
      "/uploads/",
      express.static(path.join(__dirname, "../uploads")),
    );

    if (this.dev) {
      this.app.use(
        cors({
          origin: process.env.FRONT_END_ORIGIN,
          credentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      );
    } else {
      console.log(`[Server] Serving static files in production`);

      const clientPath = path.join(__dirname, "../web-client-dist");
      this.app.use(express.static(clientPath));

      this.app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api/")) return next();
        res.sendFile(path.join(clientPath, "index.html"));
      });
    }
  }
}

const server = Server.getInstance();
server.startServer();

export default Server;
