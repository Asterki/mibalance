import { ILog } from "../../../server/src/models/Log";

export interface GetLogsRequestQuery {
	count: string;
	offset: string;
	logType?: "info" | "warning" | "important" | "error" | "critical";
}
export interface GetLogsResponseData {
	logs?: ILog[];
	status: "success" | "unauthorized" | "internal-error";
}
