import { model, Schema } from "mongoose";
import { TOtpVarification, TUser } from "./users.interface";
import { uesr_role } from "./users.constants";

const otpVarificationSchema = new Schema<TOtpVarification>(
    {
        otp:{
            type: String
        },
        erpireAt:{
            type: Date
        }
    }
)

const userSchema = new Schema<TUser>(
  {
    role: {
      type: String,
      default: uesr_role.INVESTOR,
    },
    mobile: {
      type: String,
      required: true,
      match: [
        /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    invitedBy: {
      type: Schema.ObjectId,
      required: true,
    },
    selfCode: {
      type: String,
      required: true,
    },
    otpVarification: otpVarificationSchema,
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<TUser>("User", userSchema);
