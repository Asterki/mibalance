import { IAccount } from "../../../server/src/models/Account";

export interface GetRequestBody {
	accountIds: string[];
  fields: Array<keyof IAccount>;
}
export interface GetResponseData {
	status: "success" | "internal-error" | "invalid-parameters";
	accounts?: IAccount[];
}

export interface ListRequestBody {
	count: number;
	page: number;
	filters?: {
		name?: string;
		role?: string;
	};
	includeDeleted?: boolean;
	fields?: (keyof IAccount)[];
	populate?: Array<"data.role">;
}
export interface ListResponseData {
	status: "success" | "internal-error" | "invalid-parameters";
	accounts?: IAccount[];
	totalAccounts?: number;
}

export interface DeleteRequestBody {
	accountId: string;
}
export interface DeleteResponseData {
	status:
		| "success"
		| "internal-error"
		| "invalid-parameters"
		| "not-found"
		| "cannot-delete-self";
	account?: IAccount;
}

export interface CreateRequestBody {
	email: string;
	name: string;
	password: string;
  roleId: string;
	notify?: boolean; // Whehter to send a notification email
}
export interface CreateResponseData {
	status: "success" | "internal-error" | "invalid-parameters" | "email-in-use";
	account?: IAccount;
}

export interface UpdateRequestBody {
	accountId: string;
	name?: string;
	avatarUrl?: string;
	email?: string;
	password?: string;
	roleId?: string;
	notify?: boolean; // Whether to send a notification email
	disableTwoFactor?: boolean; // Whether to disable two-factor authentication
}
export interface UpdateResponseData {
	status:
		| "success"
		| "internal-error"
		| "invalid-parameters"
		| "not-found"
		| "invalid-role"
		| "email-in-use";
	account?: IAccount;
}
