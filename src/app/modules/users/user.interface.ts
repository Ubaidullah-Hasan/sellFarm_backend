import { Model, Types } from "mongoose";import { userStatus } from "./user.constants";

export type TOtpVarification = {
  verified: boolean;
  otp?: string;
  expireAt?: Date;
};

export type TUser = {
  _id?: Types.ObjectId;
  role?: string;
  mobile: string;
  password: string;
  invitedBy?: Types.ObjectId | null;
  referedCode?: string;
  selfCode: string;
  otpVarification?: TOtpVarification;
  balance?: number;
  status?: userStatus.ACTIVE | userStatus.BLOCKED;
  createdAt?: Date;
  updatedAt?: Date;
};



// export type TUserModel = Model<TUser> & {
//   isExistUser(mobile: string): Promise<IUserDocument  | null>;
// };


/* ✅ Instance methods */
export interface IUserDocument extends TUser {
  comparePassword(candidate: string): Promise<boolean>;
}

/* ✅ Static methods */
export interface IUserModel extends Model<IUserDocument> {
  isExistUser(mobile: string): Promise<IUserDocument | null>;
}