import { NextFunction, Request, Response } from "express";
import {
  DeleteRequestBody,
  DeleteResponseData,
} from "../../../../shared/types/api/files";
import { IAccount } from "../../models/Account";

import FileModel from "../../models/File";
import LoggingService from "../../services/logging";

const deleteHandler = async (
  req: Request<{}, {}, DeleteRequestBody>,
  res: Response<DeleteResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const { fileId } = req.body;

    // Soft delete: set isDeleted flag and deletedAt timestamp
    const file = await FileModel.findOneAndUpdate(
      { _id: fileId, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!file) {
      res.status(404).json({ status: "not-found" });
      return;
    }

    LoggingService.log({
      source: "user",
      level: "important",
      message: "User deleted a file",
      details: {
        fileId: file._id.toString(),
        accountId: account._id.toString(),
      },
    });

    res.status(200).json({ status: "success" });
  } catch (error: any) {
    LoggingService.log({
      source: "files:delete",
      level: "error",
      message: "Unexpected error during file deletion",
      details: { error: error.message, stack: error.stack },
    });

    res.status(500).json({ status: "internal-error" });
  }
};

export default deleteHandler;
