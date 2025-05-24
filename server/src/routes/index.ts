import type { Express } from "express";

// Import the routers
import AuthRouter from "./auth";

class Router {
  private instance: Router | null = null;

  constructor() {}

  getInstance() {
    if (!this.instance) this.instance = new Router();
    return this.instance;
  }

  public registerRoutes = (server: Express) => {
    server.use("/api/auth", AuthRouter);
  };
}

export default Router;
