import { Request, Response, NextFunction } from "express";
import { IAccount } from "../../models/Account";

import WalletModel from "../../models/Wallet";

import * as WalletAPITypes from "../../../../shared/types/api/wallet";
import LoggingService from "../../services/logging";

const handler = async (
  req: Request<{}, {}, WalletAPITypes.ListRequestBody>,
  res: Response<WalletAPITypes.ListResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const { page, count, fields, filters, search } = req.body;

    const query: any = {
      account: account._id,
      deleted: false,
    };

    // --- Filters ---
    if (filters) {
      if (filters.type) query.type = filters.type;
      if (filters.currency) query.currency = filters.currency;
      if (typeof filters.isPrimary === "boolean")
        query.isPrimary = filters.isPrimary;
      if (typeof filters.archived === "boolean")
        query.deleted = filters.archived;
    }

    // --- Search ---
    if (search) {
      const { query: searchQuery, searchIn } = search;
      query.$or = searchIn.map((field) => ({
        [field]: { $regex: searchQuery, $options: "i" },
      }));
    }

    const dbQuery = WalletModel.find(query)
      .skip(page * count)
      .limit(count);

    if (fields?.length) {
      dbQuery.select(fields.join(" "));
    }

    const totalWallets = await WalletModel.countDocuments(query);
    const wallets = await dbQuery;

    res.status(200).send({
      status: "success",
      wallets,
      totalWallets,
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "wallets:list",
      level: "error",
      message: "Unexpected error during wallet listing",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
