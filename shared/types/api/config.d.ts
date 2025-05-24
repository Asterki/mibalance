import { IConfig } from "../../../server/src/models/Config";

export interface GetConfigResponseData {
	status: "success" | "internal-error";
	config?: IConfig;
}

export type UpdateRequestBody = {
	currency: string;
	currencySymbol: string;
	currencyPosition: "left" | "right";

	taxes: {
		name: string;
		rate: number;
	}[];

	invoiceNumberRange: {
		start: number;
		end: number;
		current: number;
	};

	inventorySettings: {
		lowStockAlerts: boolean;
	};

	notifications: {
		email: boolean;
		sms: boolean;
		push: boolean;
	};
};

export type UpdateResponseData =
	| { status: "success"; config: IConfig }
	| { status: "not-found" }
	| { status: "internal-error" };

