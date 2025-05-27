import express from "express";
import { z } from "zod";
import mongoose from "mongoose";

// Controllers
import createHandler from "../controllers/transactions/create";
// import updateHandler from "../controllers/transactions/update";
import deleteHandler from "../controllers/transactions/delete";
import getHandler from "../controllers/transactions/get";
import listHandler from "../controllers/transactions/list";

// Middleware
import { validateRequestBody } from "../middleware/validationMiddleware";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.use(ensureAuthenticated);

const objectId = z
  .string()
  .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

const typeEnum = z.enum(["income", "expense", "transfer"]);
const paymentMethodEnum = z.enum([
  "cash",
  "credit_card",
  "debit_card",
  "bank_transfer",
  "crypto",
  "other",
]);

const transactionFieldsEnum = z.enum([
  "_id",
  "account",
  "wallet",
  "type",
  "amount",
  "currency",
  "category",
  "subcategory",
  "date",
  "description",
  "paymentMethod",
  "isRecurring",
  "recurrence",
  "tags",
  "deleted",
  "notes",
  "attachments",
  "createdAt",
  "updatedAt",
]);

const recurrenceSchema = z
  .object({
    frequency: z.enum([
      "daily",
      "weekly",
      "biweekly",
      "monthly",
      "quarterly",
      "yearly",
    ]),
    endDate: z.string().datetime().optional(),
    interval: z.number().int().min(1).default(1),
  })
  .optional();

const attachmentSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string().optional(),
  uploadedAt: z.string().datetime().optional(),
});

// Create transaction
router.post(
  "/create",
  validateRequestBody(
    z.object({
      walletId: objectId,
      type: typeEnum,
      amount: z.number().min(0),
      currency: z.string().trim().min(3).max(5).optional().default("USD"),
      category: z.string().trim().min(1).max(100),
      subcategory: z.string().trim().min(1).max(100).optional(),
      date: z.string().datetime(),
      description: z.string().trim().max(500).optional(),
      paymentMethod: paymentMethodEnum.optional(),
      isRecurring: z.boolean().optional().default(false),
      recurrence: recurrenceSchema,
      tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
      isCleared: z.boolean().optional().default(true),
      notes: z.string().trim().max(500).optional(),
      attachments: z.array(attachmentSchema).max(5).optional(),
    }),
  ),
  createHandler,
);

// Update transaction
router.post(
  "/update",
  validateRequestBody(
    z.object({
      transactionId: objectId,
      type: typeEnum.optional(),
      amount: z.number().min(0).optional(),
      currency: z.string().trim().min(3).max(5).optional(),
      category: z.string().trim().min(1).max(100).optional(),
      subcategory: z.string().trim().min(1).max(100).nullable().optional(),
      date: z.string().datetime().optional(),
      description: z.string().trim().max(500).nullable().optional(),
      paymentMethod: paymentMethodEnum.nullable().optional(),
      isRecurring: z.boolean().optional(),
      recurrence: recurrenceSchema,
      tags: z
        .array(z.string().trim().min(1).max(30))
        .max(10)
        .nullable()
        .optional(),
      isCleared: z.boolean().optional(),
      notes: z.string().trim().max(500).nullable().optional(),
      attachments: z.array(attachmentSchema).max(5).nullable().optional(),
    }),
  ),
  // updateHandler,
);

// Delete transaction
router.post(
  "/delete",
  validateRequestBody(
    z.object({
      transactionId: objectId,
    }),
  ),
  deleteHandler,
);

// Get transactions
router.post(
  "/get",
  validateRequestBody(
    z.object({
      transactionIds: z.array(objectId).min(1).max(100),
      fields: z.array(transactionFieldsEnum).optional(),
    }),
  ),
  getHandler,
);

// List transactions
router.post(
  "/list",
  validateRequestBody(
    z.object({
      page: z.number().min(0).max(1000),
      count: z.number().min(1).max(100),
      fields: z.array(transactionFieldsEnum).optional(),
      includeCleared: z.boolean().optional(),
      filters: z
        .object({
          account: objectId.optional(),
          type: typeEnum.optional(),
          category: z.string().trim().optional(),
          dateStart: z.string().datetime().optional(),
          dateEnd: z.string().datetime().optional(),
          amountMin: z.number().min(0).optional(),
          amountMax: z.number().min(0).optional(),
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
