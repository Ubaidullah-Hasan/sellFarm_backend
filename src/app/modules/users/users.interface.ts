import { ObjectId } from "mongoose";

export interface IUser {
    _id: ObjectId,
    phone: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
}