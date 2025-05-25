import AccountModel from "../../models/Account";
import bcrypt from "bcrypt";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import AccountUtils from "../../utils/accounts";

import LoggingService from "../../services/logging";
import EmailService from "../../services/email";

const handler = async (
  req: Request<{}, {}, AuthAPITypes.RegisterRequestBody>,
  res: Response<AuthAPITypes.RegisterResponseData>,
  _next: NextFunction,
) => {
  const { language, email, password, name } = req.body;

  try {
    // Check if the email is already in use
    const accountExists = await AccountModel.exists({
      "email.value": {
        $eq: email,
      },
      deleted: false,
    });
    if (accountExists) {
      res.status(409).send({
        status: "email-in-use",
      });
      return;
    }

    const account = new AccountModel({
      email: {
        value: email,
        verified: false,
      },
      profile: {
        name: name,
      },
      preferences: {
        general: {
          language,
        },
        security: {
          password: await bcrypt.hash(password, 10),
        },
      },
    });
    account.save({});

    if (process.env.NODE_ENV === "production") {
      const emailToSend = await EmailService.getEmailHTMLTemplate(
        "welcome",
        req.body.language,
        {
          name: req.body.name,
        },
      );
      await EmailService.sendEmail(email, "Welcome", emailToSend);
    }

    // Log the action
    LoggingService.log({
      level: "info",
      source: "system",
      message: "User registered",
      details: {
        email: email,
      },
    });

    // Log in the user
    req.login(account, async (err) => {
      if (err) throw err; // If any errors, just throw them
      res.status(200).send({
        status: "success",
        account: await AccountUtils.createSessionAccount(account),
      });
    });
  } catch (error: any) {
    // Log the action
    LoggingService.log({
      level: "error",
      source: "system",
      message: "Error requesting password reset",
      details: {
        email: email,
        message: error.message,
        stack: error.stack,
      },
    });

    res.status(500).send({
      status: "internal-error",
    });
  }
};

export default handler;
