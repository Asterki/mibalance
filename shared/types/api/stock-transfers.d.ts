import { IStockTransfer } from "../../../server/src/models/StockTransfer";

// Create
export interface CreateRequestBody {
	barcode: string; // This is also the document ID
	fromWarehouse: string;
	toWarehouse: string;
	transferDate: Date;
	transferCost: number;
	items: {
		product: string;
		quantity: number;
	}[];
}
export interface CreateResponseData {
	status:
		| "success"
		| "invalid-parameters"
		| "not-found"
		| "internal-error"
		| "barcode-in-use";
	stockTransferId?: string; // The ID of the created stock transfer
}

// Get
export interface GetRequestBody {
	barcode: string; // This is also the document ID
}
export interface GetResponseData {
	status: "success" | "not-found" | "internal-error";
	stockTransfer?: IStockTransfer;
}

// List
export interface ListRequestBody {
	count: number;
	page: number;
	filters?: {
		fromWarehouse?: string;
		toWarehouse?: string;
		transferDate?: Date;
	};
}
export interface ListResponseData {
	status: "success" | "not-found" | "internal-error";
	stockTransfers?: IStockTransfer[];
	totalStockTransfers?: number; // Total number of stock transfers
}

// Update
export interface UpdateRequestBody {
	stockTransferId: string;
	barcode?: string;
	fromWarehouse?: string;
	toWarehouse?: string;
	transferDate?: Date;
	transferCost?: number;
	items?: {
		product: string;
		quantity: number;
	}[];
}
export interface UpdateResponseData {
	status: "success" | "invalid-parameters" | "not-found" | "internal-error";
	stockTransfer?: IStockTransfer;
}
