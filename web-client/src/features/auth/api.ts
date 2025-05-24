import axios from "axios";
import * as AuthAPITypes from "../../../../shared/types/api/auth";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/auth"
		: "/api/auth";

const axiosClient = axios.create({
	baseURL: baseUrl,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export const authApi = {
	async login(
		data: AuthAPITypes.LoginRequestBody,
	): Promise<AuthAPITypes.LoginResponseData> {
		try {
			const response = await axiosClient.post<AuthAPITypes.LoginResponseData>(
				"/login",
				data,
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async fetch(): Promise<AuthAPITypes.FetchResponseData> {
		try {
			const response =
				await axiosClient.get<AuthAPITypes.FetchResponseData>("/fetch");

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async logout(): Promise<AuthAPITypes.LogoutResponseData> {
		try {
			const response = await axiosClient.post<AuthAPITypes.LogoutResponseData>(
				"/logout",
				{},
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async register(
		data: AuthAPITypes.RegisterRequestBody,
	): Promise<AuthAPITypes.RegisterResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.RegisterResponseData>(
					"/register",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async forgotPassword(
		data: AuthAPITypes.ForgotPasswordRequestBody,
	): Promise<AuthAPITypes.ForgotPasswordResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.ForgotPasswordResponseData>(
					"/forgot-password",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async changeEmail(
		data: AuthAPITypes.ChangeEmailRequestBody,
	): Promise<AuthAPITypes.ChangeEmailResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.ChangeEmailResponseData>(
					"/change-email",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async changePassword(
		data: AuthAPITypes.ChangePasswordRequestBody,
	): Promise<AuthAPITypes.ChangePasswordResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.ChangePasswordResponseData>(
					"/change-password",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async resetPassword(
		data: AuthAPITypes.ResetPasswordRequestBody,
	): Promise<AuthAPITypes.ResetPasswordResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.ResetPasswordResponseData>(
					"/reset-password",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async deleteAccount(
		data: AuthAPITypes.DeleteRequestBody,
	): Promise<AuthAPITypes.DeleteResponseData> {
		try {
			const response = await axiosClient.post<AuthAPITypes.DeleteResponseData>(
				"/delete-account",
				data,
			);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	// TFA Related
	async generateTFASecret(): Promise<AuthAPITypes.GenerateTFASecretResponseData> {
		try {
			const response =
				await axiosClient.get<AuthAPITypes.GenerateTFASecretResponseData>(
					"/generate-tfa-secret",
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async enableTFA(
		data: AuthAPITypes.EnableTFARequestBody,
	): Promise<AuthAPITypes.EnableTFAResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.EnableTFAResponseData>(
					"/enable-tfa",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async disableTFA(
		data: AuthAPITypes.DisableTFARequestBody,
	): Promise<AuthAPITypes.DisableTFAResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.DisableTFAResponseData>(
					"/disable-tfa",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async requestEmailVerification(): Promise<AuthAPITypes.RequestAccountEmailVerificationResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.RequestAccountEmailVerificationResponseData>(
					"/request-email-verification",
					{},
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},

	async verifyEmail(
		data: AuthAPITypes.VerifyAccountEmailRequestBody,
	): Promise<AuthAPITypes.VerifyAccountEmailResponseData> {
		try {
			const response =
				await axiosClient.post<AuthAPITypes.VerifyAccountEmailResponseData>(
					"/verify-email",
					data,
				);
			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	},
};
