import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { UserModel } from "../users/user.model";
import { TLoginUser } from "./auth.interface";
import { userStatus } from "../users/user.constants";
import { createToken } from "./auth.utils";
import config from "../../../config";

const loginUserFromDB = async (payload: TLoginUser) => {
  const { mobile, password } = payload;
  const user = await UserModel.findOne({ mobile }).select("+password");
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check blocked status
  if (user.status === userStatus.BLOCKED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Account is Blocked!");
  }
  // check password using instance method
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is incorrect!");
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role as string,
    mobile: user.mobile,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authServices = {
  loginUserFromDB,
};
