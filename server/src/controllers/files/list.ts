import { NextFunction, Request, Response } from "express";
import {
  ListRequestBody,
  ListResponseData,
} from "../../../../shared/types/api/files";

import FileModel from "../../models/File";
import LoggingService from "../../services/logging";

import { IAccount } from "../../models/Account";

const listHandler = async (
  req: Request<{}, {}, ListRequestBody>,
  res: Response<ListResponseData>,
  _next: NextFunction,
) => {
  try {
    const account = req.user as IAccount;
    const { page, count, fields, includeDeleted, filters, search } = req.body;

    let query: any = {};

    query.owner = account._id;

    // Filters
    if (filters) {
      if (filters.visibility) {
        query.visibility = filters.visibility;
      }
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $all: filters.tags };
      }
      if (filters.uploadedAfter || filters.uploadedBefore) {
        query.uploadedAt = {
          ...(filters.uploadedAfter && {
            $gte: new Date(filters.uploadedAfter),
          }),
          ...(filters.uploadedBefore && {
            $lte: new Date(filters.uploadedBefore),
          }),
        };
      }
    }

    // Exclude deleted files unless explicitly included
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    // Search
    if (search) {
      const { query: searchQuery, searchIn } = search;
      query.$or = searchIn.map((field) => ({
        [field]: { $regex: searchQuery, $options: "i" },
      }));
    }

    // Pagination and projection
    const dbQuery = FileModel.find(query)
      .skip(page * count)
      .limit(count);

    if (fields && fields.length > 0) {
      dbQuery.select(fields.join(" "));
    }

    const totalFiles = await FileModel.countDocuments(query);
    const files = await dbQuery.exec();

    res.status(200).json({
      status: "success",
      files,
      totalFiles,
    });
  } catch (error: any) {
    LoggingService.log({
      source: "files:list",
      level: "error",
      message: "Unexpected error during file listing",
      details: { error: error.message, stack: error.stack },
    });
    res.status(500).json({ status: "internal-error" });
  }
};

export default listHandler;
