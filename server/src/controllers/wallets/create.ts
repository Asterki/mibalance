import { NextFunction, Request, Response } from "express";
import * as WalletsAPITypes from "../../../../shared/types/api/wallet";

import LoggingService from "../../services/logging";

import { IAccount } from "../../models/Account";
import WalletModel from "../../models/Wallet";

const handler = async (
  req: Request<{}, {}, WalletsAPITypes.CreateRequestBody>,
  res: Response<WalletsAPITypes.CreateResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const {
      name,
      type,
      currency,
      balance,
      icon,
      color,
      isPrimary,
      description,
      institution,
    } = req.body;

    // Construct the new transaction document
    const wallet = new WalletModel({
      account: account._id,
      name,
      type,
      currency,
      balance,
      icon,
      color,
      isPrimary: isPrimary || false,
      description,
      institution,
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await wallet.save();

    LoggingService.log({
      source: "wallet:create",
      level: "info",
      message: "User created a wallet successfully",
      details: {
        walletId: wallet._id.toString(),
        accountId: account._id.toString(),
      },
    });

    res.status(201).send({
      status: "success",
      wallet,
    });
  } catch (error: any) {
    LoggingService.log({
      source: "wallet:create",
      level: "error",
      message: "Unexpected error during wallet creation",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
