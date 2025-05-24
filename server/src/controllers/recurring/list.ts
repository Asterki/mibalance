import { Request, Response, NextFunction } from "express";
import * as RecurringAPITypes from "../../../../shared/types/api/recurring";

import LoggingService from "../../services/logging";

import RecurringTransactionModel from "../../models/Recurring";

const handler = async (
  req: Request<{}, {}, RecurringAPITypes.ListRequestBody>,
  res: Response<RecurringAPITypes.ListResponseData>,
  _next: NextFunction,
) => {
  try {
    const { page, count, fields, includePaused, filters, search } = req.body;

    const query: any = {};

    if (filters) {
      if (filters.account) {
        query.account = filters.account;
      }
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.frequency) {
        query.frequency = filters.frequency;
      }
      if (filters.startDateStart || filters.startDateEnd) {
        query.startDate = {
          ...(filters.startDateStart && {
            $gte: new Date(filters.startDateStart),
          }),
          ...(filters.startDateEnd && { $lte: new Date(filters.startDateEnd) }),
        };
      }
    }

    if (!includePaused) {
      query.isPaused = { $ne: true };
    }

    if (search) {
      const { query: searchQuery, searchIn } = search;
      query.$or = searchIn.map((field) => ({
        [field]: { $regex: searchQuery, $options: "i" },
      }));
    }

    const dbQuery = RecurringTransactionModel.find(query)
      .skip(page * count)
      .limit(count);

    if (fields?.length) {
      dbQuery.select(fields.join(" "));
    }

    const totalCount = await RecurringTransactionModel.countDocuments(query);
    const recurringTransactions = await dbQuery.exec();

    res.status(200).json({
      status: "success",
      recurringTransactions,
      totalRecurringTransactions: totalCount,
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "recurring:list",
      level: "error",
      message: "Unexpected error during recurring transaction listing",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
