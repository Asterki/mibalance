import express from "express";
import { z } from "zod";

// Account creation routes
import accountsRegister from "../controllers/auth/register";
import accountsDelete from "../controllers/auth/delete";

// Account access routes
import accountsFetch from "../controllers/auth/fetch";
import accountsLogin from "../controllers/auth/login";
import accountsLogout from "../controllers/auth/logout";

// TFA routes
import enableTFAHandler from "../controllers/auth/enable-tfa";
import disableTFAHandler from "../controllers/auth/disable-tfa";

// Account Email
import changeEmailHandler from "../controllers/auth/change-email";
import requestEmailVerificationHandler from "../controllers/auth/request-email-verification";
import verifyEmailHandler from "../controllers/auth/verify-email";

// Account update
import updatePreferencesHandler from "../controllers/auth/update-preferences";
import updateProfileHandler from "../controllers/auth/update-profile";

// Account password
import changePasswordHandler from "../controllers/auth/change-password";
import resetPasswordHandler from "../controllers/auth/reset-password";
import forgotPasswordHandler from "../controllers/auth/forgot-password";

// Util routes
import generateTFaSecret from "../controllers/auth/utils/generate-tfa-secret";
import verifyTFAHandler from "../controllers/auth/utils/verify-tfa";

import { validateRequestBody } from "../middleware/validationMiddleware";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

// Account creation and deletion routes
router.post(
  "/register",
  [
    validateRequestBody(
      z.object({
        email: z.string().email(),
        name: z.string().min(2).max(34),
        password: z.string().min(8).max(100),
      }),
    ),
  ],
  accountsRegister,
);

router.post(
  "/delete",
  [
    ensureAuthenticated,
    validateRequestBody(
      z.object({
        password: z.string().min(8).max(100),
        tfaCode: z.string().optional(),
      }),
    ),
  ],
  accountsDelete,
);

// Account access routes
router.post(
  "/login",
  [
    validateRequestBody(
      z.object({
        email: z.string().min(3).max(100),
        password: z.string().min(8).max(100),
        tfaCode: z.string().optional(),
      }),
    ),
  ],
  accountsLogin,
);

router.post("/logout", [ensureAuthenticated], accountsLogout);

router.get("/fetch", [ensureAuthenticated], accountsFetch);

// Account Email
router.post(
  "/change-email",
  [
    ensureAuthenticated,
    validateRequestBody(
      z.object({
        password: z.string().min(8).max(100),
        newEmail: z.string().email(),
      }),
    ),
  ],
  changeEmailHandler,
);

router.post(
  "/verify-email",
  [
    validateRequestBody(
      z.object({
        token: z.string(),
      }),
    ),
  ],
  verifyEmailHandler,
);

router.post("/request-email-verification", [], requestEmailVerificationHandler);

// Account password
router.post(
  "/change-password",
  [
    ensureAuthenticated,
    validateRequestBody(
      z.object({
        currentPassword: z.string().min(8).max(100),
        newPassword: z.string().min(8).max(100),
      }),
    ),
  ],
  changePasswordHandler,
);

router.post(
  "/reset-password",
  [
    validateRequestBody(
      z.object({
        token: z.string(),
        newPassword: z.string().min(8).max(100),
      }),
    ),
  ],
  resetPasswordHandler,
);

router.post(
  "/forgot-password",
  [
    validateRequestBody(
      z.object({
        email: z.string().email(),
      }),
    ),
  ],
  forgotPasswordHandler,
);

// Account update routes
router.post(
  "/update-preferences",
  [
    ensureAuthenticated,
    validateRequestBody(
      z.object({
        theme: z.enum(["light", "dark"]),
        language: z.enum(["en", "es", "fr", "de"]),
      }),
    ),
  ],
  updatePreferencesHandler,
);

router.post(
  "/update-profile",
  [
    ensureAuthenticated,
    validateRequestBody(
      z.object({
        name: z.string().min(2).max(34).optional(),
        avatarURL: z.string().nullable().optional(),
      }),
    ),
  ],
  updateProfileHandler,
);

// TFA routes
router.post(
  "/enable-tfa",
  [
    ensureAuthenticated,
    validateRequestBody(
      z.object({
        password: z.string().min(8).max(100),
        tfaCode: z.string(),
        secret: z.string(),
      }),
    ),
  ],
  enableTFAHandler,
);

router.post(
  "/disable-tfa",
  [
    ensureAuthenticated,
    validateRequestBody(
      z.object({
        password: z.string().min(8).max(100),
        tfaCode: z.string(),
      }),
    ),
  ],
  disableTFAHandler,
);

// Utils routes
router.post(
  "/verify-tfa",
  [
    ensureAuthenticated,
    validateRequestBody(
      z.object({
        tfaCode: z.string().min(6).max(6), // TFA codes are typically 6 digits
      }),
    ),
  ],
  verifyTFAHandler,
);

router.post("/generate-tfa-secret", [ensureAuthenticated], generateTFaSecret);

export default router;
