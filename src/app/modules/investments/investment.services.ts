import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { InvestmentModel } from "./investment.model";
import { UserModel } from "../users/user.model";
import { Product } from "../products/products.model";
import e from "cors";
import { investmentStatus } from "./investment.constants";

type CreateInvestmentPayload = {
  userId: string;      // from token
  productId: string;
  amount: number;
};

const createInvestmentIntoDB = async (payload: CreateInvestmentPayload) => {
  const { userId, productId, amount } = payload;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if ((user.balance as number) < amount) {
    throw new AppError(StatusCodes.CONFLICT, "Insufficient balance");
  }

  const product = await Product.findById(productId);


  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }



  const existInvestment = await InvestmentModel.findOne({ productId, userId });

  let investment;

  if (existInvestment) {
    if (existInvestment.investedQuantatity! >= product.maxInvestCountPerPerson) {
      throw new AppError(StatusCodes.CONFLICT, "You have already invested in this product not more allow.");
    }
    existInvestment.investedQuantatity! += 1;
    existInvestment.status = investmentStatus.PENDING;
    investment = await existInvestment.save();
  } else {
    investment = await InvestmentModel.create({
      userId,
      productId,
      amount,
      status: investmentStatus.PENDING,
      investedQuantatity: 1
    });
  }


  if (investment) {
    user.balance! -= amount;
    await user.save();
  }

  return investment;
};

// const getInvestmentsByUserFromDB = async (userId: string) => {
//   const data = await Investment.find({ userId: new Types.ObjectId(userId) })
//     .populate("productId") // product details দেখাবে
//     .sort({ createdAt: -1 });

//   return data;
// };

// const getPendingInvestmentsFromDB = async () => {
//   const data = await Investment.find({ status: "pending" })
//     .populate("userId", "mobile role") // user info limited fields
//     .populate("productId")
//     .populate("payInfo") // optional
//     .sort({ createdAt: -1 });

//   return data;
// };

// const updateInvestmentStatusInDB = async (id: string, status: string) => {
//   const updated = await Investment.findByIdAndUpdate(
//     id,
//     { status },
//     { new: true, runValidators: true }
//   )
//     .populate("userId", "mobile role")
//     .populate("productId")
//     .populate("payInfo");

//   if (!updated) {
//     throw new AppError(StatusCodes.NOT_FOUND, "Investment not found");
//   }

//   return updated;
// };

export const InvestmentServices = {
  createInvestmentIntoDB,
  // getInvestmentsByUserFromDB,
  // getPendingInvestmentsFromDB,
  // updateInvestmentStatusInDB,
};