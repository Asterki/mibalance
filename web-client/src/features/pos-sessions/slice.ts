import { WritableDraft } from "immer";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import boxClosureApi from "./api";
import { IPOSSession } from "../../../../server/src/models/POSSession";

export interface ConfigState {
	POSSession: IPOSSession | null;
	loading: boolean;
	error: string | null;
}

const initialState: ConfigState = {
	POSSession: null,
	loading: false,
	error: null,
};

// Define thunks
export const fetchByCurrentUser = createAsyncThunk(
	"pos-session/fetch-by-current-user",
	async (_, thunkAPI) => {
		const result = await boxClosureApi.getByCurrentUser({
			status: "open",
		});

		if (result.status == "success" && result.POSSession) {
			return result.POSSession!;
		} else {
			return thunkAPI.rejectWithValue(result.status);
		}
	},
);

export const configSlice = createSlice({
	name: "config",
	initialState,
	reducers: {
		getSession: (state) => {
			return state;
		},
		setSession: (state, action: PayloadAction<IPOSSession | null>) => {
			state.POSSession = action.payload as WritableDraft<IPOSSession> | null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Get cases
			.addCase(fetchByCurrentUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchByCurrentUser.fulfilled, (state, action) => {
				state.POSSession = action.payload as WritableDraft<IPOSSession> | null;
				state.loading = false;
				state.error = null;
			})
			.addCase(fetchByCurrentUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export default configSlice;
