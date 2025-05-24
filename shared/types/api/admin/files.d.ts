import { IAdminFile } from "../../../../server/src/models/AdminFile";

// Create a file
interface UploadFileRequestBody {
	folder: string;
	tags?: string[];
}
export interface UploadFileResponseData {
	status:
		| "success"
		| "no-file-provided"
		| "file-too-large"
		| "unauthorized"
		| "internal-error"
		| "rate-limit";
	fileId?: string;
	fileUrl?: string;
}

// Delete a file
interface DeleteFileRequestBody {
	fileId: string;
}
export interface DeleteFileResponseData {
	status:
		| "success"
		| "file-not-found"
		| "unauthorized"
		| "internal-error"
		| "rate-limit";
}

// List files
interface ListFilesRequestBody {
	folder: string;
	count: number;
	page: number;
}
export interface ListFilesResponseData {
	status: "success" | "internal-error" | "rate-limit";
	files?: IAdminFile[];
	totalFiles?: number;
}

// Get file
interface GetFileRequestBody {
	fileId: string;
}
export interface GetFileResponseData {
	status: "success" | "file-not-found" | "internal-error" | "rate-limit";
	file?: IAdminFile;
	filePath?: string; // This is so that the client can download the image without having to form the URL via the IAdminFile object
}

// List folders
export interface ListFoldersResponseData {
	status: "success" | "internal-error" | "rate-limit";
	folders: string[];
}

// Search file
interface SearchFileRequestBody {
	query: string;
}
export interface SearchFileResponseData {
	status: "success" | "internal-error" | "rate-limit";
	files?: IAdminFile[];
}
