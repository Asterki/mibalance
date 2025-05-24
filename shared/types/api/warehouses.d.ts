import { IWarehouse } from "../../../server/src/models/Warehouse";

// Create
export interface CreateRequestBody {
	name: string;
	description?: string;
	address?: string;
	tags?: string[];
	metadata?: Record<string, any>;
}
export interface CreateResponseData {
	status: "success" | "location-exists" | "internal-error";
	warehouse?: IWarehouse;
}

// Delete
export interface DeleteRequestBody {
	warehouseId: string;
}
export interface DeleteResponseData {
	status: "success" | "not-found" | "internal-error";
}

// List
export interface ListRequestBody {
	count: number;
	page: number;
	query?: string;
	fields?: Array<keyof IWarehouse>;
	includeDeleted?: boolean;
}
export interface ListResponseData {
	status: "success" | "internal-error";
	warehouses?: IWarehouse[];
	totalWarehouses?: number;
}

// Get
export interface GetRequestBody {
	warehouseIds: string[];
  fields?: Array<keyof IWarehouse>;
}
export interface GetResponseData {
	status: "success" | "internal-error";
	warehouses?: IWarehouse[];
}

// Update
export interface UpdateRequestBody {
	warehouseId: string;
	name?: string;
	description?: string;
	address?: string;
	tags?: string[];
	metadata?: Record<string, any>;
}
export interface UpdateResponseData {
	status: "success" | "not-found" | "internal-error";
	warehouse?: IInventoryLocation;
}
