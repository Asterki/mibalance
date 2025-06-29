import type { Express } from "express";

// Import the routers
import AuthRouter from "./auth";
import WalletRouter from "./wallets";
import RecurringRouter from "./recurring";
import BudgetsRouter from "./budgets";
import FilesRouter from "./files";
import TransactionsRouter from "./transactions";

class Router {
  private instance: Router | null = null;

  constructor() {}

  getInstance() {
    if (!this.instance) this.instance = new Router();
    return this.instance;
  }

  public registerRoutes = (server: Express) => {
    server.use("/api/auth", AuthRouter);
    server.use("/api/wallets", WalletRouter);
    server.use("/api/recurring", RecurringRouter);
    server.use("/api/budgets", BudgetsRouter);
    server.use("/api/files", FilesRouter);
    server.use("/api/transactions", TransactionsRouter);
  };
}

export default Router;
