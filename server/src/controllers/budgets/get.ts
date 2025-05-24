import { NextFunction, Request, Response } from "express";
import * as BudgetsAPITypes from "../../../../shared/types/api/budget";

import LoggingService from "../../services/logging";
import BudgetModel from "../../models/Budget";

const handler = async (
  req: Request<{}, {}, BudgetsAPITypes.GetRequestBody>,
  res: Response<BudgetsAPITypes.GetResponseData>,
  _next: NextFunction,
) => {
  try {
    const { budgetIds, fields } = req.body;

    const query = BudgetModel.find({
      _id: { $in: budgetIds },
    });

    if (fields) {
      query.select(fields.join(" "));
    }

    const budgets = await query.exec();

    res.status(200).send({
      status: "success",
      budgets,
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "budgets:get",
      level: "error",
      message: "Unexpected error during budget getting",
      details: { error: error.message, stack: error.stack },
    });
    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
