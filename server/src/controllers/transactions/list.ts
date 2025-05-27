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
      includeDeleted = true,
    } = req.body;

    // Base query: scope to account
    const query: Record<string, any> = {
      account: account._id,
    };

    // Apply filters
    if (filters) {
      if (filters.type) query.type = filters.type;
      if (filters.category) query.category = filters.category;
      if (filters.walletId) {
        query.account = filters.walletId; // Assuming walletId is the account ID
      }

      if (filters.dateStart || filters.dateEnd) {
        query.date = {};
        if (filters.dateStart) query.date.$gte = new Date(filters.dateStart);
        if (filters.dateEnd) query.date.$lte = new Date(filters.dateEnd);
      }
    }

    // Search logic
    if (search?.query && search?.searchIn?.length) {
      const regex = new RegExp(search.query, "i");
      query.$or = search.searchIn.map((field) => ({ [field]: regex }));
    }

    // Soft-delete logic
    if (!includeDeleted) {
      query.deleted = false;
    }

    // Projection
    const projection = fields?.length
      ? fields.reduce(
          (acc, field) => {
            acc[field] = 1;
            return acc;
          },
          {} as Record<string, 1>,
        )
      : {};

    // Count + fetch
    const totalTransactions = await TransactionModel.countDocuments(query);
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
