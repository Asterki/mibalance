import { NextFunction, Request, Response } from "express";
import * as BudgetsAPITypes from "../../../../shared/types/api/budget";

import LoggingService from "../../services/logging";
import { IAccount } from "../../models/Account";
import BudgetModel from "../../models/Budget";

const handler = async (
  req: Request<{}, {}, BudgetsAPITypes.UpdateRequestBody>,
  res: Response<BudgetsAPITypes.UpdateResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const {
      budgetId,
      category,
      subcategory,
      amount,
      currency,
      period,
      startDate,
      endDate,
      rollover,
      isRecurring,
      isArchived,
      notes,
      tags,
    } = req.body;

    // Build update object only for fields explicitly sent (nullable means reset to null if provided)
    const updateData: Partial<BudgetsAPITypes.UpdateRequestBody> = {};

    if ("category" in req.body) updateData.category = category ?? null;
    if ("subcategory" in req.body) updateData.subcategory = subcategory ?? null;
    if ("amount" in req.body) updateData.amount = amount ?? null;
    if ("currency" in req.body) updateData.currency = currency ?? null;
    if ("period" in req.body) updateData.period = period ?? null;
    if ("startDate" in req.body) updateData.startDate = startDate ?? null;
    if ("endDate" in req.body) updateData.endDate = endDate ?? null;
    if ("rollover" in req.body) updateData.rollover = rollover ?? null;
    if ("isRecurring" in req.body) updateData.isRecurring = isRecurring ?? null;
    if ("isArchived" in req.body) updateData.isArchived = isArchived ?? null;
    if ("notes" in req.body) updateData.notes = notes ?? null;
    if ("tags" in req.body) updateData.tags = tags ?? null;

    const budget = await BudgetModel.findOneAndUpdate(
      { _id: budgetId, deleted: false },
      { $set: updateData },
      { new: true },
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
      message: "User updated a budget",
      details: {
        budgetId: budget._id.toString(),
        accountId: account._id.toString(),
        updateData,
      },
    });

    res.status(200).send({
      status: "success",
      budget,
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "budgets:update",
      level: "error",
      message: "Unexpected error during budget update",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
