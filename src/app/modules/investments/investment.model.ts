import { Schema, model } from "mongoose";
import { IInvestment } from "./investment.interface";
import { investmentStatus, investmentStatusEnum } from "./investment.constants";



const investmentSchema = new Schema<IInvestment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        investedQuantatity: {
            type: Number,
            default: 0
        },
        amount: {
            type: Number,
            required: true,
            min: [1, "Amount must be at least 1"],
        },
        status: {
            type: String,
            required: true,
            enum: investmentStatusEnum,
            default: investmentStatus.PENDING,
            index: true,
        },
        profitDaysPaid: {
            type: Number,
            default: 0
        },
        lastProfitAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true
    }
);


export const InvestmentModel = model<IInvestment>("Investment", investmentSchema);
