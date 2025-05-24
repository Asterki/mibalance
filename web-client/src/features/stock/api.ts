import axios from "axios";
import * as StockAPITypes from "../../../../shared/types/api/stock";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/stock"
		: "/api/stock";

const stockAPI = {
	listStock: async (
		data: StockAPITypes.ListRequestBody,
	): Promise<StockAPITypes.ListResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/list`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	updateStock: async (
		data: StockAPITypes.UpdateRequestBody,
	): Promise<StockAPITypes.UpdateResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/update`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	getStocksByProductIds: async (
		data: StockAPITypes.GetByProductRequestBody,
	): Promise<StockAPITypes.GetByProductResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/get-by-product`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default stockAPI;
