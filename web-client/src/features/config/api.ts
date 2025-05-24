import axios from "axios";
import * as ConfigAPITypes from "../../../../shared/types/api/config";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/config"
		: "/api/config";

const configApi = {
	get: async (): Promise<ConfigAPITypes.GetConfigResponseData> => {
		try {
			const response = await axios.get<ConfigAPITypes.GetConfigResponseData>(
				`${baseUrl}`,
				{
					withCredentials: true,
				},
			);

			return response.data;
		} catch (error: Error | unknown) {
			return ApiUtils.handleAxiosError(error);
		}
	},
	update: async (
		data: ConfigAPITypes.UpdateRequestBody,
	): Promise<ConfigAPITypes.GetConfigResponseData> => {
		try {
			const response = await axios.post<ConfigAPITypes.GetConfigResponseData>(
				`${baseUrl}/update`,
				data,
				{
					withCredentials: true,
				},
			);

			return response.data;
		} catch (error: Error | unknown) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};

export default configApi;
