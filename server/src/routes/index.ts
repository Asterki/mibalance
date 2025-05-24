import type { Express } from "express";

// Import the routers
import AuthRouter from "./auth";
import WalletRouter from "./wallets";
import RecurringRouter from "./recurring";

class Router {
  private instance: Router | null = null;

  constructor() {}

  getInstance() {
    if (!this.instance) this.instance = new Router();
    return this.instance;
  }

  public registerRoutes = (server: Express) => {
    server.use("/api/auth", AuthRouter);
    server.use("/api/wallet", WalletRouter);
    server.use("/api/recurring", RecurringRouter);
  };
}

export default Router;
