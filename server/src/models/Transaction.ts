import { Schema, model, Types } from "mongoose";

import { IAccount } from "./Account";

export interface ITransaction {
  _id: Types.ObjectId; // Reference to the user who owns the transaction
  account: Types.ObjectId | IAccount; // Reference to the user who owns the transaction
  wallet: Types.ObjectId; // Reference to the wallet associated with the transaction
  type: "income" | "expense" | "transfer";
  amount: number;
  currency: string; // e.g., 'USD', 'EUR', 'INR'
  category: string; // e.g., 'Food', 'Salary', 'Investment'
  subcategory?: string; // Optional detailed subcategory
  date: Date;
  description?: string;
  paymentMethod?:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "crypto"
    | "other";
  isRecurring?: boolean;
  recurrence?: {
    frequency:
      | "daily"
      | "weekly"
      | "biweekly"
      | "monthly"
      | "quarterly"
      | "yearly";
    endDate?: Date;
    interval?: number; // e.g., every 2 weeks
  };
  tags?: string[]; // e.g., ['groceries', 'work', 'business']
  deleted?: boolean;
  deletedAt?: Date;
  notes?: string;
  attachments?: {
    fileUrl: string;
    fileName: string;
    uploadedAt: Date;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },
    wallet: { type: Schema.Types.ObjectId, required: true }, // Reference to the wallet
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    category: { type: String, required: true },
    subcategory: { type: String },
    date: { type: Date, required: true },
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
    isRecurring: { type: Boolean, default: false },
    recurrence: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"],
      },
      endDate: { type: Date },
      interval: { type: Number, min: 1, default: 1 },
    },
    tags: [{ type: String }],
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    notes: { type: String },
    attachments: [
      {
        fileUrl: { type: String, required: true },
        fileName: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);

export default TransactionModel;
