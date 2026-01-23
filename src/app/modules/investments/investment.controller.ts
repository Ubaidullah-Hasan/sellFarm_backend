import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { InvestmentServices } from "./investment.services";

const createInvestment = catchAsync(async (req: Request, res: Response) => {
    // ✅ logged in user id from token
    const { userId } = req.user;
    const { productId, amount } = req.body;

    const result = await InvestmentServices.createInvestmentIntoDB({
        userId,
        productId,
        amount,
    });

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Investment created successfully",
        data: result,
    });
});

// const getMyInvestments = catchAsync(async (req: Request, res: Response) => {
//   const userId = (req.user as any)?.userId;

//   const result = await investmentServices.getInvestmentsByUserFromDB(userId);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "My investments fetched successfully",
//     data: result,
//   });
// });

// const getPendingInvestments = catchAsync(async (req: Request, res: Response) => {
//   const result = await investmentServices.getPendingInvestmentsFromDB();

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Pending investments fetched successfully",
//     data: result,
//   });
// });

// const updateInvestmentStatus = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   const result = await investmentServices.updateInvestmentStatusInDB(id, status);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Investment status updated successfully",
//     data: result,
//   });
// });

export const InvestmentControllers = {
    createInvestment,
    //   getMyInvestments,
    //   getPendingInvestments,
    //   updateInvestmentStatus,
};
