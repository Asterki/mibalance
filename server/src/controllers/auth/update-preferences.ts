import AccountModel from "../../models/Account";
import type { IAccount } from "../../models/Account";

import { NextFunction, Request, Response } from "express";
import type * as AuthAPITypes from "../../../../shared/types/api/auth";

import LoggingService from "../../services/logging";

const handler = async (
  req: Request<{}, {}, AuthAPITypes.UpdatePreferencesRequestBody>,
  res: Response<AuthAPITypes.UpdatePreferencesResponseData>,
  _next: NextFunction,
) => {
  const account = req.user as IAccount;
  const { theme, language, notifications } = req.body;

  try {
    const dbAccount = await AccountModel.findOne({
      _id: account._id,
      deleted: false,
    });

    // DB Account is always defined
    if (theme) {
      dbAccount!.preferences.general.theme = theme;
    }
    if (language) {
      dbAccount!.preferences.general.language = language;
    }
    if (notifications) {
      dbAccount!.preferences.notifications = {
        ...dbAccount!.preferences.notifications,
        ...notifications,
      };
    }

    await dbAccount!.save();

    res.status(200).send({ status: "success" });
  } catch (error: any) {
    LoggingService.log({
      source: "auth:update-preferences",
      level: "error",
      message: "Unexpected error while updating user preferences",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).send({ status: "internal-error" });
  }
};

export default handler;
