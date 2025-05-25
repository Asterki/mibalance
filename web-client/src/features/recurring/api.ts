import axios from "axios";
import * as RecurringAPITypes from "../../../../shared/types/api/recurring";
import ApiUtils from "../../utils/api";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SERVER_URL + "/api/recurring"
    : "/api/recurring";

// Create an Axios client with credentials enabled by default
const axiosClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // Always include credentials
});

export const categoriesApi = {
  async create(
    data: RecurringAPITypes.CreateRequestBody,
  ): Promise<RecurringAPITypes.CreateResponseData> {
    try {
      const response =
        await axiosClient.post<RecurringAPITypes.CreateResponseData>(
          "/create",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async get(
    data: RecurringAPITypes.GetRequestBody,
  ): Promise<RecurringAPITypes.GetResponseData> {
    try {
      const response =
        await axiosClient.post<RecurringAPITypes.GetResponseData>(
          "/get",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async update(
    data: RecurringAPITypes.UpdateRequestBody,
  ): Promise<RecurringAPITypes.UpdateResponseData> {
    try {
      const response =
        await axiosClient.post<RecurringAPITypes.UpdateResponseData>(
          "/update",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async delete(
    data: RecurringAPITypes.DeleteRequestBody,
  ): Promise<RecurringAPITypes.DeleteResponseData> {
    try {
      const response =
        await axiosClient.post<RecurringAPITypes.DeleteResponseData>(
          "/delete",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async list(
    data: RecurringAPITypes.ListRequestBody,
  ): Promise<RecurringAPITypes.ListResponseData> {
    try {
      const response =
        await axiosClient.post<RecurringAPITypes.ListResponseData>(
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

