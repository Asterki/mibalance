import POSSessionsAPI from "./api";
import POSSessionsSlice, { fetchByCurrentUser } from "./slice";

import { IPOSSession } from "../../../../server/src/models/POSSession";

const actions = {
	fetchByCurrentUser,
};

export type { IPOSSession };
export default {
	POSSessionsAPI,
	POSSessionsSlice,
	actions,
};
