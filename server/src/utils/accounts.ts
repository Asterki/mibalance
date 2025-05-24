import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { IAccount } from "../models/Account";
import { ISessionAccount } from "../../../shared/types/models";

const verifyPassword = (passwordHash: string, password: string): boolean => {
  return bcrypt.compareSync(password, passwordHash);
};

const verifyTFA = (tfaSecret: string, tfaCode: string): boolean => {
  return speakeasy.totp.verify({
    secret: tfaSecret,
    encoding: "base32",
    token: tfaCode,
  });
};

const createSessionAccount = async (
  account: IAccount,
): Promise<ISessionAccount> => {
  return {
    _id: account._id.toString(),
    profile: account.profile,
    email: {
      value: account.email.value,
      verified: account.email.verified,
    },
    data: {
      accountStatus: account.data.accountStatus,
    },
    preferences: {
      general: account.preferences.general, // Only include non-sensitive preferences
      security: {
        twoFactorEnabled: account.preferences.security.tfaSecret !== null,
      },
    },
  };
};

export default {
  verifyPassword,
  verifyTFA,
  createSessionAccount,
};
