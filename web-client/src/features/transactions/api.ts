import axios from "axios";
import * as TransactionAPITypes from "../../../../shared/types/api/transactions";
import ApiUtils from "../../utils/api";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SERVER_URL + "/api/transactions"
    : "/api/transactions";

// Create an Axios client with credentials enabled by default
const axiosClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // Always include credentials
});

export const categoriesApi = {
  async create(
    data: TransactionAPITypes.CreateRequestBody,
  ): Promise<TransactionAPITypes.CreateResponseData> {
    try {
      const response =
        await axiosClient.post<TransactionAPITypes.CreateResponseData>(
          "/create",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async get(
    data: TransactionAPITypes.GetRequestBody,
  ): Promise<TransactionAPITypes.GetResponseData> {
    try {
      const response =
        await axiosClient.post<TransactionAPITypes.GetResponseData>(
          "/get",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async update(
    data: TransactionAPITypes.UpdateRequestBody,
  ): Promise<TransactionAPITypes.UpdateResponseData> {
    try {
      const response =
        await axiosClient.post<TransactionAPITypes.UpdateResponseData>(
          "/update",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async delete(
    data: TransactionAPITypes.DeleteRequestBody,
  ): Promise<TransactionAPITypes.DeleteResponseData> {
    try {
      const response =
        await axiosClient.post<TransactionAPITypes.DeleteResponseData>(
          "/delete",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async list(
    data: TransactionAPITypes.ListRequestBody,
  ): Promise<TransactionAPITypes.ListResponseData> {
    try {
      const response =
        await axiosClient.post<TransactionAPITypes.ListResponseData>(
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
