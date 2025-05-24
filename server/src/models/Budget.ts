import { Schema, model, Types } from "mongoose";
import { IAccount } from "./Account";
import { IWallet } from "./Wallet";

export interface IBudget {
  account: Types.ObjectId | IAccount; // Owner of the budget
  wallet: Types.ObjectId | IWallet;
  category: string; // e.g., "Food"
  subcategory?: string; // Optional detailed target (e.g., "Dining Out")

  amount: number; // Target amount for the period
  currency: string; // e.g., 'USD', 'EUR'

  period: "monthly" | "weekly" | "yearly" | "custom"; // Repeats per period
  startDate: Date;
  endDate?: Date; // If period is custom or has limited duration

  rollover: boolean; // Does leftover roll into next period?
  isRecurring: boolean; // Should this auto-renew?
  isArchived: boolean; // For old/inactive budgets

  notes?: string;
  tags?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    category: { type: String, required: true },
    subcategory: { type: String },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },

    period: {
      type: String,
      enum: ["monthly", "weekly", "yearly", "custom"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },

    rollover: { type: Boolean, default: false },
    isRecurring: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },

    notes: { type: String },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

// Useful indexes
BudgetSchema.index({ account: 1, category: 1, period: 1, startDate: -1 });

export const Budget = model<IBudget>("Budget", BudgetSchema);
