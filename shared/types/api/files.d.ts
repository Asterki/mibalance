import { ResponseStatus } from "../models";
import { IFile } from "../../../server/src/models/FilFilee";

export interface UploadFileRequestBody {
  description?: string;
  tags?: string[]; // Must be passed as JSON stringified in multipart/form-data
  visibility?: "private" | "shared" | "public";
}
export interface UploadFileResponseData {
  status: "success" | "upload-error" | "no-file" | "internal-error";
  file?: IFile;
}

export type DeleteRequestBody = {
  fileId: string;
};
export type DeleteResponseData = {
  status: ResponseStatus | "not-found";
};

export type GetRequestBody = {
  fileIds: string[];
  fields?: Array<keyof IFile>;
};
export type GetResponseData = {
  status: ResponseStatus;
  files?: IFile[];
};

export type ListRequestBody = {
  page: number;
  count: number;
  fields?: Array<keyof IFile>;
  includeDeleted?: boolean;
  filters?: {
    visibility?: "private" | "shared" | "public";
    type?: string;
    tags?: string[];
    uploadedAfter?: string;
    uploadedBefore?: string;
  };
  search?: {
    query: string;
    searchIn: Array<"name" | "description" | "tags">;
  };
};
export type ListResponseData = {
  status: ResponseStatus;
  files?: IFile[];
  totalFiles?: number;
};

export type UpdateRequestBody = {
  fileId: string;
  description?: string | null;
  tags?: string[] | null;
  visibility?: "private" | "shared" | "public" | null;
  name?: string | null;
  isDeleted?: boolean | null;
  deletedAt?: string | null; // ISO date string or null
  // You can add other fields here if you want to allow updating them
};

export type UpdateResponseData = {
  status: ResponseStatus | "not-found";
  file?: IFile;
};
