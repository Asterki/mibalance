import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as RecurringAPITypes from "../../../../shared/types/api/recurring";

import { IAccount } from "../../models/Account";

import RecurringTransactionModel from "../../models/Recurring";

import LoggingService from "../../services/logging";

const handler = async (
  req: Request<{}, {}, RecurringAPITypes.DeleteRequestBody>,
  res: Response<RecurringAPITypes.DeleteResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const { recurringTransactionId } = req.body;

    const recurring = await RecurringTransactionModel.findOne({
      _id: new Types.ObjectId(recurringTransactionId),
      account: account._id,
      deleted: false,
    });

    if (!recurring) {
      res.status(404).json({
        status: "not-found",
      });
      return;
    }

    recurring.deleted = true;
    recurring.deletedAt = new Date();

    await recurring.save();

    LoggingService.log({
      source: "user",
      level: "important",
      message: "User created a recurring transaction",
      details: {
        recurringId: recurring._id.toString(),
        accountId: account._id.toString(),
      },
    });

    res.status(201).json({
      status: "success",
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "recurring:create",
      level: "error",
      message: "Unexpected error during recurring transaction creation",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
