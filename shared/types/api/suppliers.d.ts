import { ISupplier } from "../../../server/src/models/Supplier";

export type CreateRequestBody = {
	name: string;
	description?: string;
	phone?: string;
	email?: string;
	website?: string;
	address?: string;
};
export type CreateResponseData = {
	status: "success" | "internal-error";
	supplierId?: string;
};

export type DeleteRequestBody = {
	supplierId: string;
};
export type DeleteResponseData = {
	status: "success" | "internal-error" | "not-found";
};

export type GetRequestBody = {
	supplierIds: string[];
  fields: Array<keyof ISupplier>;
};
export type GetResponseData = {
	status: "success" | "internal-error" | "not-found";
	suppliers?: ISupplier[];
};

export type ListRequestBody = {
	page: number;
	count: number;
	query?: string;
	fields?: Array<keyof ISupplier>;
	includeDeleted?: boolean;
};
export type ListResponseData = {
	status: "success" | "internal-error";
	suppliers?: ISupplier[];
	totalSuppliers?: number;
};

export type UpdateRequestBody = {
	// Null here means that the field is to be reset
	// Updefined means that the field is not to be updated
	supplierId: string;
	name?: string | null;
	description?: string | null;
	phone?: string | null;
	email?: string | null;
	website?: string | null;
	address?: string | null;
};
export type UpdateResponseData = {
	status: "success" | "internal-error" | "not-found";
};
