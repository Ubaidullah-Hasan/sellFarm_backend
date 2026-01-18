import { IProduct } from "./products.interface";
import { Product } from "./products.model";

const createProduct = async (payload: IProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async() => {
    const products = await Product.find();
    return products;
}


const getProductById = async(id: string) => {
    const products = await Product.findById(id);
    return products;
}

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
};
