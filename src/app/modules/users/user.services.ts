import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
  const { referedCode } = payload;
  
  let referPerson;

  if (referedCode === "special") {
    referPerson = null;
  } else {
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

export const userServices = {
  createUserIntoDB,
};
