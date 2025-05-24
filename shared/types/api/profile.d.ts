export interface UpdateProfileRequestBody {
	name?: string;
	avatarUrl?: string;
}

export interface UpdateProfileResponseData {
	status:
		| "success"
		| "internal-error"
		| "account-not-found"
		| "invalid-parameters"
		| "unauthenticated";
}

export interface UpdatePreferencesRequestBody {
	theme?: "light" | "dark";
	language?: "en" | "es";
}

export interface UpdatePreferencesResponseData {
	status:
		| "success"
		| "internal-error"
		| "account-not-found"
		| "invalid-parameters"
		| "unauthenticated";
}

export interface UpdateProfilePictureResponseData {
	status:
		| "success"
		| "internal-error"
		| "invalid-parameters"
		| "unauthenticated";
}

export interface FetchProfileRequestBody {
	accountIDs: string[];
}
export interface FetchProfileResponseData {
	status:
		| "success"
		| "internal-error"
		| "invalid-parameters"
		| "unauthenticated";
	profiles?: {
		_id: string;
		name: string;
		avatarUrl: string;
	}[];
}
