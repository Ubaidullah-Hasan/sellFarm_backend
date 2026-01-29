import { Types } from "mongoose";
import { WithdrawModel } from "./withdraw.model";
import { UserModel } from "../users/user.model";
import { TWithdrawStatus, withdrawStatus } from "./withdraw.constants";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const createWithdraw = async (payload: {
    name: string;
    paymentType: string;
    paymentNumber: string;
    userId: string;
    amount: number;
}) => {
    const { userId, amount } = payload;

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    // ❗ minimum balance check
    if ((user.balance as number) < 600) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Minimum balance 600 required to request withdraw"
        );
    }

    // ❗ amount validation
    if (amount > (user.balance as number)) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Withdraw amount exceeds balance"
        );
    }

    const withdraw = await WithdrawModel.create({
        ...payload,
        userId: new Types.ObjectId(userId),
        status: withdrawStatus.PENDING,
    });

    return withdraw;
};


type TGetWithdrawListParams = {
    status?: TWithdrawStatus;
    page?: number;
    limit?: number;
};



// GET /api/v1/withdraws?status=PENDING
// GET /api/v1/withdraws?status=PENDING&page=2&limit=20
const getWithdrawListForAdmin = async (
    params: TGetWithdrawListParams
) => {
    const {
        status,
        page = 1,
        limit = 10,
    } = params;

    const filter: Record<string, unknown> = {};

    // ✅ status wise filter
    if (status) {
        if (!Object.values(withdrawStatus).includes(status)) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Invalid withdraw status");
        }
        filter.status = status;
    }

    const skip = (page - 1) * limit;

    const data = await WithdrawModel.find(filter)
        .populate("userId", "mobile balance")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await WithdrawModel.countDocuments(filter);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data,
    };
};


const approveWithdraw = async (withdrawId: string) => {
    const withdraw = await WithdrawModel.findById(withdrawId);

    if (!withdraw) {
        throw new AppError(StatusCodes.NOT_FOUND, "Withdraw request not found");
    }

    // ❗ double approve guard
    if (withdraw.status === withdrawStatus.APPROVED) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Withdraw already approved"
        );
    }

    if (withdraw.status === withdrawStatus.REJECTED) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Rejected withdraw cannot be approved"
        );
    }

    const user = await UserModel.findById(withdraw.userId);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    // ❗ balance check again (admin time safety)
    if ((user.balance as number) < withdraw.amount) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "User balance insufficient"
        );
    }

    // ✅ deduct balance
    user.balance = (user.balance as number) - withdraw.amount;
    await user.save();

    // ✅ update withdraw status
    withdraw.status = withdrawStatus.APPROVED;
    await withdraw.save();

    const withdrawPopulate = await withdraw.populate("userId", "mobile role balance selfCode status _id");

    return withdrawPopulate;
};


const rejectWithdraw = async (
    withdrawId: string
) => {
    const withdraw = await WithdrawModel.findById(withdrawId);

    if (!withdraw) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Withdraw request not found"
        );
    }

    // ❗ already approved guard
    if (withdraw.status === withdrawStatus.APPROVED) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Approved withdraw cannot be rejected"
        );
    }

    // ❗ already rejected guard
    if (withdraw.status === withdrawStatus.REJECTED) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Withdraw already rejected"
        );
    }

    // ✅ reject withdraw
    withdraw.status = withdrawStatus.REJECTED;
    await withdraw.save();

    return {
        success: true,
        message: "Withdraw rejected successfully",
        withdraw,
    };
};

export const WithdrawService = {
    createWithdraw,
    getWithdrawListForAdmin,
    approveWithdraw,
    rejectWithdraw
};