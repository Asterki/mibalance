import axios from "axios";
import * as WalletAPITypes from "../../../../shared/types/api/wallet";
import ApiUtils from "../../utils/api";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SERVER_URL + "/api/wallets"
    : "/api/wallets";

// Create an Axios client with credentials enabled by default
const axiosClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // Always include credentials
});

export const categoriesApi = {
  async create(
    data: WalletAPITypes.CreateRequestBody,
  ): Promise<WalletAPITypes.CreateResponseData> {
    try {
      const response =
        await axiosClient.post<WalletAPITypes.CreateResponseData>(
          "/create",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async get(
    data: WalletAPITypes.GetRequestBody,
  ): Promise<WalletAPITypes.GetResponseData> {
    try {
      const response =
        await axiosClient.post<WalletAPITypes.GetResponseData>(
          "/get",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async update(
    data: WalletAPITypes.UpdateRequestBody,
  ): Promise<WalletAPITypes.UpdateResponseData> {
    try {
      const response =
        await axiosClient.post<WalletAPITypes.UpdateResponseData>(
          "/update",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async delete(
    data: WalletAPITypes.DeleteRequestBody,
  ): Promise<WalletAPITypes.DeleteResponseData> {
    try {
      const response =
        await axiosClient.post<WalletAPITypes.DeleteResponseData>(
          "/delete",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async list(
    data: WalletAPITypes.ListRequestBody,
  ): Promise<WalletAPITypes.ListResponseData> {
    try {
      const response =
        await axiosClient.post<WalletAPITypes.ListResponseData>(
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

