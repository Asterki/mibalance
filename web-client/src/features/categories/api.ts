import axios from "axios";
import * as CategoriesAPITypes from "../../../../shared/types/api/categories";
import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/categories"
		: "/api/categories";

// Create an Axios client with credentials enabled by default
const axiosClient = axios.create({
	baseURL: baseUrl,
	withCredentials: true, // Always include credentials
});

export const categoriesApi = {
	async create(
		data: CategoriesAPITypes.CreateRequestBody,
	): Promise<CategoriesAPITypes.CreateResponseData> {
		try {
			const response =
				await axiosClient.post<CategoriesAPITypes.CreateResponseData>(
					"/create",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async get(
		data: CategoriesAPITypes.GetRequestBody,
	): Promise<CategoriesAPITypes.GetResponseData> {
		try {
			const response =
				await axiosClient.post<CategoriesAPITypes.GetResponseData>(
					"/get",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async update(
		data: CategoriesAPITypes.UpdateRequestBody,
	): Promise<CategoriesAPITypes.UpdateResponseData> {
		try {
			const response =
				await axiosClient.post<CategoriesAPITypes.UpdateResponseData>(
					"/update",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async delete(
		data: CategoriesAPITypes.DeleteRequestBody,
	): Promise<CategoriesAPITypes.DeleteResponseData> {
		try {
			const response =
				await axiosClient.post<CategoriesAPITypes.DeleteResponseData>(
					"/delete",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async list(
		data: CategoriesAPITypes.ListRequestBody,
	): Promise<CategoriesAPITypes.ListResponseData> {
		try {
			const response =
				await axiosClient.post<CategoriesAPITypes.ListResponseData>(
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
