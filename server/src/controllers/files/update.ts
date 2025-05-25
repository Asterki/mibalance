import { NextFunction, Request, Response } from "express";
import {
  UpdateRequestBody,
  UpdateResponseData,
} from "../../../../shared/types/api/files";
import FileModel from "../../models/File";
import LoggingService from "../../services/logging";

const updateHandler = async (
  req: Request<{}, {}, UpdateRequestBody>,
  res: Response<UpdateResponseData>,
  _next: NextFunction,
) => {
  try {
    const { fileId, ...updateFields } = req.body;

    // Clean null values explicitly (optional but good practice)
    for (const key in updateFields) {
      // @ts-ignore
      if (updateFields[key] === null) {
        // @ts-ignore
        updateFields[key] = undefined;
      }
    }

    const updatedFile = await FileModel.findOneAndUpdate(
      { _id: fileId },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedFile) {
      res.status(404).json({ status: "not-found" });
      return;
    }

    res.status(200).json({
      status: "success",
      file: updatedFile,
    });
  } catch (error: any) {
    LoggingService.log({
      source: "files:update",
      level: "error",
      message: "Unexpected error during file update",
      details: { error: error.message, stack: error.stack },
    });
    res.status(500).json({ status: "internal-error" });
  }
};

export default updateHandler;
