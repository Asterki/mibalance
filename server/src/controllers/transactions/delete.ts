import { NextFunction, Request, Response } from "express";
import * as TransactionsAPITypes from "../../../../shared/types/api/transactions";

import LoggingService from "../../services/logging";

import { IAccount } from "../../models/Account";
import TransactionModel from "../../models/Transaction";
import WalletModel from "../../models/Wallet";

const handler = async (
  req: Request<{}, {}, TransactionsAPITypes.DeleteRequestBody>,
  res: Response<TransactionsAPITypes.DeleteResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const { transactionId } = req.body;

    // Construct the new transaction document
    const transaction = await TransactionModel.findOne({
      _id: transactionId,
      account: account._id,
      deleted: false,
    });
    if (!transaction) {
      res.status(404).send({
        status: "not-found",
      });
      return;
    }

    const wallet = await WalletModel.findOne({
      _id: transaction.wallet,
      account: account._id,
    });

    // Revert the transaction amount from the wallet
    if (wallet) {
      if (transaction.type === "income") {
        wallet.balance -= transaction.amount;
      } else if (transaction.type === "expense") {
        wallet.balance += transaction.amount;
      }
      await wallet.save();
    }

    transaction.deleted = true;
    transaction.deletedAt = new Date();

    await transaction.save();

    LoggingService.log({
      source: "transactions:delete",
      level: "info",
      message: "User deleted a transaction successfully",
      details: {
        transactionId: transaction._id.toString(),
        accountId: account._id.toString(),
      },
    });

    res.status(201).send({
      status: "success",
    });
  } catch (error: any) {
    LoggingService.log({
      source: "transaction:delete",
      level: "error",
      message: "Unexpected error during transaction deletion",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
