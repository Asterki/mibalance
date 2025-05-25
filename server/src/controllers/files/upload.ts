import { Request, Response } from "express";
import multer from "multer";
import path from "path";

import FileModel from "../../models/File";

import { IAccount } from "../../models/Account";
import * as FilesAPITypes from "../../../../shared/types/api/files";

// Setup multer storage
const upload = multer({
  dest: path.join(__dirname, "../../../uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const uploadHandler = async (
  req: Request<{}, {}, FilesAPITypes.UploadFileRequestBody>,
  res: Response<FilesAPITypes.UploadFileResponseData>,
) => {
  const runUpload = upload.single("file");

  runUpload(req, res, async (err) => {
    if (err) {
      res.status(400).json({
        status: "upload-error",
      });
      return;
    }

    try {
      const account = req.user as IAccount;

      const file = req.file;
      const { description, tags, visibility } = req.body;

      if (!file) {
        res.status(400).json({
          status: "no-file",
        });
        return;
      }

      const savedFile = await FileModel.create({
        owner: account._id,
        sharedWith: [],
        visibility: visibility ?? "private",
        name: file.originalname,
        size: file.size,
        type: path.extname(file.originalname).slice(1),
        mimeType: file.mimetype,
        filePath: file.path,
        description,
        tags: tags ? tags : [],
        isDeleted: false,
      });

      return res.status(201).json({
        status: "success",
        file: {
          _id: savedFile._id.toString(),
          name: savedFile.name,
          size: savedFile.size,
          mimeType: savedFile.mimeType,
          type: savedFile.type,
          fileUrl: `/uploads/${path.basename(savedFile.filePath)}`,
          uploadedAt: savedFile.uploadedAt.toISOString(),
          tags: savedFile.tags,
          description: savedFile.description,
          visibility: savedFile.visibility,
        },
      });
    } catch (err: any) {
      res.status(500).json({
        status: "internal-error",
      });
    }
  });
};

export default uploadHandler;
