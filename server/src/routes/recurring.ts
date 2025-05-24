import express from "express";
import { z } from "zod";
import mongoose from "mongoose";

// Controllers
import createHandler from "../controllers/recurring/create";
import updateHandler from "../controllers/recurring/update";
import deleteHandler from "../controllers/recurring/delete";
import getHandler from "../controllers/recurring/get";
import listHandler from "../controllers/recurring/list";

// Middleware
import { validateRequestBody } from "../middleware/validationMiddleware";
import {
  ensureAuthenticated,
} from "../middleware/authMiddleware";

const router = express.Router();

router.use(ensureAuthenticated);

const objectId = z
  .string()
  .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

const typeEnum = z.enum(["income", "expense", "transfer"]);
const frequencyEnum = z.enum([
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "yearly",
]);

const paymentMethodEnum = z.enum([
  "cash",
  "credit_card",
  "debit_card",
  "bank_transfer",
  "crypto",
  "other",
]);

const recurringTransactionFieldsEnum = z.enum([
  "_id",
  "account",
  "type",
  "amount",
  "currency",
  "category",
  "subcategory",
  "description",
  "paymentMethod",
  "frequency",
  "interval",
  "startDate",
  "endDate",
  "lastRun",
  "nextRun",
  "tags",
  "notes",
  "attachments",
  "isPaused",
  "createdAt",
  "updatedAt",
]);

const attachmentSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string().optional(),
  uploadedAt: z.string().datetime().optional(),
});

// Create recurring transaction
router.post(
  "/create",
  validateRequestBody(
    z.object({
      account: objectId,
      type: typeEnum,
      amount: z.number().min(0),
      currency: z.string().trim().min(3).max(5).optional().default("USD"),
      category: z.string().trim().min(1).max(100),
      subcategory: z.string().trim().min(1).max(100).optional(),
      description: z.string().trim().max(500).optional(),
      paymentMethod: paymentMethodEnum.optional(),
      frequency: frequencyEnum,
      interval: z.number().int().min(1).default(1),
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional(),
      lastRun: z.string().datetime().optional(),
      nextRun: z.string().datetime(),
      tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
      notes: z.string().trim().max(500).optional(),
      attachments: z.array(attachmentSchema).max(5).optional(),
      isPaused: z.boolean().optional().default(false),
    }),
  ),
  createHandler,
);

// Update recurring transaction
router.post(
  "/update",
  validateRequestBody(
    z.object({
      recurringTransactionId: objectId,
      type: typeEnum.optional(),
      amount: z.number().min(0).optional(),
      currency: z.string().trim().min(3).max(5).optional(),
      category: z.string().trim().min(1).max(100).optional(),
      subcategory: z.string().trim().min(1).max(100).nullable().optional(),
      description: z.string().trim().max(500).nullable().optional(),
      paymentMethod: paymentMethodEnum.nullable().optional(),
      frequency: frequencyEnum.optional(),
      interval: z.number().int().min(1).optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().nullable().optional(),
      lastRun: z.string().datetime().nullable().optional(),
      nextRun: z.string().datetime().optional(),
      tags: z
        .array(z.string().trim().min(1).max(30))
        .max(10)
        .nullable()
        .optional(),
      notes: z.string().trim().max(500).nullable().optional(),
      attachments: z.array(attachmentSchema).max(5).nullable().optional(),
      isPaused: z.boolean().optional(),
    }),
  ),
  updateHandler,
);

// Delete recurring transaction
router.post(
  "/delete",
  validateRequestBody(
    z.object({
      recurringTransactionId: objectId,
    }),
  ),
  deleteHandler,
);

// Get recurring transactions
router.post(
  "/get",
  validateRequestBody(
    z.object({
      recurringTransactionIds: z.array(objectId).min(1).max(100),
      fields: z.array(recurringTransactionFieldsEnum).optional(),
    }),
  ),
  getHandler,
);

// List recurring transactions
router.post(
  "/list",
  validateRequestBody(
    z.object({
      page: z.number().min(0).max(1000),
      count: z.number().min(1).max(100),
      fields: z.array(recurringTransactionFieldsEnum).optional(),
      includePaused: z.boolean().optional(),
      filters: z
        .object({
          account: objectId.optional(),
          type: typeEnum.optional(),
          frequency: frequencyEnum.optional(),
          startDateStart: z.string().datetime().optional(),
          startDateEnd: z.string().datetime().optional(),
          nextRunStart: z.string().datetime().optional(),
          nextRunEnd: z.string().datetime().optional(),
        })
        .optional(),
      search: z
        .object({
          query: z.string(),
          searchIn: z.array(
            z.enum(["category", "subcategory", "description", "tags", "notes"]),
          ),
        })
        .optional(),
    }),
  ),
  listHandler,
);

export default router;
