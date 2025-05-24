import axios from "axios";
import * as SalesAPITypes from "../../../../shared/types/api/sales";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/sales"
		: "/api/sales";

const salesAPI = {
	create: async (
		data: SalesAPITypes.CreateRequestBody,
	): Promise<SalesAPITypes.CreateResponseData> => {
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
		data: SalesAPITypes.ListRequestBody,
	): Promise<SalesAPITypes.ListResponseData> => {
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
		data: SalesAPITypes.GetRequestBody,
	): Promise<SalesAPITypes.GetResponseData> => {
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
		data: SalesAPITypes.UpdateRequestBody,
	): Promise<SalesAPITypes.UpdateResponseData> => {
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
		data: SalesAPITypes.DeleteRequestBody,
	): Promise<SalesAPITypes.DeleteResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/delete`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	refund: async (
		data: SalesAPITypes.RefundRequestBody,
	): Promise<SalesAPITypes.RefundResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/refund`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default salesAPI;
