import { IWallet } from "../../../server/src/models/Wallet";
import { ResponseStatus } from "../models";

// --- Create
export type CreateRequestBody = {
  name: string;
  description?: string;
  balance: number;
  currency: string;
  type: IWallet["type"];
  institution?: string;
  isPrimary?: boolean;
  color?: string;
  icon?: string;
};

export type CreateResponseData = {
  status: ResponseStatus;
  wallet?: IWallet;
};

// --- Update
export type UpdateRequestBody = {
  walletId: string;
  name?: string;
  description?: string;
  balance?: number;
  currency?: string;
  type?: IWallet["type"];
  institution?: string;
  isPrimary?: boolean;
  color?: string;
  icon?: string;
};

export type UpdateResponseData = {
  status: ResponseStatus | "not-found";
  wallet?: IWallet;
};

// --- Delete
export type DeleteRequestBody = {
  walletId: string;
};
export type DeleteResponseData = {
  status: ResponseStatus | "not-found";
};

// --- Get
export type GetRequestBody = {
  walletIds: string[];
  fields?: Array<keyof IWallet>;
};
export type GetResponseData = {
  status: ResponseStatus;
  wallets?: IWallet[];
};

// --- List
export type ListRequestBody = {
  page: number;
  count: number;
  fields?: Array<keyof IWallet>;
  filters?: {
    type?: IWallet["type"];
    currency?: string;
    isPrimary?: boolean;
    archived?: boolean;
  };
  search?: {
    query: string;
    searchIn: Array<"name" | "description" | "institution">;
  };
};

export type ListResponseData = {
  status: ResponseStatus;
  wallets?: IWallet[];
  totalWallets?: number;
};
