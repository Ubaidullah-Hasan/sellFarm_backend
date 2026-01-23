import { Schema, model } from "mongoose";
import { IProduct } from "./products.interface";

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: [true, "Title already exists, please choose another one"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    dailyProfit: {
      type: Number,
      required: [true, "Daily profit is required"],
      min: [0, "Daily profit cannot be negative"],
    },
    maxInvestCountPerPerson: {
      type: Number,
      required: [true, "Max invest count is required"],
      min: [0, "Max invest count cannot be negative"],
    },
    investmentDayCycle: {
      type: Number,
      required: [true, "Investment cycle is required"],
      min: [1, "Investment cycle must be at least 1 day"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    totalProfit: {
      type: Number,
      min: [0, "Total profit cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);


// Virtual for ROI (Return on Investment) percentage
productSchema.virtual("roiPercentage").get(function (this: IProduct) {
  return ((this.totalProfit as number - this.price) / this.price) * 100;
});

// Virtual for total investment capacity
productSchema.virtual("totalInvestmentCapacity").get(function (this: IProduct) {
  return this.price * this.maxInvestCountPerPerson;
});

// Pre-save middleware (if needed)
productSchema.pre("save", function (next) {
  this.totalProfit = this.dailyProfit * this.investmentDayCycle;

  next();
});

export const Product = model<IProduct>("Product", productSchema);
