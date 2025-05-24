import { NextFunction, Request, Response } from "express";
import * as TransactionsAPITypes from "../../../../shared/types/api/transactions";

import LoggingService from "../../services/logging";
import { IAccount } from "../../models/Account";
import TransactionModel from "../../models/Transaction";

const handler = async (
  req: Request<{}, {}, TransactionsAPITypes.ListRequestBody>,
  res: Response<TransactionsAPITypes.ListResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const {
      page,
      count,
      fields,
      filters,
      search,
      includeCleared = true,
      dateRange,
      type,
    } = req.body;

    // Build query object scoped to the account
    const query: Record<string, any> = { account: account._id };

    if (filters) {
      if (filters.dateStart)
        query.date = { ...query.date, $gte: new Date(filters.dateStart) };
      if (filters.dateEnd)
        query.date = { ...query.date, $lte: new Date(filters.dateEnd) };
      if (typeof filters.category === "string")
        query.category = filters.category;
      if (typeof filters.type === "string") query.type = filters.type;
      if (filters.tags?.length) query.tags = { $in: filters.tags };
    }

    if (search?.query && search?.searchIn?.length) {
      const searchRegex = new RegExp(search.query, "i");
      query.$or = search.searchIn.map((field) => ({ [field]: searchRegex }));
    }

    if (!includeCleared) {
      query.isCleared = false;
    }

    // Count total matching documents for pagination
    const totalTransactions = await TransactionModel.countDocuments(query);

    // Select fields if requested, else all
    const projection = fields?.length
      ? fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {})
      : {};

    // Query with pagination and sorting (descending by date)
    const transactions = await TransactionModel.find(query, projection)
      .sort({ date: -1 })
      .skip(page * count)
      .limit(count);

    res.status(200).json({
      status: "success",
      transactions,
      totalTransactions,
    });
  } catch (error: any) {
    LoggingService.log({
      source: "transactions:list",
      level: "error",
      message: "Unexpected error during transaction listing",
      details: { error: error.message, stack: error.stack },
    });
    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
