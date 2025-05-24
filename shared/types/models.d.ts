import mongoose from "mongoose";

export type ISessionAccount = {
  _id: string;
  profile: {
    name: string;
    avatarUrl: string;
  };
  email: {
    value: string;
    verified: boolean;
  };
  data: {
    accountStatus: "active" | "locked";
  };
  preferences: {
    general: {
      theme: string;
      language: string;
    };
    security: {
      twoFactorEnabled: boolean;
    };
  };
};

export type ResponseStatus =
  | "internal-error"
  | "success"
  | "unauthenticated"
  | "forbidden"
  | "network-error"
  | "invalid-parameters";
