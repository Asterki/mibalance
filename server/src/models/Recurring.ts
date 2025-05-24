import { Schema, model, Types } from "mongoose";
import { IAccount } from "./Account";
import { IWallet } from "./Wallet";

export interface IRecurringTransaction {
  account: Types.ObjectId | IAccount; // Who owns it
  wallet: Types.ObjectId | IWallet; // Reference to the wallet associated with the transaction
  type: "income" | "expense" | "transfer";

  amount: number;
  currency: string;

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
  interval: number; // every N units of frequency
  startDate: Date;
  endDate?: Date;
  lastRun?: Date;
  nextRun: Date;

  tags?: string[];
  notes?: string;
  attachments?: {
    fileUrl: string;
    fileName: string;
    uploadedAt: Date;
  }[];

  isPaused: boolean;
  deleted: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const RecurringTransactionSchema = new Schema<IRecurringTransaction>(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },

    category: { type: String, required: true },
    subcategory: { type: String },

    description: { type: String },
    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "credit_card",
        "debit_card",
        "bank_transfer",
        "crypto",
        "other",
      ],
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    interval: { type: Number, default: 1, min: 1 },

    startDate: { type: Date, required: true },
    endDate: { type: Date },
    lastRun: { type: Date },
    nextRun: { type: Date, required: true },

    tags: [{ type: String }],
    notes: { type: String },
    attachments: [
      {
        fileUrl: { type: String, required: true },
        fileName: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    isPaused: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

// Optional indexes
RecurringTransactionSchema.index({ account: 1, nextRun: 1 });
RecurringTransactionSchema.index({ type: 1, frequency: 1 });

const RecurringTransactionModel = model<IRecurringTransaction>(
  "RecurringTransaction",
  RecurringTransactionSchema,
);

export default RecurringTransactionModel;
