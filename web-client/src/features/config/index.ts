import configAPI from "./api";
import configSlice, { fetchConfig } from "./slice";

import { IConfig } from "../../../../server/src/models/Config";

const objectToExport = {
	configAPI,
	configSlice,
	actions: {
		fetchConfig,
	},
};

export type { IConfig };
export default objectToExport;
