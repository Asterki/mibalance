import { IStore } from "../../../server/src/models/Store";
import { ResponseStatus } from "../models";

// Create
export type CreateRequestBody = {
	name: string;
	location: string;
	phone?: string;
	email?: string;
	manager: string;
	metadata?: Record<string, any>;
};
export type CreateResponseData = {
	status: ResponseStatus | "invalid-manager";
	storeId?: string;
};

// Update
export type UpdateRequestBody = {
	storeId: string;
	name: string;
	location: string;
	phone: string | null;
	email: string | null;
	manager: string;
	employees: string[];
};
export type UpdateResponseData = {
	status: ResponseStatus | "invalid-manager" | "invalid-employee" | "not-found";
	store?: IStore;
};

// Delete
export type DeleteRequestBody = {
	storeId: string;
};
export type DeleteResponseData = {
	status: ResponseStatus | "not-found";
};

// Get
export type GetRequestBody = {
	storeIds: string[];
	fields?: Array<keyof IStore>;
	relations: Array<"manager" | "employees">;
};
export type GetResponseData = {
	status: ResponseStatus | "not-found";
	stores?: IStore[];
};

// List
export type ListRequestBody = {
	count: number;
	page: number;
	fields?: Array<keyof IStore>;
	includeDeleted?: boolean;
	filters?: {
		name?: string;
		location?: string;
		manager?: string;
	};
	relations?: {
		manager?: boolean;
		employees?: boolean;
	};
};
export type ListResponseData = {
	status: ResponseStatus;
	stores?: IStore[];
	totalStores?: number;
};
