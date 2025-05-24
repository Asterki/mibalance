import axios from "axios";
import * as ProductsAPITypes from "../../../../shared/types/api/products";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/products"
		: "/api/products";

export const productsApi = {
	async create(
		data: ProductsAPITypes.CreateRequestBody,
	): Promise<ProductsAPITypes.CreateResponseData> {
		try {
			const response = await axios.post(`${baseUrl}/create`, data, {
				withCredentials: true,
			});

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async get(
		data: ProductsAPITypes.GetRequestBody,
	): Promise<ProductsAPITypes.GetResponseData> {
		try {
			const response = await axios.post<ProductsAPITypes.GetResponseData>(
				`${baseUrl}/get`,
				data,
				{
					withCredentials: true,
				},
			);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async search({
		query,
	}: ProductsAPITypes.SearchRequestBody): Promise<ProductsAPITypes.SearchResponseData> {
		try {
			const response = await axios.post(
				`${baseUrl}/search`,
				{
					query,
				},
				{
					withCredentials: true,
				},
			);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async update(
		data: ProductsAPITypes.UpdateRequestBody,
	): Promise<ProductsAPITypes.UpdateResponseData> {
		try {
			const response = await axios.post<ProductsAPITypes.UpdateResponseData>(
				`${baseUrl}/update`,
				data,
				{ withCredentials: true },
			);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async delete({
		productId,
	}: ProductsAPITypes.DeleteRequestBody): Promise<ProductsAPITypes.DeleteResponseData> {
		try {
			const response = await axios.post(
				`${baseUrl}/delete`,
				{
					productId,
				},
				{ withCredentials: true },
			);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async list(
		data: ProductsAPITypes.ListRequestBody,
	): Promise<ProductsAPITypes.ListResponseData> {
		try {
			const response = await axios.post<ProductsAPITypes.ListResponseData>(
				`${baseUrl}/list`,
				data,
				{
					withCredentials: true,
				},
			);

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default productsApi;
