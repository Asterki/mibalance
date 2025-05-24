import { IRecurringTransaction } from "../../../server/src/models/Recurring";
import { ResponseStatus } from "../models";

// Create RecurringTransaction
export type CreateRequestBody = {
  walletId: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  currency?: string;
  category: string;
  subcategory?: string;
  description?: string;
  paymentMethod?:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "crypto"
    | "other";
  frequency:
    | "daily"
    | "weekly"
    | "biweekly"
    | "monthly"
    | "quarterly"
    | "yearly";
  interval?: number;
  startDate: string; // ISO date string
  endDate?: string;
  nextRun: string;
  tags?: string[];
  notes?: string;
  attachments?: {
    fileUrl: string;
    fileName?: string;
    uploadedAt?: string;
  }[];
  isPaused?: boolean;
};
export type CreateResponseData = {
  status: ResponseStatus | "wallet-not-found";
  recurringTransaction?: IRecurringTransaction;
};

// List RecurringTransactions
export type ListRequestBody = {
  page: number;
  count: number;
  fields?: Array<keyof IRecurringTransaction>;
  includePaused?: boolean;
  filters?: {
    account?: string;
    type?: "income" | "expense" | "transfer";
    category?: string;
    frequency?:
      | "daily"
      | "weekly"
      | "biweekly"
      | "monthly"
      | "quarterly"
      | "yearly";
    startDateStart?: string;
    startDateEnd?: string;
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
  recurringTransactions?: IRecurringTransaction[];
  totalRecurringTransactions?: number;
};

// Update RecurringTransaction
export type UpdateRequestBody = {
  recurringTransactionId: string;
  walletId?: string;
  type?: "income" | "expense" | "transfer" | null;
  amount?: number | null;
  currency?: string | null;
  category?: string | null;
  subcategory?: string | null;
  description?: string | null;
  paymentMethod?:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "crypto"
    | "other"
    | null;
  frequency?:
    | "daily"
    | "weekly"
    | "biweekly"
    | "monthly"
    | "quarterly"
    | "yearly"
    | null;
  interval?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  nextRun?: string | null;
  tags?: string[] | null;
  notes?: string | null;
  attachments?:
    | {
        fileUrl: string;
        fileName?: string;
        uploadedAt?: string;
      }[]
    | null;
  isPaused?: boolean | null;
};
export type UpdateResponseData = {
  status: ResponseStatus | "not-found";
  recurringTransaction?: IRecurringTransaction;
};

// Delete RecurringTransaction
export type DeleteRequestBody = {
  recurringTransactionId: string;
};
export type DeleteResponseData = {
  status: ResponseStatus | "not-found";
};

// Get RecurringTransactions
export type GetRequestBody = {
  recurringTransactionIds: string[];
  fields?: Array<keyof IRecurringTransaction>;
};
export type GetResponseData = {
  status: ResponseStatus;
  recurringTransactions?: IRecurringTransaction[];
};
