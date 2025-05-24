import { ISessionAccount, ResponseStatus } from "../models";
import { IAccount } from "../../../server/src/models/Account";

// #region Account creation and deletion
export interface RegisterRequestBody {
  language: "en" | "fr" | "es" | "de";
  email: string;
  name: string;
  password: string;
}
export interface RegisterResponseData {
  status: "email-in-use" | ResponseStatus;
  account?: ISessionAccount;
}

export interface DeleteRequestBody {
  password: string;
  tfaCode?: string;
}

export interface DeleteResponseData {
  status:
    | "invalid-credentials"
    | "invalid-tfa-code"
    | "missing-tfa-code"
    | ResponseData;
}

// #endregion

// #region Account access

export interface LoginRequestBody {
  email: string;
  password: string;
  tfaCode?: string;
}
export interface LoginResponseData {
  status:
    | "invalid-credentials"
    | "requires-tfa"
    | "invalid-tfa-code"
    | ResponseStatus;
  account?: ISessionAccount;
}

export interface FetchResponseData {
  status: ResponseStatus;
  account?: ISessionAccount;
}

export interface LogoutResponseData {
  status: ResponseStatus;
}
// #endregion

// #region Account update
export interface UpdateAccountRequestBody {
  // These are the fields that can be updated, the rest are to be ignored
  profile?: {
    name?: string;
    avatarURL?: string;
    bio?: string;
  };
  preferences?: {
    general?: {
      theme?: string;
      language?: string;
    };
  };
}

export interface UpdateAccountResponseData {
  status: "account-not-found" | ResponseStatus;
  account?: IAccount;
}
// #endregion

// #region Account TFA
export interface GenerateTFASecretResponseData {
  status: ResponseStatus;
  secret?: string;
  otpauth?: string;
}

export interface EnableTFARequestBody {
  password: string;
  secret: string;
  tfaCode: string;
}

export interface EnableTFAResponseData {
  status:
    | "success"
    | "invalid-credentials"
    | "invalid-tfa-code"
    | "internal-error";
}

export interface DisableTFARequestBody {
  password: string;
  tfaCode: string;
}

export interface DisableTFAResponseData {
  status:
    | "success"
    | "invalid-credentials"
    | "invalid-tfa-code"
    | "tfa-not-enabled"
    | "internal-error";
}
// #endregion

// #region Account password
export interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponseData {
  status: "success" | "invalid-credentials" | "internal-error";
}

export interface ForgotPasswordRequestBody {
  email: string;
}

export interface ForgotPasswordResponseData {
  status:
    | "success"
    | "invalid-parameters"
    | "account-not-found"
    | "internal-error";
}

export interface ResetPasswordRequestBody {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponseData {
  status: "success" | "invalid-parameters" | "internal-error" | "invalid-token";
}
// #endregion

// #region Account email
export interface RequestAccountEmailVerificationResponseData {
  status:
    | "success"
    | "account-not-found"
    | "internal-error"
    | "email-already-verified";
}

export interface VerifyAccountEmailRequestBody {
  token: string;
}

export interface VerifyAccountEmailResponseData {
  status: "success" | "invalid-parameters" | "internal-error" | "invalid-token";
}

export interface ChangeEmailRequestBody {
  password: string;
  newEmail: string;
}

export interface ChangeEmailResponseData {
  status: "success" | "invalid-credentials" | "email-exists" | "internal-error";
}
// #endregion

export interface UpdateProfileRequestBody {
  name?: string;
  avatarURL?: string;
}
export interface UpdateProfileResponseData {
  status: ResponseStatus;
  account?: ISessionAccount;
}

export interface UpdatePreferencesRequestBody {
  theme?: string;
  language?: string;
}
export interface UpdatePreferencesResponseData {
  status: ResponseStatus;
  account?: ISessionAccount;
}
