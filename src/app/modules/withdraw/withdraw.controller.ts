/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { WithdrawService } from "./withdraw.service";
import { TWithdrawStatus } from "./withdraw.constants";

const createWithdraw = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user;
    req.body.userId = userId;
    const { ...userData } = req.body;
    const result = await WithdrawService.createWithdraw(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Withdraw request created successfully!",
      data: result
    })
  }
);



const getWithdrawList = catchAsync(
  async (req: Request, res: Response) => {
    const { status, page, limit } = req.query;

    const result = await WithdrawService.getWithdrawListForAdmin({
      status: status as TWithdrawStatus,
      page: Number(page),
      limit: Number(limit),
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Withdraw list fetched successfully",
      data: result.data,
    });
  }
)


const approveWithdraw = catchAsync(
  async (req: Request, res: Response) => {
    const { withdrawId } = req.params;

    const result = await WithdrawService.approveWithdraw(withdrawId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Withdraw approved successfully",
      data: result,
    });
  }
)


const rejectedWithdraw = catchAsync(
  async (req: Request, res: Response) => {
    const { withdrawId } = req.params;

    const result = await WithdrawService.rejectWithdraw(withdrawId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Withdraw rejected successfully",
      data: result,
    });
  }
)


export const withdrawController = {
  createWithdraw,
  getWithdrawList,
  approveWithdraw,
  rejectedWithdraw,
}