import { NextFunction, Request, Response } from "express";
import * as BudgetsAPITypes from "../../../../shared/types/api/budget";

import LoggingService from "../../services/logging";
import { IAccount } from "../../models/Account";

import BudgetModel from "../../models/Budget";

const handler = async (
  req: Request<{}, {}, BudgetsAPITypes.CreateRequestBody>,
  res: Response<BudgetsAPITypes.CreateResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;

    const {
      walletId,
      category,
      subcategory,
      amount,
      currency = "USD",
      period,
      startDate,
      endDate,
      rollover = false,
      isRecurring = true,
      isArchived = false,
      notes,
      tags,
    } = req.body;

    // Create new budget document
    const budget = new BudgetModel({
      account: account._id,
      wallet: walletId,
      category,
      subcategory,
      amount,
      currency,
      period,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      rollover,
      isRecurring,
      isArchived,
      notes,
      tags,
      createdAt: Date.now(),
    });

    await budget.save();

    LoggingService.log({
      source: "user",
      level: "important",
      message: "User created a budget",
      details: {
        accountId: account._id.toString(),
        budgetId: budget._id.toString(),
        walletId,
      },
    });

    res.status(201).send({
      status: "success",
      budget,
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "budgets:create",
      level: "error",
      message: "Unexpected error during budget creation",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
