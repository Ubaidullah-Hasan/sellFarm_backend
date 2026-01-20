/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.services";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const registerUser = catchAsync(
    async(req: Request, res: Response, next:NextFunction) => {
        const {...userData} = req.body;
        const result = await userServices.createUserIntoDB(userData);

        sendResponse(res, {
            success: true, 
            statusCode: StatusCodes.OK,
            message: "User created successfully!",
            data: result
        })
    }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await userServices.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});


export const userController = {
    registerUser,
    getUserProfile
}