import axios from "axios";
import * as StoresAPITypes from "../../../../shared/types/api/stores";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/store"
		: "/api/store";

const axiosClient = axios.create({
	baseURL: baseUrl,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export const storesApi = {
	async create(
		data: StoresAPITypes.CreateRequestBody,
	): Promise<StoresAPITypes.CreateResponseData> {
		try {
			const response =
				await axiosClient.post<StoresAPITypes.CreateResponseData>(
					"/create",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async get(
		data: StoresAPITypes.GetRequestBody,
	): Promise<StoresAPITypes.GetResponseData> {
		try {
			const response = await axiosClient.post<StoresAPITypes.GetResponseData>(
				"/get",
				data,
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async update(
		data: Partial<StoresAPITypes.UpdateRequestBody>,
	): Promise<StoresAPITypes.UpdateResponseData> {
		try {
			const response =
				await axiosClient.post<StoresAPITypes.UpdateResponseData>(
					"/update",
					data,
				);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async deleteStore(
		data: StoresAPITypes.DeleteRequestBody,
	): Promise<StoresAPITypes.DeleteResponseData> {
		try {
			const response =
				await axiosClient.post<StoresAPITypes.DeleteResponseData>(
					"/delete",
					data,
				);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async list(
		data: StoresAPITypes.ListRequestBody,
	): Promise<StoresAPITypes.ListResponseData> {
		try {
			const response = await axiosClient.post<StoresAPITypes.ListResponseData>(
				"/list",
				data,
			);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default storesApi;
