import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.services";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await authServices.loginUserFromDB(loginData);

  const { refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: "none",     // ✅ cross-site cookie জন্য must // todo
    path: "/",            // ✅ clearCookie করার সাথে match // todo
  });


  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User login successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  await authServices.logOutUser(res);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged out successfully',
    data: null,
  });
});

export const authController = {
  loginUser,
  refreshToken,
  logoutUser,
};