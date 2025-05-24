import { IPurchase } from "../../../server/src/models/Purchase";

// Create
export interface CreateRequestBody {
	supplierId: string;
	warehouseId: string;
	storeId: string;

	orderDate: string;
	expectedDeliveryDate?: string;
	actualDeliveryDate?: string;

	products: {
		productId: string;
		quantity: number;
		unitCost: number;
	}[];

	attachments?: {
		url: string;
		name: string;
	}[];

	payment: {
		method:
			| "cash"
			| "credit_card"
			| "debit_card"
			| "online"
			| "gift_card"
			| "split_payment";
		subtotal: number; // Subtotal before taxes and discounts
		shippingCost?: number; // Shipping cost if applicable
		taxes?: number; // Taxes applied to the purchase
		discount?: number; // Discount applied to the purchase
		totalPaid: number; // Total amount paid
	};

	// Status
	status: "pending" | "shipped" | "received";
	metadata?: Record<string, unknown>;
}
export interface CreateResponseData {
	status:
		| "success"
		| "invalid-supplier"
		| "invalid-warehouse"
		| "invalid-products"
		| "invalid-store"
		| "invalid-POS-session"
		| "invalid-parameters"
		| "internal-error";
	purchase?: IPurchase;
}

// Delete
export interface DeleteRequestBody {
	purchaseId: string;
}
export interface DeleteResponseData {
	status: "success" | "invalid-parameters" | "internal-error" | "not-found";
}

// get
export interface GetRequestBody {
	purchaseIds: string[];
}
export interface GetResponseData {
	status: "success" | "invalid-purchase" | "internal-error";
	purchases?: IPurchase[];
}

// List
export interface ListRequestBody {
	page: number;
	count: number;
	filters?: {
		storeId?: string;
		processedBy?: string;
		supplierId?: string;
		status?: string;
	};
}
export interface ListResponseData {
	status: "success" | "internal-error" | "invalid-parameters";
	purchases?: IPurchase[];
	totalPurchasesCount?: number;
}

// Upadte
export interface UpdateRequestBody {
	purchaseId: string;

	// From who to whom
	supplierId?: string; // Reference to Supplier
	warehouseId?: string; // Reference to Warehouse
	storeId?: string;

	// Order details
	orderDate?: Date;
	expectedDeliveryDate?: Date;
	actualDeliveryDate?: Date; // Actual delivery date

	// Items details
	products?: {
		productId: string; // Reference to StoreItem
		quantity: number;
		unitCost: number;
		totalCost: number;
	}[];

	// Attachments
	attachments?: {
		url: string; // URL or path to the file
		name: string; // Name of the file
	}[]; // URLs or paths to any files related to the purchase

	// Payment
	payment?: {
		method:
			| "cash"
			| "credit_card"
			| "debit_card"
			| "online"
			| "gift_card"
			| "split_payment";
		shippingCost?: number; // Shipping cost if applicable
		taxes?: number; // Taxes applied to the purchase
		discount?: number; // Discount applied to the purchase
		totalPaid: number; // Total amount paid
	};

	// Status
	status?: "pending" | "shipped" | "received" | "canceled" | "returned";
	statusReason?: string; // Reason for cancellation or return if applicable

	// Metadata
	metadata?: Record<string, any>;
}
export interface UpdateResponseData {
	status:
		| "success"
		| "not-found"
		| "invalid-supplier"
		| "invalid-warehouse"
		| "invalid-products"
		| "invalid-store"
		| "invalid-POS-session"
		| "invalid-parameters"
		| "internal-error";
	purchase?: IPurchase;
}
