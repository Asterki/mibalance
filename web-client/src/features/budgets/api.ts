import axios from "axios";
import * as BudgetAPITypes from "../../../../shared/types/api/budget";
import ApiUtils from "../../utils/api";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SERVER_URL + "/api/budgets"
    : "/api/budgets";

// Create an Axios client with credentials enabled by default
const axiosClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // Always include credentials
});

export const categoriesApi = {
  async create(
    data: BudgetAPITypes.CreateRequestBody,
  ): Promise<BudgetAPITypes.CreateResponseData> {
    try {
      const response =
        await axiosClient.post<BudgetAPITypes.CreateResponseData>(
          "/create",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async get(
    data: BudgetAPITypes.GetRequestBody,
  ): Promise<BudgetAPITypes.GetResponseData> {
    try {
      const response =
        await axiosClient.post<BudgetAPITypes.GetResponseData>(
          "/get",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async update(
    data: BudgetAPITypes.UpdateRequestBody,
  ): Promise<BudgetAPITypes.UpdateResponseData> {
    try {
      const response =
        await axiosClient.post<BudgetAPITypes.UpdateResponseData>(
          "/update",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async delete(
    data: BudgetAPITypes.DeleteRequestBody,
  ): Promise<BudgetAPITypes.DeleteResponseData> {
    try {
      const response =
        await axiosClient.post<BudgetAPITypes.DeleteResponseData>(
          "/delete",
          data,
        );
      return response.data;
    } catch (error) {
      return ApiUtils.handleAxiosError(error);
    }
  },

  async list(
    data: BudgetAPITypes.ListRequestBody,
  ): Promise<BudgetAPITypes.ListResponseData> {
    try {
      const response =
        await axiosClient.post<BudgetAPITypes.ListResponseData>(
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


