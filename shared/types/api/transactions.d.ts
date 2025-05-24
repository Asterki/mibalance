import { ITransaction } from "../../../server/src/models/Transaction";
import { ResponseStatus } from "../models";

// Create Transaction
export type CreateRequestBody = {
  walletId: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  currency?: string;
  category: string;
  subcategory?: string;
  date: string; // ISO date string
  description?: string;
  paymentMethod?:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "crypto"
    | "other";
  isRecurring?: boolean;
  recurrence?: {
    frequency:
      | "daily"
      | "weekly"
      | "biweekly"
      | "monthly"
      | "quarterly"
      | "yearly";
    endDate?: string;
    interval?: number;
  };
  tags?: string[];
  isCleared?: boolean;
  notes?: string;
  attachments?: {
    fileUrl: string;
    fileName?: string;
    uploadedAt?: string;
  }[];
};
export type CreateResponseData = {
  status: ResponseStatus;
  transaction?: ITransaction;
};

// List Transactions
export type ListRequestBody = {
  page: number;
  count: number;
  fields?: Array<keyof ITransaction>;
  includeDeleted?: boolean;
  filters?: {
    account?: string;
    type?: "income" | "expense" | "transfer";
    category?: string;
    dateStart?: string;
    dateEnd?: string;
    isCleared?: boolean;
  };
  search?: {
    query: string;
    searchIn: Array<
      "category" | "subcategory" | "description" | "tags" | "notes"
    >;
  };
};
export type ListResponseData = {
  status: ResponseStatus;
  transactions?: ITransaction[];
  totalTransactions?: number;
};

// Update Transaction
export type UpdateRequestBody = {
  transactionId: string;
  walletId?: string;
  type?: "income" | "expense" | "transfer" | null;
  amount?: number | null;
  currency?: string | null;
  category?: string | null;
  subcategory?: string | null;
  date?: string | null;
  description?: string | null;
  paymentMethod?:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "crypto"
    | "other"
    | null;
  isRecurring?: boolean | null;
  recurrence?: {
    frequency?:
      | "daily"
      | "weekly"
      | "biweekly"
      | "monthly"
      | "quarterly"
      | "yearly"
      | null;
    endDate?: string | null;
    interval?: number | null;
  } | null;
  tags?: string[] | null;
  isCleared?: boolean | null;
  notes?: string | null;
  attachments?:
    | {
        fileUrl: string;
        fileName?: string;
        uploadedAt?: string;
      }[]
    | null;
};
export type UpdateResponseData = {
  status: ResponseStatus | "not-found";
  transaction?: ITransaction;
};

// Delete Transaction
export type DeleteRequestBody = {
  transactionId: string;
};
export type DeleteResponseData = {
  status: ResponseStatus | "not-found";
};

// Get Transactions
export type GetRequestBody = {
  transactionIds: string[];
  fields?: Array<keyof ITransaction>;
};
export type GetResponseData = {
  status: ResponseStatus;
  transactions?: ITransaction[];
};
