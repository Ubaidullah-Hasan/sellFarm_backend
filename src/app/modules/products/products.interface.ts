import { Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  image: string;
  dailyProfit: number;
  maxInvestCountPerPerson: number;
  investmentDayCycle: number;
  price: number;
  totalProfit?: number;
  // Don't need to explicitly define _id, createdAt, updatedAt
  // Mongoose Document already provides them with proper types  when use (extends Document)
  //   _id: Types.ObjectId;
  //   createdAt: Date;
  //   updatedAt: Date;
}
