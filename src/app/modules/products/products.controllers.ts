import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./products.services";
import { StatusCodes } from "http-status-codes";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const productData = req.body;
  const result = await ProductService.createProduct(productData);

  sendResponse(res, {
    success: true,
    message: "Product created successfully",
    data: result,
    statusCode: StatusCodes.CREATED,
  });
});


const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await ProductService.getAllProducts();

  sendResponse(res, {
    success: true,
    message: "Products retrieved successfully",
    data: products,
    statusCode: StatusCodes.OK,
  });
});

const getProductById = catchAsync(async(req: Request, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.getProductById(id);
    
    sendResponse(res, {
        success: true,
        message: "Product retrieved successfully",
        data: product,
        statusCode: StatusCodes.OK,
    });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
};
