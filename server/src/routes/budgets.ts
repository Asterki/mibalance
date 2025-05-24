import express from "express";
import { z } from "zod";
import mongoose from "mongoose";

// Controllers
import createHandler from "../controllers/budgets/create";
import updateHandler from "../controllers/budgets/update";
import deleteHandler from "../controllers/budgets/delete";
import getHandler from "../controllers/budgets/get";
import listHandler from "../controllers/budgets/list";

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

const periodEnum = z.enum(["monthly", "weekly", "yearly", "custom"]);

const budgetFieldsEnum = z.enum([
  "_id",
  "account",
  "category",
  "subcategory",
  "amount",
  "currency",
  "period",
  "startDate",
  "endDate",
  "rollover",
  "isRecurring",
  "isArchived",
  "notes",
  "tags",
  "createdAt",
  "updatedAt",
]);

// Create budget
router.post(
  "/create",
  validateRequestBody(
    z.object({
      account: objectId,
      category: z.string().trim().min(1).max(100),
      subcategory: z.string().trim().min(1).max(100).optional(),
      amount: z.number().min(0),
      currency: z.string().trim().min(3).max(5).optional().default("USD"),
      period: periodEnum,
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional(),
      rollover: z.boolean().optional().default(false),
      isRecurring: z.boolean().optional().default(true),
      isArchived: z.boolean().optional().default(false),
      notes: z.string().trim().max(500).optional(),
      tags: z.array(z.string().trim().min(1).max(30)).max(10).optional(),
    }),
  ),
  createHandler,
);

// Update budget
router.post(
  "/update",
  validateRequestBody(
    z.object({
      budgetId: objectId,
      category: z.string().trim().min(1).max(100).optional(),
      subcategory: z.string().trim().min(1).max(100).nullable().optional(),
      amount: z.number().min(0).nullable().optional(),
      currency: z.string().trim().min(3).max(5).nullable().optional(),
      period: periodEnum.nullable().optional(),
      startDate: z.string().datetime().nullable().optional(),
      endDate: z.string().datetime().nullable().optional(),
      rollover: z.boolean().nullable().optional(),
      isRecurring: z.boolean().nullable().optional(),
      isArchived: z.boolean().nullable().optional(),
      notes: z.string().trim().max(500).nullable().optional(),
      tags: z
        .array(z.string().trim().min(1).max(30))
        .max(10)
        .nullable()
        .optional(),
    }),
  ),
  updateHandler,
);

// Delete budget
router.post(
  "/delete",
  validateRequestBody(
    z.object({
      budgetId: objectId,
    }),
  ),
  deleteHandler,
);

// Get budgets
router.post(
  "/get",
  validateRequestBody(
    z.object({
      budgetIds: z.array(objectId).min(1).max(100),
      fields: z.array(budgetFieldsEnum).optional(),
    }),
  ),
  getHandler,
);

// List budgets
router.post(
  "/list",
  validateRequestBody(
    z.object({
      page: z.number().min(0).max(1000),
      count: z.number().min(1).max(100),
      fields: z.array(budgetFieldsEnum).optional(),
      includeArchived: z.boolean().optional(),
      filters: z
        .object({
          account: objectId.optional(),
          category: z.string().optional(),
          period: periodEnum.optional(),
          startDateStart: z.string().datetime().optional(),
          startDateEnd: z.string().datetime().optional(),
        })
        .optional(),
      search: z
        .object({
          query: z.string(),
          searchIn: z.array(
            z.enum(["category", "subcategory", "notes", "tags"]),
          ),
        })
        .optional(),
    }),
  ),
  listHandler,
);

export default router;
