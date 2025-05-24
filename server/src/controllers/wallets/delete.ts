import { NextFunction, Request, Response } from "express";
import * as WalletsAPITypes from "../../../../shared/types/api/wallet";

import LoggingService from "../../services/logging";

import { IAccount } from "../../models/Account";
import WalletModel from "../../models/Wallet";

const handler = async (
  req: Request<{}, {}, WalletsAPITypes.DeleteRequestBody>,
  res: Response<WalletsAPITypes.DeleteResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const { walletId } = req.body;

    // Construct the new transaction document
    const wallet = await WalletModel.findOne({
      _id: walletId,
      account: account._id,
      deleted: false,
    });
    if (!wallet) {
      res.status(404).send({
        status: "not-found",
      });
      return;
    }

    wallet.deleted = true;
    wallet.deletedAt = new Date();

    LoggingService.log({
      source: "wallet:delete",
      level: "info",
      message: "User deleted a wallet successfully",
      details: {
        walletId: wallet._id.toString(),
        accountId: account._id.toString(),
      },
    });

    res.status(201).send({
      status: "success",
    });
  } catch (error: any) {
    LoggingService.log({
      source: "wallet:delete",
      level: "error",
      message: "Unexpected error during wallet deletion",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
