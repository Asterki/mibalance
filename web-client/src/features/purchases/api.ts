import axios from "axios";
import * as PurchasesAPITypes from "../../../../shared/types/api/purchases";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/purchases"
		: "/api/purchases";

const purchasesAPI = {
	create: async (
		data: PurchasesAPITypes.CreateRequestBody,
	): Promise<PurchasesAPITypes.CreateResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/create`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	list: async (
		data: PurchasesAPITypes.ListRequestBody,
	): Promise<PurchasesAPITypes.ListResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/list`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	get: async (
		data: PurchasesAPITypes.GetRequestBody,
	): Promise<PurchasesAPITypes.GetResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/get`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	update: async (
		data: PurchasesAPITypes.UpdateRequestBody,
	): Promise<PurchasesAPITypes.UpdateResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/update`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	delete: async (
		data: PurchasesAPITypes.DeleteRequestBody,
	): Promise<PurchasesAPITypes.DeleteResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/delete`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default purchasesAPI;
