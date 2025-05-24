import { IStock } from "../../../server/src/models/Stock";

export interface ListRequestBody {
	warehouseId: string;
	count: number;
	page: number;
}
export interface ListResponseData {
	stocks?: IStock[];
	totalCount?: number;
	status: "success" | "internal-error";
}

export interface GetByProductRequestBody {
	productIds: string[];
	warehouseIds: string[];
}
export interface GetByProductResponseData {
	stocks?: IStock[];
	status: "success" | "internal-error" | "not-found";
}

export interface UpdateRequestBody {
	stockId: string;
	quantity: number;
}
export interface UpdateResponseData {
	status: "success" | "internal-error" | "not-found" | "invalid-parameters";
}
