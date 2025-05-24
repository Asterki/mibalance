import { IBudget } from "../../../server/src/models/Budget";
import { ResponseStatus } from "../models";

// Create Budget
export type CreateRequestBody = {
  walletId: string;
  category: string;
  subcategory?: string;
  amount: number;
  currency?: string;
  period: "monthly" | "weekly" | "yearly" | "custom";
  startDate: string; // ISO date string
  endDate?: string;
  rollover?: boolean;
  isRecurring?: boolean;
  isArchived?: boolean;
  notes?: string;
  tags?: string[];
};
export type CreateResponseData = {
  status: ResponseStatus;
  budget?: IBudget;
};

// List Budgets
export type ListRequestBody = {
  page: number;
  count: number;
  fields?: Array<keyof IBudget>;
  includeArchived?: boolean;
  filters?: {
    account?: string;
    category?: string;
    period?: "monthly" | "weekly" | "yearly" | "custom";
    startDateStart?: string;
    startDateEnd?: string;
  };
  search?: {
    query: string;
    searchIn: Array<"category" | "subcategory" | "notes" | "tags">;
  };
};
export type ListResponseData = {
  status: ResponseStatus;
  budgets?: IBudget[];
  totalBudgets?: number;
};

// Update Budget
export type UpdateRequestBody = {
  budgetId: string;
  walletId?: string;
  category?: string | null;
  subcategory?: string | null;
  amount?: number | null;
  currency?: string | null;
  period?: "monthly" | "weekly" | "yearly" | "custom" | null;
  startDate?: string | null;
  endDate?: string | null;
  rollover?: boolean | null;
  isRecurring?: boolean | null;
  isArchived?: boolean | null;
  notes?: string | null;
  tags?: string[] | null;
};
export type UpdateResponseData = {
  status: ResponseStatus | "not-found";
  budget?: IBudget;
};

// Delete Budget
export type DeleteRequestBody = {
  budgetId: string;
};
export type DeleteResponseData = {
  status: ResponseStatus | "not-found";
};

// Get Budgets
export type GetRequestBody = {
  budgetIds: string[];
  fields?: Array<keyof IBudget>;
};
export type GetResponseData = {
  status: ResponseStatus;
  budgets?: IBudget[];
};
