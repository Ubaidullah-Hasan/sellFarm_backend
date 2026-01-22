import { Document, Types } from "mongoose";
import { TInvestmentStatus } from "./investment.constants";


export interface IInvestment extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  payInfo: Types.ObjectId; // payment collection/document ref
  amount: number;
  status?: TInvestmentStatus;
}
