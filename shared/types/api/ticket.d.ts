import { Ticket } from "../models";

// #region Tickets
export type CreateTicketRequestBody = {
	title: string;
	body: string;
};
export type CreateTicketResponseData = {
	ticketId?: string;
	status: "success" | "unauthorized" | "internal-error";
};

export type DeleteTicketRequestBody = {
	ticketId: string;
};
export type DeleteTicketResponseData = {
	status: "success" | "unauthorized" | "internal-error" | "not-found";
};

export type GetTicketsQuery = {
	count: string;
	offset: string;
	status?: "open" | "closed";
	assigneeId?: string;
	creatorEmail?: string;
};
export type GetTicketsResponseData = {
	tickets?: Ticket[];
	status: "success" | "unauthorized" | "internal-error";
};

export type GetTicketsByIdBody = {
	ticketId: string;
};
export type GetTicketsByIdResponseData = {
	ticket?: Ticket;
	status: "success" | "unauthorized" | "internal-error" | "not-found";
};

export type UpdateTicketsRequestBody = {
	ticketId: string;
	data: {
		status: "open" | "closed";
		assigneeId?: string;
	};
};
export type UpdateTicketsResponseData = {
	status: "success" | "unauthorized" | "internal-error" | "not-found";
	ticket?: Ticket;
};
// #endregion

//# region TicketComments
export type CreateTicketCommentRequestBody = {
	ticketId: string;
	content: string;
};
export type CreateTicketCommentResponseData = {
	status: "success" | "unauthorized" | "internal-error" | "not-found";
};

export type DeleteTicketCommentRequestBody = {
	commentId: string;
};
export type DeleteTicketCommentResponseData = {
	status: "success" | "unauthorized" | "internal-error" | "not-found";
};

export type GetTicketCommentsQuery = {
	count: string;
	offset: string;
	ticketId: string;
};
export type GetTicketCommentsResponseData = {
	comments?: TicketComment[];
	status: "success" | "unauthorized" | "internal-error" | "not-found";
};
//#endregion
