import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { UserModel } from "../users/user.model";
import { TLoginUser } from "./auth.interface";
import { userStatus } from "../users/user.constants";
import { createToken, verifyToken } from "./auth.utils";
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
    throw new AppError(StatusCodes.BAD_REQUEST, "লগইন ব্যর্থ হয়েছে! মোবাইল নম্বর বা পাসওয়ার্ড চেক করুন!");
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
  
  const userResponse = {
  _id: user._id,
  role: user.role,
  mobile: user.mobile,
  referedCode: user.referedCode,
  selfCode: user.selfCode,
  otpVerified: user.otpVarification?.verified || false,
  balance: user.balance,
  status: user.status,
  createdAt: user.createdAt,
};

  return {
    accessToken,
    refreshToken,
    user: userResponse
  };
};

const refreshToken = async (token: string) => {

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
  }


  // // checking if the user is blocked
  const currentUserStatus = user?.status;

  if (currentUserStatus === userStatus.BLOCKED) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked!');
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

  return { accessToken };
}


export const authServices = {
  loginUserFromDB,
  refreshToken
};
