import { Request, Response, NextFunction } from "express";
import * as WalletAPITypes from "../../../../shared/types/api/wallet";

import WalletModel from "../../models/Wallet";

import LoggingService from "../../services/logging";

import { IAccount } from "../../models/Account";

const handler = async (
  req: Request<{}, {}, WalletAPITypes.UpdateRequestBody>,
  res: Response<WalletAPITypes.UpdateResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const {
      walletId,
      name,
      description,
      balance,
      currency,
      type,
      institution,
      isPrimary,
      color,
      icon,
    } = req.body;

    const updateFields: Partial<WalletAPITypes.UpdateRequestBody> = {};

    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (balance !== undefined) updateFields.balance = balance;
    if (currency !== undefined) updateFields.currency = currency;
    if (type !== undefined) updateFields.type = type;
    if (institution !== undefined) updateFields.institution = institution;
    if (isPrimary !== undefined) updateFields.isPrimary = isPrimary;
    if (color !== undefined) updateFields.color = color;
    if (icon !== undefined) updateFields.icon = icon;

    const updatedWallet = await WalletModel.findOneAndUpdate(
      { _id: walletId, account: account._id },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedWallet) {
      res.status(404).send({ status: "not-found" });
      return;
    }

    LoggingService.log({
      source: "user",
      level: "important",
      message: "User updated a wallet",
      details: {
        walletId: updatedWallet._id.toString(),
        accountId: account._id.toString(),
        updates: Object.keys(updateFields).join(", "),
      },
    });

    res.status(200).send({
      status: "success",
      wallet: updatedWallet,
    });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "wallets:update",
      level: "error",
      message: "Unexpected error during wallet update",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
