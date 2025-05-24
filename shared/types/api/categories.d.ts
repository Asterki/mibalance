import { ICategory } from "../../../server/src/models/Category";
import { ResponseStatus } from "../models";

// Create Category
export type CreateRequestBody = {
	name: string;
	description?: string;
	imageUrl?: string;
	tags?: string[];
	metadata?: Record<string, any>;
};
export type CreateResponseData = {
	status: ResponseStatus;
	category?: ICategory;
};

// List Categories
export type ListRequestBody = {
	page: number;
	count: number;
	fields?: Array<keyof ICategory>;
	includeDeleted?: boolean;
	filters?: {
		createdAtStart?: string;
		createdAtEnd?: string;
	};
	search?: {
		query: string;
		searchIn: Array<"name" | "description" | "tags">;
	};
};
export type ListResponseData = {
	status: ResponseStatus;
	categories?: ICategory[];
	totalCategories?: number;
};

// Update Category
export type UpdateRequestBody = {
	categoryId: string;
	name?: string | null;
	description?: string | null;
	imageUrl?: string | null;
	tags?: string[];
	metadata?: Record<string, any>;
};
export type UpdateResponseData = {
	status: ResponseStatus | "not-found";
	category?: ICategory;
};

// Delete Category
export type DeleteRequestBody = {
	categoryId: string;
};
export type DeleteResponseData = {
	status: ResponseStatus | "not-found";
};

// Get Category
export type GetRequestBody = {
	categoryIds: string[];
  fields?: Array<keyof ICategory>;
};
export type GetResponseData = {
	status: ResponseStatus;
	categories?: ICategory[];
};
