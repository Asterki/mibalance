import { IProduct } from "../../../server/src/models/Product";
import { ResponseStatus } from "../models";

export type CreateRequestBody = {
	// Basic information
	name: string;
	category: string; // Id referencing the category
	barcode?: string;

	// Prices
	sellingPrice: number;
	costPrice: number;
};
export type CreateResponseData = {
	status: "invalid-category" | "barcode-already-exists" | ResponseStatus;
	product?: IProduct;
};

// Delete product
export type DeleteRequestBody = {
	productId: string;
};
export type DeleteResponseData = {
	status: "not-found" | ResponseStatus;
	product?: IProduct;
};

// Get product
export type GetRequestBody = {
	productIds: string[];
	fields?: Array<keyof IProduct>;
	populate?: Array<"category" | "subcategories">;
	includeDeleted?: boolean;
};
export type GetResponseData = {
	status: "not-found" | ResponseStatus;
	products?: IProduct[];
};

// List products
export type ListRequestBody = {
	page: number;
	count: number;
	search?: {
		query: string;
		searchIn: Array<"tags" | "name" | "barcode" | "description" | "sku">;
	};
	filters?: {
		type?: "physical" | "digital";
		tags?: string[];
		subcategories?: string[];
		category?: string;
		createdAtStart?: string;
		createdAtEnd?: string;
		priceRangeStart?: number;
		priceRangeEnd?: number;
	};
	showDeleted?: boolean;
	sort?: {
		order: "asc" | "desc";
		by: "name" | "sellingPrice" | "costPrice" | "createdAt";
	};
	fields?: Array<keyof IProduct>;
	populate?: Array<"category" | "subcategories">;
};
export type ListResponseData = {
	status: ResponseStatus;
	products?: IProduct[];
	totalProducts?: number;
};

// Search products
export type SearchRequestBody = {
	query: string;
};
export type SearchResponseData = {
	status: ResponseStatus;
	products?: IProduct[];
};

// Update product
export type UpdateRequestBody = {
	productId: string;

	// Basic information
	name?: string;
	description?: string;
	barcode?: string;
	imageUrls?: string[];

	// Categories
	category?: string; // Id referencing the category
	subcategories?: string[]; // Array of IDs referencing the subcategories

	// Product information
	type?: "physical" | "digital" | "service";
	unit?: string; // Unit of measurement
	physicalInformation?: {
		width?: number;
		height?: number;
		depth?: number;
		weight?: number;
	};

	// Prices
	sellingPrice?: number;
	costPrice?: number;
	taxIncluded?: boolean;

	// Extra fields
	tags?: string[];
	metadata?: Record<string, any>;
};
export type UpdateResponseData = {
	status:
		| "not-found"
		| "invalid-category"
		| "invalid-subcategories"
		| "barcode-already-exists"
		| ResponseStatus;
	product?: IProduct;
};

// Util routes
export type GenerateBarcodeResponseData = {
	status: ResponseStatus;
	barcode?: string;
};

export interface ProductStatsResponse {
	status: ResponseStatus;
	stats?: {
		totalProducts: number;
		activeProducts: number;
		deletedProducts: number;
		digitalProducts: number;
		physicalProducts: number;
		productsWithImages: number;
		productsWithTags: number;
		productsWithMetadata: number;
		expiringProducts: number;
		productsMissingCategory: number;
		averageSellingPrice: number;
		averageCostPrice: number;
		totalInventoryCost: number;
		totalPotentialRevenue: number;
		newestProductCreatedAt: string | null;
		oldestProductCreatedAt: string | null;
		averageProductAgeDays: number;
	};
}
