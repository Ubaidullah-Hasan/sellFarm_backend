import { Document, Types } from "mongoose";
import { TWithdrawStatus } from "./withdraw.constants";

export interface IWithdraw extends Document {
    name: string;
    paymentType: string;
    paymentNumber: string;
    userId: Types.ObjectId;
    amount: number;
    status: TWithdrawStatus;
    createdAt?: Date;
    updatedAt?: Date;
};
