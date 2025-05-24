import { IPOSSession } from "../../../server/src/models/POSSession";

export interface CreateRequestBody {
	starting: number;
	storeId: string;
}
export interface CreateResponseData {
	POSSession?: IPOSSession;
	status: "success" | "invalid-parameters" | "internal-error";
}

export interface ListRequestBody {
	count: number;
	page: number;
	filters?: {
		date?: Date;
		boxOwner?: string;
		status?: "open" | "closed";
	};
}
export interface ListResponseData {
	POSSessions?: IPOSSession[];
	totalPOSSessions?: number;
	status: "success" | "invalid-parameters" | "internal-error";
}

// Update
export interface UpdateRequestBody {
	POSSessionId: string;
	starting?: number;
	status?: "open" | "closed";
	boxOwner?: string;
}
export interface UpdateResponseData {
	POSSession?: IPOSSession;
	status: "success" | "not-found" | "invalid-parameters" | "internal-error";
}

// Get
export interface GetRequestBody {
	POSSessionId: string;
}
export interface GetResponseData {
	POSSession?: IPOSSession;
	status: "success" | "not-found" | "invalid-parameters" | "internal-error";
}

// Get by user
export interface GetByCurrentUserRequestBody {
	status?: "open" | "closed";
}
export interface GetByCurrentUserResponseData {
	POSSession?: IPOSSession;
	status: "success" | "not-found" | "invalid-parameters" | "internal-error";
}
