import axios from "axios";
import * as WarehousesAPITypes from "../../../../shared/types/api/warehouses";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/warehouses"
		: "/api/warehouses";

const warehousesAPI = {
	create: async (
		data: WarehousesAPITypes.CreateRequestBody,
	): Promise<WarehousesAPITypes.CreateResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/create`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	update: async (
		data: WarehousesAPITypes.UpdateRequestBody,
	): Promise<WarehousesAPITypes.UpdateResponseData> => {
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
		data: WarehousesAPITypes.DeleteRequestBody,
	): Promise<WarehousesAPITypes.DeleteResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/delete`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	list: async (
		data: WarehousesAPITypes.ListRequestBody,
	): Promise<WarehousesAPITypes.ListResponseData> => {
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
		data: WarehousesAPITypes.GetRequestBody,
	): Promise<WarehousesAPITypes.GetResponseData> => {
		try {
			const response = await axios.post(`${baseUrl}/get`, data, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default warehousesAPI;
