import { NextFunction, Request, Response } from "express";
import * as TransactionsAPITypes from "../../../../shared/types/api/transactions";

import LoggingService from "../../services/logging";

import { IAccount } from "../../models/Account";
import WalletModel from "../../models/Wallet";
import TransactionModel from "../../models/Transaction";

const handler = async (
  req: Request<{}, {}, TransactionsAPITypes.CreateRequestBody>,
  res: Response<TransactionsAPITypes.CreateResponseData>,
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
      date,
      description,
      paymentMethod,
      isRecurring = false,
      recurrence,
      tags,
      isCleared = true,
      notes,
      attachments,
    } = req.body;

    const wallet = await WalletModel.findOne({
      _id: walletId,
      account: account._id,
      deleted: false,
    });
    if (!wallet) {
      res.status(404).json({
        status: "wallet-not-found",
      });
      return;
    }

    // Construct the new transaction document
    const transaction = new TransactionModel({
      account: account._id,
      type,
      wallet: walletId,
      amount,
      currency,
      category,
      subcategory,
      date: new Date(date),
      description,
      paymentMethod,
      isRecurring,
      recurrence: recurrence
        ? {
            frequency: recurrence.frequency,
            endDate: recurrence.endDate
              ? new Date(recurrence.endDate)
              : undefined,
            interval: recurrence.interval ?? 1,
          }
        : undefined,
      tags,
      isCleared,
      notes,
      attachments: attachments?.map((a) => ({
        fileUrl: a.fileUrl,
        fileName: a.fileName,
        uploadedAt: a.uploadedAt ? new Date(a.uploadedAt) : new Date(),
      })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await transaction.save();

    // Update the wallet's balance
    wallet.balance += type === "income" ? amount : -amount;
    wallet.updatedAt = new Date(); 
    await wallet.save();

    // TODO: if it's recurring create a recurring transaction one

    LoggingService.log({
      source: "user",
      level: "important",
      message: "User created a transaction successfully",
      details: {
        transactionId: transaction._id.toString(),
        accountId: account._id.toString(),
      },
    });

    res.status(201).send({
      status: "success",
      transaction,
    });
  } catch (error: any) {
    LoggingService.log({
      source: "transactions:create",
      level: "error",
      message: "Unexpected error during transaction creation",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
