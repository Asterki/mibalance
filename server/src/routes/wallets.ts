import express from "express";
import { z } from "zod";
import mongoose from "mongoose";

// Controllers (you'll implement these)
import createHandler from "../controllers/wallets/create";
import updateHandler from "../controllers/wallets/update";
import deleteHandler from "../controllers/wallets/delete";
import getHandler from "../controllers/wallets/get";
import listHandler from "../controllers/wallets/list";

// Middleware
import { validateRequestBody } from "../middleware/validationMiddleware";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();
router.use(ensureAuthenticated);

const objectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

const walletType = z.enum(["cash", "bank", "credit", "investment", "other"]);

const commonWalletFields = {
  name: z.string().trim().min(1).max(100),
  description: z.string().max(500).optional(),
  balance: z.number().min(0),
  currency: z.string().trim().length(3), // ISO-4217 code
  type: walletType,
  institution: z.string().max(100).optional(),
  isPrimary: z.boolean().optional(),
  color: z.string().max(16).optional(),
  icon: z.string().max(64).optional(),
};

// --- Create
router.post(
  "/create",
  validateRequestBody(z.object(commonWalletFields)),
  createHandler,
);

// --- Update
router.post(
  "/update",
  validateRequestBody(
    z.object({
      walletId: objectId,
      ...Object.fromEntries(
        Object.entries(commonWalletFields).map(([k, v]) => [k, v.optional()]),
      ),
      archived: z.boolean().optional(),
    }),
  ),
  updateHandler,
);

// --- Delete
router.post(
  "/delete",
  validateRequestBody(
    z.object({
      walletId: objectId,
    }),
  ),
  deleteHandler,
);

// --- Get
router.post(
  "/get",
  validateRequestBody(
    z.object({
      walletIds: z.array(objectId).min(0).max(100),
      fields: z
        .array(
          z.enum([
            "_id",
            "name",
            "description",
            "balance",
            "currency",
            "type",
            "institution",
            "isPrimary",
            "color",
            "icon",
            "archived",
            "createdAt",
            "updatedAt",
            "deleted",
          ]),
        )
        .optional(),
    }),
  ),
  getHandler,
);

// --- List
router.post(
  "/list",
  validateRequestBody(
    z.object({
      page: z.number().min(0).max(1000),
      count: z.number().min(1).max(100),
      fields: z
        .array(
          z.enum([
            "_id",
            "name",
            "description",
            "balance",
            "currency",
            "type",
            "institution",
            "isPrimary",
            "color",
            "icon",
            "archived",
            "createdAt",
            "updatedAt",
            "deleted",
          ]),
        )
        .optional(),
      filters: z
        .object({
          type: walletType.optional(),
          currency: z.string().trim().length(3).optional(),
          isPrimary: z.boolean().optional(),
          archived: z.boolean().optional(),
        })
        .optional(),
      search: z
        .object({
          query: z.string().min(1),
          searchIn: z.array(z.enum(["name", "description", "institution"])),
        })
        .optional(),
    }),
  ),
  listHandler,
);

export default router;
