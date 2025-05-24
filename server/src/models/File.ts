import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
  _id: mongoose.Types.ObjectId;

  // Ownership and access
  owner: mongoose.Types.ObjectId; // Ref to Account
  sharedWith: mongoose.Types.ObjectId[]; // Ref to Account
  visibility: "private" | "shared" | "public";

  // Metadata
  name: string;
  size: number; // in bytes
  type: string; // e.g. 'png', 'pdf'
  mimeType?: string;
  hash?: string; // file checksum
  version?: number;

  // Storage info
  filePath: string;
  description?: string;
  tags?: string[];

  // Lifecycle
  isDeleted: boolean;
  deletedAt?: Date;

  // Timestamps
  uploadedAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: "Account" }],

    visibility: {
      type: String,
      enum: ["private", "shared", "public"],
      default: "private",
    },

    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    mimeType: { type: String },
    hash: { type: String },
    version: { type: Number, default: 1 },

    filePath: { type: String, required: true, index: true },
    description: { type: String },
    tags: [{ type: String }],

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: { createdAt: "uploadedAt", updatedAt: "updatedAt" },
  },
);

fileSchema.index({ owner: 1 });
fileSchema.index({ filePath: 1 });
fileSchema.index({ uploadedAt: -1 });

const FileModel = mongoose.model<IFile>("File", fileSchema);
export default FileModel;
