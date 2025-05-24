import { ISale } from "../../../server/src/models/Sale";
import { IRefund } from "../../../server/src/models/Refund";


// Create Sale
export interface CreateRequestBody {
	date?: string; // It will be converted to Date in the backend
	store: string;
	needsReceipt: boolean;
	customer: {
		name: string;
		RTN?: string; // Optional for tax purposes
		email?: string;
		phone?: string;
	};
	items: {
		product: string;
		quantity: number;
		unitPrice: number;
		discountApplied?: number;
	}[];
	payment: {
		method:
			| "cash"
			| "credit_card"
			| "debit_card"
			| "online"
			| "gift_card"
			| "split_payment";
		taxName: string;
		paidAmount: number;
	};
	warehouseId: string;
	processedBy: string;
	POSSession: string;
	//discountAuth: string; // Optional, for discount authorization
	metadata?: Record<string, any>;
}
export interface CreateResponseData {
	status:
		| "success"
		| "internal-error"
		| "invalid-parameters"
		| "config-not-found"
		| "invalid-store"
		| "invalid-warehouse"
		| "invalid-pos-session"
		| "invalid-processed-by"
		| "invalid-tax"
		| "not-fully-paid"
		| "invoice-number-range-exceeded"
		| "invalid-discount-auth"
		| "insufficient-stock"
		| "unauthenticated";
	saleId?: string;
}

// Get Sale
export interface GetRequestBody {
	saleIds: string[];
  relations?: Array<"items">;
}
export interface GetResponseData {
	status: "success" | "internal-error" | "not-found" | "unauthenticated";
	sales?: ISale[];
}

// List Sale
export interface ListRequestBody {
	query?: {
		POSSessionId?: string;
		storeId?: string;
		warehouseId?: string;
		dateStart?: string;
		dateEnd?: string;
		processedBy?: string;
		paymentMethod?: string;
		paymentStatus?: string;
		customer?: string;
		receiptNumber?: string;
		invoiceNumber?: string;
    refunded?: boolean;
	};
	includeDeleted?: boolean;
	fields?: Array<keyof ISale>;
	count: number;
	page: number;
}
export interface ListResponseData {
	status: "success" | "internal-error" | "unauthenticated" | "invalid-store";
	sales?: ISale[];
	totalSalesCount?: number;
}

// Update Sale
export interface UpdateRequestBody {
	saleId: string;
	date?: string; // It will be converted to Date in the backend
	customer?: {
		name?: string;
		RTN?: string; // Optional for tax purposes
		email?: string;
		phone?: string;
	};
	items?: {
		product: string;
		quantity: number;
		unitPrice: number;
		total: number;
		discountApplied?: number;
	}[];
	payment?: {
		method:
			| "cash"
			| "credit_card"
			| "debit_card"
			| "online"
			| "gift_card"
			| "split_payment";
		totalAmount: number;
		taxes?: number;
		discount?: number;
		paidAmount: number;
		paymentStatus: "paid" | "partially_paid" | "unpaid";
		changeGiven?: number;
	};
	receiptNumber?: string;
	invoiceNumber?: string;
	processedBy?: string;
	metadata?: Record<string, any>;
}
export interface UpdateResponseData {
	status:
		| "success"
		| "internal-error"
		| "not-found"
		| "unauthenticated"
		| "insufficient-stock";
	sale?: ISale;
}

// Delete Sale
export interface DeleteRequestBody {
	saleId: string;
}
export interface DeleteResponseData {
	status: "success" | "internal-error" | "not-found" | "unauthenticated";
}

export interface RefundRequestBody {
	saleId: string;
	storeId: string;
	POSSessionId: string;
	warehouseId: string;

	items: {
		productId: string;
		quantity: number;
		amount: number;
	}[];

	date: string;
	reason: string;
	notes: string;
}

export interface RefundResponseData {
	status:
		| "success"
		| "sale-not-found"
		| "store-not-found"
		| "pos-session-closed"
		| "warehouse-not-found"
		| "pos-session-not-found"
		| "internal-error"
		| "invalid-parameters"
		| "unauthenticated"
		| "unauthorized"
		| "internal-error";
	refund?: IRefund;
}
