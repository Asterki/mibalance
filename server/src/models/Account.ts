import mongoose from "mongoose";

export type IAccount = mongoose.Document & {
  _id: mongoose.Types.ObjectId;
  data: {
    lastLogin: Date;
    accountStatus: "active" | "locked";
  };
  email: {
    value: string;
    verified: boolean;
    lastChanged: Date;
    verificationToken: string | null;
    verificationTokenExpires: Date | null;
  };
  profile: {
    name: string;
    avatarUrl: string;
  };
  preferences: {
    general: {
      theme: string;
      language: string;
    };
    security: {
      tfaSecret: string | null;
      password: string;
      forgotPasswordToken: string | null;
      forgotPasswordTokenExpires: Date | null;
      lastPasswordChange: Date;
    };
    notifications: {
      newLogins: boolean;
      passwordChanges: boolean;
      walletUpdates: boolean;
      accountStatusChanges: boolean;
      emailChanges: boolean;
      profileChanges: boolean;
      securityAlerts: boolean;
      generalUpdates: boolean;
      marketing: boolean;
    };
  };
  updatedAt: Date;
  createdAt: Date;
  deleted: boolean;
  deletedAt: Date | null;
};

const accountSchema = new mongoose.Schema<IAccount>(
  {
    data: {
      lastLogin: { type: Date, default: () => new Date() },
      accountStatus: {
        type: String,
        enum: ["active", "locked"],
        default: "active",
      },
    },
    email: {
      value: { type: String, required: true, unique: true },
      verified: { type: Boolean, default: false },
      lastChanged: { type: Date, default: () => new Date() },
      verificationToken: { type: String, default: null },
      verificationTokenExpires: { type: Date, default: null },
    },
    profile: {
      name: { type: String, required: true },
      avatarUrl: { type: String, default: null },
    },
    preferences: {
      general: {
        theme: { type: String, enum: ["dark", "light"], default: "light" },
        language: { type: String, enum: ["en", "es", "de"], default: "es" },
      },
      security: {
        tfaSecret: {
          type: String,
          default: null,
        },
        password: { type: String, required: true },
        forgotPasswordToken: { type: String, default: null },
        forgotPasswordTokenExpires: { type: Date, default: null },
        lastPasswordChange: { type: Date, default: () => new Date() },
      },
      notifications: {
        newLogins: { type: Boolean, default: true },
        passwordChanges: { type: Boolean, default: true },
        walletUpdates: { type: Boolean, default: true },
        accountStatusChanges: { type: Boolean, default: true },
        emailChanges: { type: Boolean, default: true },
        profileChanges: { type: Boolean, default: true },
        securityAlerts: { type: Boolean, default: true },
        generalUpdates: { type: Boolean, default: true },
        marketing: { type: Boolean, default: true },
      },
    },
    updatedAt: { type: Date, default: () => new Date() },
    createdAt: { type: Date, default: () => new Date() },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

const AccountModel = mongoose.model<IAccount>("Account", accountSchema);
export default AccountModel;
