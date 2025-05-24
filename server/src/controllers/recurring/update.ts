import { Request, Response, NextFunction } from "express";

import * as RecurringAPITypes from "../../../../shared/types/api/recurring";

import RecurringTransactionModel from "../../models/Recurring";
import LoggingService from "../../services/logging";

const handler = async (
  req: Request<{}, {}, RecurringAPITypes.UpdateRequestBody>,
  res: Response<RecurringAPITypes.UpdateResponseData>,
  _next: NextFunction,
) => {
  try {
    const { recurringTransactionId, ...updateFields } = req.body;

    // Clean out null values from the update
    const cleanedUpdate: Record<string, any> = {};
    for (const [key, value] of Object.entries(updateFields)) {
      if (value !== null && value !== undefined) {
        cleanedUpdate[key] = value;
      }
    }

    const updated = await RecurringTransactionModel.findOneAndUpdate(
      { _id: recurringTransactionId },
      { $set: cleanedUpdate },
      { new: true },
    );

    if (!updated) {
      res.status(404).json({ status: "not-found" });
      return;
    }

    LoggingService.log({
      source: "user",
      level: "important",
      message: "User updated a recurring transaction",
      details: {
        recurringTransactionId,
        updatedFields: Object.keys(cleanedUpdate).join(", "),
      },
    });

    res.status(200).json({ status: "success" });
  } catch (error: Error | any) {
    LoggingService.log({
      source: "recurring:update",
      level: "error",
      message: "Unexpected error during recurring transaction update",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default handler;
