import { File } from "../model";

// Request Body
export interface UploadFileRequestBody {
	folder: string; // Folder where the file will be saved (relative to user's directory)
}
export interface UploadFileResponseData {
	status: "success" | "no-file-provided" | "unauthorized" | "internal-error";
	file?: File;
}

export interface DeleteFileRequestBody {
	fileId: string;
}
export interface DeleteFileResponseData {
	status: "success" | "file-not-found" | "unauthorized" | "internal-error";
}

export interface GetFolderContentsQuery {
	folder: string;
}
export interface GetFolderContentsResponseData {
	status: "success" | "folder-not-found" | "internal-error";
	contents: {
		name: string;
		type: "file" | "folder";
		size: number;
		modified: Date;
	}[];
}
