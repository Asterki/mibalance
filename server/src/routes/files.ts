import express from "express";
import { z } from "zod";
import mongoose from "mongoose";

// Controllers
import uploadHandler from "../controllers/files/upload";
import deleteHandler from "../controllers/files/delete";
import getHandler from "../controllers/files/get";
import listHandler from "../controllers/files/list";
import updateHandler from "../controllers/files/update";

// Middleware
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { validateRequestBody } from "../middleware/validationMiddleware";

const router = express.Router();
router.use(ensureAuthenticated);

const objectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

const visibilityEnum = z.enum(["private", "shared", "public"]);

const searchableFields = z.enum(["name", "description", "tags"]);

const fileFieldsEnum = z.enum([
  "_id",
  "owner",
  "sharedWith",
  "visibility",
  "name",
  "size",
  "type",
  "mimeType",
  "hash",
  "version",
  "filePath",
  "description",
  "tags",
  "isDeleted",
  "deletedAt",
  "uploadedAt",
  "updatedAt",
]);

// Upload File validation schema (req.body except the actual file handled in handler)
const uploadSchema = z.object({
  description: z.string().max(1000).optional(),
  tags: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const parsed = JSON.parse(val);
          return (
            Array.isArray(parsed) &&
            parsed.every((tag) => typeof tag === "string")
          );
        } catch {
          return false;
        }
      },
      { message: "Tags must be a JSON array of strings" },
    ),
  visibility: visibilityEnum.optional(),
});

// --- Upload File ---
router.post("/upload", validateRequestBody(uploadSchema), uploadHandler);

// --- Delete File ---
router.post(
  "/delete",
  validateRequestBody(
    z.object({
      fileId: objectId,
    }),
  ),
  deleteHandler,
);

// --- Get Files ---
router.post(
  "/get",
  validateRequestBody(
    z.object({
      fileIds: z.array(objectId).min(1).max(100),
      fields: z.array(fileFieldsEnum).optional(),
    }),
  ),
  getHandler,
);

// --- List Files ---
router.post(
  "/list",
  validateRequestBody(
    z
      .object({
        page: z.number().min(0).max(1000),
        count: z.number().min(1).max(100),
        fields: z.array(fileFieldsEnum).optional(),
        includeDeleted: z.boolean().optional(),
        filters: z
          .object({
            owner: objectId.optional(),
            visibility: visibilityEnum.optional(),
            type: z.string().optional(),
            tags: z.array(z.string()).optional(),
            uploadedAfter: z.string().datetime().optional(),
            uploadedBefore: z.string().datetime().optional(),
          })
          .optional(),
        search: z
          .object({
            query: z.string(),
            searchIn: z.array(searchableFields),
          })
          .optional(),
      })
      .strict(),
  ),
  listHandler,
);

// --- Update File ---
router.post(
  "/update",
  validateRequestBody(
    z
      .object({
        fileId: objectId,
        description: z.string().max(1000).nullable().optional(),
        tags: z.array(z.string().min(1).max(30)).nullable().optional(),
        visibility: z
          .enum(["private", "shared", "public"])
          .nullable()
          .optional(),
        name: z.string().min(1).max(255).nullable().optional(),
      })
      .strict(),
  ),
  updateHandler,
);

export default router;
