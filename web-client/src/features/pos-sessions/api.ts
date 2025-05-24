import axios from "axios";
import * as POSSessionsAPITypes from "../../../../shared/types/api/pos-sessions";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/pos-sessions"
		: "/api/pos-sessions";

const axiosClient = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

const boxClosureAPI = {
	// This will only fetch the box closure list that is open and belongs to the user
	getByCurrentUser: async (
		data: POSSessionsAPITypes.GetByCurrentUserRequestBody,
	): Promise<POSSessionsAPITypes.GetByCurrentUserResponseData> => {
		try {
			const response =
				await axiosClient.post<POSSessionsAPITypes.GetByCurrentUserResponseData>(
					`/get-by-current-user`,
					data,
				);

			return response.data;
		} catch (error: Error | unknown) {
			return ApiUtils.handleAxiosError(error);
		}
	},
	list: async (
		data: POSSessionsAPITypes.ListRequestBody,
	): Promise<POSSessionsAPITypes.ListResponseData> => {
		try {
			const response =
				await axiosClient.post<POSSessionsAPITypes.ListResponseData>(
					`/list`,
					data,
				);

			return response.data;
		} catch (error: Error | unknown) {
			return ApiUtils.handleAxiosError(error);
		}
	},
	create: async (
		data: POSSessionsAPITypes.CreateRequestBody,
	): Promise<POSSessionsAPITypes.CreateResponseData> => {
		try {
			const response =
				await axiosClient.post<POSSessionsAPITypes.CreateResponseData>(
					`/create`,
					data,
				);

			return response.data;
		} catch (error: Error | unknown) {
			return ApiUtils.handleAxiosError(error);
		}
	},
	update: async (
		data: POSSessionsAPITypes.UpdateRequestBody,
	): Promise<POSSessionsAPITypes.UpdateResponseData> => {
		try {
			const response =
				await axiosClient.post<POSSessionsAPITypes.UpdateResponseData>(
					`/update`,
					data,
				);

			return response.data;
		} catch (error: Error | unknown) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default boxClosureAPI;
