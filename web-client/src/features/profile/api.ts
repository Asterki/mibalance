import axios from "axios";
import * as ProfileAPITypes from "../../../../shared/types/api/profile";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/profile"
		: "/api/profile";

export const profileApi = {
	async updateProfile(data: ProfileAPITypes.UpdateProfileRequestBody) {
		const response =
			await axios.post<ProfileAPITypes.UpdateProfileResponseData>(
				`${baseUrl}/api/profile/update`,
				data,
				{ withCredentials: true },
			);
		return response.data;
	},

	async updatePreferences(data: ProfileAPITypes.UpdatePreferencesRequestBody) {
		const response =
			await axios.post<ProfileAPITypes.UpdatePreferencesResponseData>(
				`${baseUrl}/api/profile/update-preferences`,
				data,
				{ withCredentials: true },
			);
		return response.data;
	},

	async fetchProfiles(data: ProfileAPITypes.FetchProfileRequestBody) {
		const response = await axios.post<ProfileAPITypes.FetchProfileResponseData>(
			`${baseUrl}/api/profile/fetch`,
			data,
			{
				withCredentials: true,
			},
		);
		return response.data;
	},
};

export default profileApi;
