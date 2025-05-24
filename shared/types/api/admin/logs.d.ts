import { ILog } from "../../../../server/src/models/Log";

export interface GetLogsRequestBody {
	count: number;
	page: number;
	filter?: {
		level?: "info" | "warning" | "error" | "critical";
		source?: "system" | "user" | "application";
	};
}

export interface GetLogsResponseData {
	status: "success" | "internal-error" | "rate-limit" | "invalid-parameters";
	logs?: ILog[];
}
