import authSlice, { login, logout, register, fetch } from "./slice";
import { authApi } from "./api";

const objectToExport = {
	authSlice,
	authApi,
	actions: {
		login,
		logout,
		register,
		fetch,
	},
};

export default objectToExport;
