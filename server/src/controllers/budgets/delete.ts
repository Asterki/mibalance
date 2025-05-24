import { NextFunction, Request, Response } from "express";
import * as BudgetsAPITypes from "../../../../shared/types/api/budget";

import LoggingService from "../../services/logging";
import { IAccount } from "../../models/Account";
import BudgetModel from "../../models/Budget";

const handler = async (
  req: Request<{}, {}, BudgetsAPITypes.DeleteRequestBody>,
  res: Response<BudgetsAPITypes.DeleteResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const { budgetId } = req.body;

    const budget = await BudgetModel.findOneAndUpdate(
      { _id: budgetId, deleted: false },
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        },
      },
    );

    if (!budget) {
      res.status(404).send({
        status: "not-found",
      });
      return;
    }

    LoggingService.log({
      source: "user",
      level: "important",
      message: "User deleted a budget",
      details: {
        budgetId: budget._id.toString(),
        accountId: account._id.toString(),
      },
    });

    res.status(200).send({
      status: "success",
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "budgets:delete",
      level: "error",
      message: "Unexpected error during budget deletion",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
