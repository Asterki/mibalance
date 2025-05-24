import axios from "axios";
import * as SuppliersAPITypes from "../../../../shared/types/api/suppliers";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/suppliers"
		: "/api/suppliers";

const axiosClient = axios.create({
	baseURL: baseUrl,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export const suppliersApi = {
	async create(
		data: SuppliersAPITypes.CreateRequestBody,
	): Promise<SuppliersAPITypes.CreateResponseData> {
		try {
			const response =
				await axiosClient.post<SuppliersAPITypes.CreateResponseData>(
					"/create",
					data,
				);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async get(
		data: SuppliersAPITypes.GetRequestBody,
	): Promise<SuppliersAPITypes.GetResponseData> {
		try {
			const response =
				await axiosClient.post<SuppliersAPITypes.GetResponseData>("/get", data);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async update(
		data: SuppliersAPITypes.UpdateRequestBody,
	): Promise<SuppliersAPITypes.UpdateResponseData> {
		try {
			const response =
				await axiosClient.post<SuppliersAPITypes.UpdateResponseData>(
					"/update",
					data,
				);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async delete(
		data: SuppliersAPITypes.DeleteRequestBody,
	): Promise<SuppliersAPITypes.DeleteResponseData> {
		try {
			const response =
				await axiosClient.post<SuppliersAPITypes.DeleteResponseData>(
					"/delete",
					data,
				);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async list(
		data: SuppliersAPITypes.ListRequestBody,
	): Promise<SuppliersAPITypes.ListResponseData> {
		try {
			const response =
				await axiosClient.post<SuppliersAPITypes.ListResponseData>(
					"/list",
					data,
				);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default suppliersApi;
