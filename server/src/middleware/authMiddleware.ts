// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";

const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isUnauthenticated() || !req.user) {
    res.status(401).send({ status: "unauthenticated" });
  } else {
    next();
  }
};

const ensurePermissions =
  (permission: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  };

export { ensureAuthenticated, ensurePermissions };
