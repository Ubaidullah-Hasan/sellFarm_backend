import { Types } from "mongoose";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { DepositModel } from "./deposit.model";
import { depositStatus } from "./deposit.constants";
import { UserModel } from "../users/user.model";

type CreateDepositPayload = {
  userId: string;
  amount: number;
  payType: string;
  trxID: string;
};

const createDepositIntoDB = async (payload: CreateDepositPayload) => {
  const exists = await DepositModel.findOne({ trxID: payload.trxID });
  if (exists) {
    throw new AppError(StatusCodes.CONFLICT, "Transaction request already submitted.");
  }

  const deposit = await DepositModel.create({
    userId: new Types.ObjectId(payload.userId),
    amount: payload.amount,
    payType: payload.payType,
    trxID: payload.trxID,
    status: depositStatus.PENDING,
  });

  return deposit;
};

const getMyDepositsFromDB = async (userId: string) => {
  return DepositModel.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 });
};

const updateDepositStatusInDB = async (id: string, status: string) => {
  const deposit = await DepositModel
    .findById(id)
    .populate("userId", "mobile role balance selfCode status _id");

  if (!deposit) {
    throw new AppError(StatusCodes.NOT_FOUND, "Deposit not found");
  }

  // already final?
  if (
    deposit.status === depositStatus.APPROVED ||
    deposit.status === depositStatus.REJECTED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Deposit already processed"
    );
  }

  // APPROVE → balance update
  if (status === depositStatus.APPROVED) {
    await UserModel.findByIdAndUpdate(deposit.userId, {
      $inc: { balance: deposit.amount },
    });
  }

  deposit.status = status as typeof depositStatus[keyof typeof depositStatus];
  await deposit.save();

  const populatedDeposit = await deposit.populate("userId", "mobile role balance selfCode status _id");

  return populatedDeposit;
};

const getDepositsByStatusFromDB = async (status: string) => {
  if (!status) {
    throw new AppError(StatusCodes.BAD_REQUEST, "status query is required");
  }
  // status validation (extra safety)
  if (!Object.values(depositStatus).includes(status as typeof depositStatus[keyof typeof depositStatus])) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid deposit status");
  }

  const deposits = await DepositModel.find({ status })
    .populate("userId", "mobile role balance")
    .sort({ createdAt: -1 });

  return deposits;
};

export const depositServices = {
  createDepositIntoDB,
  getMyDepositsFromDB,
  updateDepositStatusInDB,
  getDepositsByStatusFromDB,
};
