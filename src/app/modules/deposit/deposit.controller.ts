import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { depositServices } from "./deposit.service";

const createDeposit = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { amount, payType, trxID } = req.body;

  const result = await depositServices.createDepositIntoDB({
    userId,
    amount,
    payType,
    trxID,
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Deposit request submitted",
    data: result,
  });
});

const getMyDeposits = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const result = await depositServices.getMyDepositsFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "My deposits fetched successfully",
    data: result,
  });
});

const updateDepositStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await depositServices.updateDepositStatusInDB(id, status);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Deposit ${status.toLowerCase()} successfully`,
    data: result,
  });
});

const getDepositsByStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.query;


    const result = await depositServices.getDepositsByStatusFromDB(status as string);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Deposits with status ${status} fetched successfully`,
      data: result,
    });
  }
);

export const depositControllers = {
  createDeposit,
  getMyDeposits,
  updateDepositStatus,
  getDepositsByStatus,
};
