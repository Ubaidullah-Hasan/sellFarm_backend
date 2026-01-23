import { Document, Types } from "mongoose";
import { TInvestmentStatus } from "./investment.constants";


export interface IInvestment extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  amount: number;
  status?: TInvestmentStatus;
  investedQuantatity?: number;
}
