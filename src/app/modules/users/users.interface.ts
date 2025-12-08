import { ObjectId } from "mongoose";

export type TOtpVarification = {
    _id: ObjectId;
    otp: string;
    erpireAt: Date;
}

export type TUser = {
    _id?: ObjectId;
    role?: string;
    mobile: string;
    password: string;
    invitedBy: ObjectId;
    selfCode: ObjectId;
    otpVarification?: TOtpVarification; 
    createdAt?: Date;
    updatedAt?: Date;
}