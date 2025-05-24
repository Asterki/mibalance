import { NextFunction, Request, Response } from "express";
import * as CategoriesAPITypes from "../../../../shared/types/api/wallet";

import LoggingService from "../../services/logging";

import WalletModel from "../../models/Wallet";

const handler = async (
  req: Request<{}, {}, CategoriesAPITypes.GetRequestBody>,
  res: Response<CategoriesAPITypes.GetResponseData>,
  _next: NextFunction,
) => {
  try {
    const { walletIds, fields } = req.body;

    const query = WalletModel.find({
      _id: { $in: walletIds },
    });

    if (fields) {
      query.select(fields.join(" "));
    }

    const wallets = await query.exec();

    res.status(200).send({
      status: "success",
      wallets: wallets,
    });
  } catch (error: Error | any) {
    // Log unexpected errors with stack trace
    LoggingService.log({
      source: "wallets:get",
      level: "error",
      message: "Unexpected error during wallet getting",
      details: { error: error.message, stack: error.stack },
    });
    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
