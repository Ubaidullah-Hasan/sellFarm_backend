import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";

export const createToken = (
  jwtPayload: { userId: Types.ObjectId; role: string; mobile: string },
  secret: Secret,
  expiresIn?: string
): string => {

  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
