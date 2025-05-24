import axios from "axios";
import * as FileAPITypes from "../../../../../shared/types/api/files";

import apiUtils from "../../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/admin/files"
		: "/api/admin/files";

export const fileApi = {
	async deleteFile(
		fileId: string,
	): Promise<FileAPITypes.DeleteFileResponseData> {
		try {
			const response = await axios.post<FileAPITypes.DeleteFileResponseData>(
				`${baseUrl}/delete`,
				{
					fileId,
				},
				{
					withCredentials: true,
				},
			);
			return response.data;
		} catch (error) {
			return apiUtils.handleAxiosError(error);
		}
	},
};

export default fileApi;
