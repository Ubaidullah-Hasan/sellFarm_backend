import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import { UserModel } from "../users/user.model";
import { TLoginUser } from "./auth.interface";
import { userStatus } from "../users/user.constants";

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

  return user;

  //   //check match password
  //   if (!await bcrypt.compare(password, isExistUser.password)) {

  //     throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  //   }

  //create token
  //   const accessToken = jwtHelper.createToken(
  //     { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
  //     config.jwt.jwt_secret as Secret,
  //     config.jwt.jwt_expire_in as string
  //   );

  //   const refreshToken = jwtHelper.createToken(
  //     { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
  //     config.jwt.jwt_refresh as Secret,
  //     config.jwt.jwt_refresh_expire_in as string
  //   );

  //   return {
  //     id: isExistUser._id,
  //     accessToken,
  //     refreshToken,
  //     role: isExistUser.role,
  //   };
};

export const authServices = {
  loginUserFromDB,
};
