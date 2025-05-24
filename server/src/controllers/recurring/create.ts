import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as RecurringAPITypes from "../../../../shared/types/api/recurring";

import { IAccount } from "../../models/Account";

import RecurringTransactionModel from "../../models/Recurring";
import WalletModel from "../../models/Wallet";

import LoggingService from "../../services/logging";

const handler = async (
  req: Request<{}, {}, RecurringAPITypes.CreateRequestBody>,
  res: Response<RecurringAPITypes.CreateResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const {
      walletId,
      type,
      amount,
      currency = "USD",
      category,
      subcategory,
      description,
      paymentMethod,
      frequency,
      interval = 1,
      startDate,
      endDate,
      nextRun,
      tags,
      notes,
      attachments,
      isPaused = false,
    } = req.body;

    const walletExists = await WalletModel.exists({
      _id: new Types.ObjectId(walletId),
      account: account._id,
      deleted: false,
    });
    if (!walletExists) {
      res.status(404).json({
        status: "wallet-not-found",
      });
      return;
    }

    const newRecurring = new RecurringTransactionModel({
      account: account._id,
      type,
      amount,
      currency,
      category,
      subcategory,
      description,
      paymentMethod,
      frequency,
      interval,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      nextRun: new Date(nextRun),
      tags,
      notes,
      attachments: attachments?.map((a) => ({
        fileUrl: a.fileUrl,
        fileName: a.fileName,
        uploadedAt: a.uploadedAt ? new Date(a.uploadedAt) : new Date(),
      })),
      isPaused,
    });

    await newRecurring.save();

    LoggingService.log({
      source: "user",
      level: "important",
      message: "User created a recurring transaction",
      details: {
        recurringId: newRecurring._id.toString(),
        accountId: account._id.toString(),
      },
    });

    res.status(201).json({
      status: "success",
      recurringTransaction: newRecurring,
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
