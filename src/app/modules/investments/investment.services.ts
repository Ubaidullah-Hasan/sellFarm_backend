import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { InvestmentModel } from "./investment.model";
import { UserModel } from "../users/user.model";
import { Product } from "../products/products.model";
import { investmentStatus } from "./investment.constants";
import { Types } from "mongoose";

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

  // => previous logic with maxInvestCountPerPerson
  // const existInvestment = await InvestmentModel.findOne({ productId, userId, status: investmentStatus.ACCEPTED });

  // let investment;

  // if (existInvestment) {
  //   if (existInvestment.investedQuantatity! >= product.maxInvestCountPerPerson) {
  //     throw new AppError(StatusCodes.CONFLICT, "You have already invested in this product not more allow.");
  //   }
  //   existInvestment.investedQuantatity! += 1;
  //   existInvestment.status = investmentStatus.PENDING;
  //   investment = await existInvestment.save();
  // } else {
  //   investment = await InvestmentModel.create({
  //     userId,
  //     productId,
  //     amount,
  //     status: investmentStatus.PENDING,
  //     investedQuantatity: 1
  //   });
  // }

  // new logic: only one investment per user per product
  const existInvestment = await InvestmentModel.findOne({ productId, userId });
  if (existInvestment) {
    throw new AppError(StatusCodes.CONFLICT, "You have already invested in this product or already requested!");
  }

  const investment = await InvestmentModel.create({
    userId,
    productId,
    amount,
    status: investmentStatus.PENDING,
    investedQuantatity: 1
  });

  return investment;
};

// const getInvestmentsByUserFromDB = async (userId: string) => {
//   const data = await InvestmentModel.aggregate([
//     {
//       $match: {
//         userId: new Types.ObjectId(userId),
//         status: investmentStatus.ACCEPTED,
//       },
//     },

//     // product join
//     {
//       $lookup: {
//         from: "products",
//         localField: "productId",
//         foreignField: "_id",
//         as: "product",
//       },
//     },
//     { $unwind: "$product" },

//     // profitDaysPaid missing হলে 0 ধরে নেই
//     {
//       $addFields: {
//         profitDaysPaidSafe: { $ifNull: ["$profitDaysPaid", 0] },
//       },
//     },

//     // ❗️ cycle শেষ হয়ে গেলে বাদ
//     {
//       $match: {
//         $expr: {
//           $lt: ["$profitDaysPaidSafe", "$product.investmentDayCycle"],
//         },
//       },
//     },

//     // optional: user populate
//     {
//       $lookup: {
//         from: "users",
//         localField: "userId",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//     { $unwind: "$user" },

//     // sort
//     { $sort: { createdAt: -1 } },
//   ]);

//   return data;
// };


const getInvestmentsByUserFromDB = async (userId: string) => {
  const data = await InvestmentModel.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        status: investmentStatus.ACCEPTED,
      },
    },

    // ✅ Join product into temp field
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDoc",
      },
    },
    { $unwind: "$productDoc" },

    // ✅ Join user into temp field
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDoc",
      },
    },
    { $unwind: "$userDoc" },

    // ✅ profitDaysPaid missing হলে 0
    {
      $addFields: {
        profitDaysPaidSafe: { $ifNull: ["$profitDaysPaid", 0] },
      },
    },

    // ✅ cycle শেষ হলে বাদ
    {
      $match: {
        $expr: {
          $lt: ["$profitDaysPaidSafe", "$productDoc.investmentDayCycle"],
        },
      },
    },

    // ✅ populate-style: overwrite productId/userId with objects
    {
      $addFields: {
        productId: "$productDoc",
        userId: "$userDoc",
      },
    },

    // ✅ cleanup temp fields
    {
      $project: {
        productDoc: 0,
        userDoc: 0,
        profitDaysPaidSafe: 0,
        userId: 0,
      },
    },

    { $sort: { createdAt: -1 } },
  ]);

  return data;
};



const getPendingInvestmentsFromDB = async () => {
  const data = await InvestmentModel.find({ status: investmentStatus.PENDING })
    .populate("userId", "mobile role")
    .populate("productId")
    .sort({ createdAt: -1 });

  return data;
};

const updateInvestmentStatusInDB = async (id: string, status: string) => {
  const investment = await InvestmentModel.findById(id);

  if (!investment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Investment not found");
  }

  // already final state
  if (
    investment.status === investmentStatus.ACCEPTED ||
    investment.status === investmentStatus.REJECTED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Investment already processed"
    );
  }

  // ✅ APPROVE logic
  if (status === investmentStatus.ACCEPTED) {
    const user = await UserModel.findById(investment.userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    // balance check HERE (correct place)
    if ((user.balance as number) < investment.amount) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "User has insufficient balance"
      );
    }

    // deduct balance
    user.balance! -= investment.amount;
    await user.save();
  }

  // update status
  investment.status = status;
  await investment.save();

  const populatedInvestment = await investment.populate([
    { path: "userId", select: "mobile role balance" },
    { path: "productId", select: "title amount" },
  ]);

  return populatedInvestment;
};

export const InvestmentServices = {
  createInvestmentIntoDB,
  getInvestmentsByUserFromDB,
  getPendingInvestmentsFromDB,
  updateInvestmentStatusInDB,
};