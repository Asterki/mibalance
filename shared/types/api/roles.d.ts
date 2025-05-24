import { IAccountRole } from "../../../server/src/models/AccountRole";

interface CreateRequestBody {
	name: string;
  level: number;
}
interface CreateResponseData {
	status: "success" | "internal-error" | "role-too-high" | "level-in-use" | "not-allowed";
	role?: IAccountRole;
}

interface DeleteRequestBody {
	roleId: string;
}
interface DeleteResponseData {
	status: "success" | "not-found" | "internal-error";
}

interface ListRequestBody {
	page: number;
	count: number;
	fields?: Array<keyof IAccountRole>;
	includeDeleted?: boolean;
	query?: string;
}
interface ListResponseData {
	status: "success" | "internal-error";
	roles?: IAccountRole[];
	totalRoles?: number;
}

interface GetRequestBody {
	roleIds: string[];
}
interface GetResponseData {
	status: "success" | "not-found" | "internal-error";
	roles?: IAccountRole[];
}

interface UpdateRequestBody {
	roleId: string;
	name?: string;
	level?: number;
	permissions?: string[];
	requiresTwoFactor?: boolean;
}
interface UpdateResponseData {
	status: "success" | "not-found" | "internal-error";
	role?: IAccountRole;
}
