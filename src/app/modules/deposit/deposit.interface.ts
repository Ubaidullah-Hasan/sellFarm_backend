import { Document, Types } from "mongoose";
import { TDepositStatus, TPaymentType } from "./deposit.constants";

export interface IDeposit extends Document {
    userId: Types.ObjectId;
    amount: number;
    payType: TPaymentType;
    trxID: string;
    status: TDepositStatus;
}
