import { Feedback } from "../models";

export interface CreateRequestBody {
	title: string;
	feedback: string;
}
export interface CreateResponseData {
	status:
		| "success"
		| "invalid-parameters"
		| "internal-error"
		| "unauthenticated"
		| "unauthorized";
}

export interface GetRequestBody {
	count: number;
	offset: number;
}
export interface GetResponseData {
	status:
		| "success"
		| "internal-error"
		| "unauthorized"
		| "unauthenticated"
		| "invalid-parameters";
	feedback?: Feedback[];
}

export interface DeleteRequestBody {
	feedbackId: string;
}
export interface DeleteResponseData {
	status:
		| "success"
		| "internal-error"
		| "invalid-parameters"
		| "unauthorized"
		| "unauthenticated";
}

export interface GetByIdRequestQuery {
	feedbackId: string;
}
export interface GetByIdResponseData {
	status:
		| "success"
		| "internal-error"
		| "unauthorized"
		| "unauthenticated"
		| "invalid-parameters"
		| "not-found";
	feedback?: Feedback;
}

export interface GetByEmailRequestQuery {
	email: string;
}
export interface GetByEmailResponseData {
	status:
		| "success"
		| "internal-error"
		| "unauthorized"
		| "unauthenticated"
		| "invalid-parameters";
	feedback?: Feedback[];
}
