import { Schema, model, Types } from "mongoose";
import { IAccount } from "./Account";

export interface IWallet {
  account: Types.ObjectId | IAccount; // Owner of the wallet
  name: string;
  description?: string;
  balance: number;
  currency: string;

  type: "cash" | "bank" | "credit" | "investment" | "other";
  institution?: string; // Bank/institution name if relevant
  isPrimary: boolean; // Primary wallet for default use

  color?: string; // UI customization
  icon?: string;

  deleted: boolean; // Soft delete flag
  deletedAt?: Date; // Soft delete timestamp
  createdAt?: Date;
  updatedAt?: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "USD" },

    type: {
      type: String,
      enum: ["cash", "bank", "credit", "investment", "other"],
      required: true,
    },
    institution: { type: String },
    isPrimary: { type: Boolean, default: false },

    color: { type: String },
    icon: { type: String },

    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

WalletSchema.index({ account: 1, isPrimary: -1 });

const WalletModel = model<IWallet>("Wallet", WalletSchema);
export default WalletModel;
