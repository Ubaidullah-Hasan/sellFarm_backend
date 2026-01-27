import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { InvestmentModel } from "../investments/investment.model";
import { investmentStatus } from "../investments/investment.constants";

const createUserIntoDB = async (payload: TUser) => {
  const { referedCode } = payload;

  let referPerson = null;

  if (referedCode) {
    const isReferPerson = await UserModel.findOne({ selfCode: referedCode });
    referPerson = isReferPerson;

    if (!isReferPerson) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Without valid invitation code you can't register or use 'special'!");
    }
  }

  const isExistUser = await UserModel.isExistUser(payload.mobile);

  if (isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Mobile number already exist!");
  }

  const result = await UserModel.create({
    ...payload,
    invitedBy: referPerson && referPerson._id ? referPerson._id : null
  });

  return result;
};


const getUserProfileFromDB = async (
  user: JwtPayload
) => {
  const { mobile } = user;
  const isExistUser = await UserModel.isExistUser(mobile);
  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const userProfile = {
    _id: isExistUser._id,
    role: isExistUser.role,
    mobile: isExistUser.mobile,
    referedCode: isExistUser.referedCode,
    selfCode: isExistUser.selfCode,
    otpVerified: isExistUser.otpVarification?.verified || false,
    balance: isExistUser.balance,
    status: isExistUser.status,
    createdAt: isExistUser.createdAt,
  };

  return userProfile;
}


const getAllUsersFromDb = async () => {
  const users = await UserModel.find();
  return users;
}

const addProfitToUserBalance = async () => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /**
     * Eligible investments:
     * - status: ACCEPTED
     * - investedQuantatity > 0
     * - profitDaysPaid < product.investmentDayCycle
     */
    const rows = await InvestmentModel.aggregate([
      {
        $match: {
          status: investmentStatus.ACCEPTED,
          investedQuantatity: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // // profitDaysPaid default 0
      {
        $addFields: {
          profitDaysPaidSafe: { $ifNull: ["$profitDaysPaid", 0] },
        },
      },

      // // cycle not completed
      {
        $match: {
          $expr: { $lt: ["$profitDaysPaidSafe", "$product.investmentDayCycle"] },
        },
      },

      // // per-unit daily profit
      {
        $addFields: {
          dailyProfitAmount: {
            $multiply: ["$investedQuantatity", "$product.dailyProfit"],
          },
        },
      },

      {
        $project: {
          _id: 1,
          userId: 1,
          dailyProfitAmount: 1,
        },
      },
    ]).session(session);


    if (!rows.length) {
      await session.commitTransaction();
      return {
        success: true,
        message: "No eligible investments for profit today.",
        updatedUsers: 0,
        updatedInvestments: 0,
      };
    }

    // group profit by user
    const profitByUser = new Map<string, number>();
    const investmentIds: mongoose.Types.ObjectId[] = [];

    for (const r of rows) {
      const uid = String(r.userId);
      const profit = Number(r.dailyProfitAmount || 0);

      investmentIds.push(r._id);
      profitByUser.set(uid, (profitByUser.get(uid) || 0) + profit);
    }


    // // bulk update users balance
    const userOps = Array.from(profitByUser.entries()).map(([uid, total]) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(uid) },
        update: { $inc: { balance: total } },
      },
    }));

    const userResult = await UserModel.bulkWrite(userOps, { session });

    // // mark investments paid for today
    const now = new Date();
    const investResult = await InvestmentModel.updateMany(
      { _id: { $in: investmentIds } },
      {
        $inc: { profitDaysPaid: 1 },
        $set: { lastProfitAt: now },
      },
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      message: "Daily profit added successfully.",
      updatedUsers: userResult.modifiedCount ?? 0,
      updatedInvestments: investResult.modifiedCount,
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};



export const userServices = {
  createUserIntoDB,
  getUserProfileFromDB,
  getAllUsersFromDb,
  addProfitToUserBalance
};
