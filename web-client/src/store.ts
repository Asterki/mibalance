import { configureStore } from "@reduxjs/toolkit";

// Import reducers
import AuthFeature from "./features/auth";
import ConfigFeature from "./features/config";
import POSSessionsFeature from "./features/pos-sessions";

export const store = configureStore({
	reducer: {
		config: ConfigFeature.configSlice.reducer,
		auth: AuthFeature.authSlice.reducer,
		POSSessions: POSSessionsFeature.POSSessionsSlice.reducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
