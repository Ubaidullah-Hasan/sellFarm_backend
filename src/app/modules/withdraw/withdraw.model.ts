import { Schema, model } from "mongoose";
import { IWithdraw } from "./withdraw.interface";
import { withdrawStatus } from "./withdraw.constants";

const withdrawSchema = new Schema<IWithdraw>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    paymentType: {
      type: String,
      required: true,
      trim: true,
    },

    paymentNumber: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(withdrawStatus),
      default: withdrawStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export const WithdrawModel = model<IWithdraw>(
  "Withdraw",
  withdrawSchema
);
