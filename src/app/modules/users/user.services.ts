import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
  const isExistUser = await UserModel.isExistUser(payload.mobile);

  if (isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Mobile number already exist!");
  }

  const result = await UserModel.create(payload);

  return result;
};

export const userServices = {
  createUserIntoDB,
};
