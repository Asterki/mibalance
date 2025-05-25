import { NextFunction, Request, Response } from "express";
import {
  GetRequestBody,
  GetResponseData,
} from "../../../../shared/types/api/files";

import FileModel, { IFile } from "../../models/File";

import LoggingService from "../../services/logging";

const getHandler = async (
  req: Request<{}, {}, GetRequestBody>,
  res: Response<GetResponseData>,
  _next: NextFunction,
) => {
  try {
    const { fileIds, fields } = req.body;

    const query = FileModel.find({
      _id: { $in: fileIds },
      isDeleted: false,
    });

    if (fields && fields.length > 0) {
      query.select(fields.join(" "));
    }

    const files: IFile[] = await query.exec();

    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error: any) {
    LoggingService.log({
      source: "files:get",
      level: "error",
      message: "Unexpected error during file retrieval",
      details: { error: error.message, stack: error.stack },
    });
    res.status(500).json({ status: "internal-error" });
  }
};

export default getHandler;
