import { model, Schema } from "mongoose";
import { IUserDocument, IUserModel, TOtpVarification } from "./user.interface";
import { userRole, userStatus } from "./user.constants";
import bcrypt from "bcrypt";
import config from "../../../config";

const otpVarificationSchema = new Schema<TOtpVarification>(
  {
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    expireAt: {
      type: Date,
    },
  },
  { _id: false }
);

const userSchema = new Schema<IUserDocument>(
  {
    role: {
      type: String,
      default: userRole.INVESTOR,
    },
    mobile: {
      type: String,
      required: true,
      match: [/^(?:\+?88)?01[3-9]\d{8}$/, "Please fill a valid mobile number"],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    selfCode: {
      type: String,
      required: true,
      unique: true,
    },
    otpVarification: {
      type: otpVarificationSchema,
      default: { verified: false },
    },
    balance: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [userStatus.ACTIVE, userStatus.BLOCKED],
      default: userStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: hash password if modified
userSchema.pre("save", async function (next) {
  // if change password when update user then again bcrypt, if password same it will be return
  if (!this.isModified("password")) return next();

  //password hash
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.isExistUser = async function (mobile: string) {
  return await this.findOne({ mobile });
};

// must export in the last line
export const UserModel = model<IUserDocument, IUserModel>(
  "User",
  userSchema
);
