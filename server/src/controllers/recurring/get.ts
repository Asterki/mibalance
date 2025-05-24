import { Request, Response, NextFunction } from "express";
import * as RecurringAPITypes from "../../../../shared/types/api/recurring";

import RecurringTransactionModel from "../../models/Recurring";

import LoggingService from "../../services/logging";

const handler = async (
  req: Request<{}, {}, RecurringAPITypes.GetRequestBody>,
  res: Response<RecurringAPITypes.GetResponseData>,
  _next: NextFunction,
) => {
  try {
    const { recurringTransactionIds, fields } = req.body;

    const recurringTransactionsQuery = RecurringTransactionModel.find({
      _id: { $in: recurringTransactionIds },
    });

    if (fields?.length) {
      recurringTransactionsQuery.select(fields.join(" "));
    }

    const recurringTransactions = await recurringTransactionsQuery.exec();

    res.status(200).json({
      status: "success",
      recurringTransactions,
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "recurring:get",
      level: "error",
      message: "Unexpected error during recurring transaction retrieval",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
