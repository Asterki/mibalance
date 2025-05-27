import { NextFunction, Request, Response } from "express";
import * as TransactionsAPITypes from "../../../../shared/types/api/transactions";

import LoggingService from "../../services/logging";

import TransactionModel from "../../models/Transaction";

const handler = async (
  req: Request<{}, {}, TransactionsAPITypes.GetRequestBody>,
  res: Response<TransactionsAPITypes.GetResponseData>,
  _next: NextFunction,
) => {
  try {
    const { transactionIds, fields } = req.body;

    const query = TransactionModel.find({
      _id: { $in: transactionIds },
    });

    if (fields) {
      query.select(fields.join(" "));
    }

    const transactions = await query.exec();

    res.status(200).send({
      status: "success",
      transactions: transactions,
    });
  } catch (error: Error | any) {
    // Log unexpected errors with stack trace
    LoggingService.log({
      source: "transactions:get",
      level: "error",
      message: "Unexpected error during transaction getting",
      details: { error: error.message, stack: error.stack },
    });
    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
