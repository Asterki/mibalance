import axios from "axios";
import * as ProductsAPITypes from "../../../../shared/types/api/products";

import ApiUtils from "../../utils/api";

const baseUrl =
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_SERVER_URL + "/api/products"
		: "/api/products";

const generateBarcode =
	async (): Promise<ProductsAPITypes.GenerateBarcodeResponseData> => {
		try {
			const response = await axios.get(`${baseUrl}/utils/generate-barcode`, {
				withCredentials: true,
			});

			return response.data;
		} catch (error) {
			return ApiUtils.handleAxiosError(error);
		}
	};

const productsUtils = {
	generateBarcode,
};

export default productsUtils;
