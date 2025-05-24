import axios from "axios";
import * as RolesAPITypes from "../../../../shared/types/api/roles";
import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/roles"
		: "/api/roles";

// Create an Axios client with credentials enabled by default
const axiosClient = axios.create({
	baseURL: baseUrl,
	withCredentials: true, // Always include credentials
});

export const categoriesApi = {
	async create(
		data: RolesAPITypes.CreateRequestBody,
	): Promise<RolesAPITypes.CreateResponseData> {
		try {
			const response = await axiosClient.post<RolesAPITypes.CreateResponseData>(
				"/create",
				data,
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async get(
		data: RolesAPITypes.GetRequestBody,
	): Promise<RolesAPITypes.GetResponseData> {
		try {
			const response = await axiosClient.post<RolesAPITypes.GetResponseData>(
				"/get",
				data,
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async update(
		data: RolesAPITypes.UpdateRequestBody,
	): Promise<RolesAPITypes.UpdateResponseData> {
		try {
			const response = await axiosClient.post<RolesAPITypes.UpdateResponseData>(
				"/update",
				data,
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async delete(
		data: RolesAPITypes.DeleteRequestBody,
	): Promise<RolesAPITypes.DeleteResponseData> {
		try {
			const response = await axiosClient.post<RolesAPITypes.DeleteResponseData>(
				"/delete",
				data,
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async list(
		data: RolesAPITypes.ListRequestBody,
	): Promise<RolesAPITypes.ListResponseData> {
		try {
			const response = await axiosClient.post<RolesAPITypes.ListResponseData>(
				"/list",
				data,
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default categoriesApi;
