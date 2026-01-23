import { Schema, model } from "mongoose";
import { IDeposit } from "./deposit.interface";
import { depositStatus } from "./deposit.constants";

const depositSchema = new Schema<IDeposit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Deposit amount must be greater than 0"],
    },
    payType: {
      type: String,
      required: true,
      trim: true,
    },
    trxID: {
      type: String,
      required: true,
      unique: true, // same trxID should not be used more than once
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(depositStatus),
      default: depositStatus.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Helpful indexes
depositSchema.index({ userId: 1, createdAt: -1 });

export const DepositModel = model<IDeposit>("Deposit", depositSchema);
