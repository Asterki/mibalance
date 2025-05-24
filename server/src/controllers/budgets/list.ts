import { NextFunction, Request, Response } from "express";
import * as BudgetsAPITypes from "../../../../shared/types/api/budget";

import LoggingService from "../../services/logging";
import BudgetModel from "../../models/Budget";

const handler = async (
  req: Request<{}, {}, BudgetsAPITypes.ListRequestBody>,
  res: Response<BudgetsAPITypes.ListResponseData>,
  _next: NextFunction,
) => {
  try {
    const { page, count, fields, includeArchived, filters, search } = req.body;

    let query: any = {};

    // Filters
    if (filters) {
      if (filters.account) query.account = filters.account;
      if (filters.category) query.category = filters.category;
      if (filters.period) query.period = filters.period;

      if (filters.startDateStart || filters.startDateEnd) {
        query.startDate = {};
        if (filters.startDateStart)
          query.startDate.$gte = new Date(filters.startDateStart);
        if (filters.startDateEnd)
          query.startDate.$lte = new Date(filters.startDateEnd);
      }
    }

    // Search
    if (search) {
      const { query: searchQuery, searchIn } = search;
      query.$or = searchIn.map((field) => ({
        [field]: { $regex: searchQuery, $options: "i" },
      }));
    }

    // Archived flag
    if (!includeArchived) {
      query.isArchived = false;
    }

    const dbQuery = BudgetModel.find(query)
      .skip(page * count)
      .limit(count);

    if (fields && fields.length > 0) {
      dbQuery.select(fields.join(" "));
    }

    const totalBudgets = await BudgetModel.countDocuments(query);
    const budgets = await dbQuery;

    res.status(200).send({
      status: "success",
      budgets,
      totalBudgets,
    });
  } catch (error: any) {
    LoggingService.log({
      source: "budgets:list",
      level: "error",
      message: "Unexpected error during budget listing",
      details: { error: error.message, stack: error.stack },
    });
    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
