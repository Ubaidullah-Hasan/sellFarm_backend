import { IProduct } from "./products.interface";
import { Product } from "./products.model";

const createProduct = async (payload: IProduct) => {

  const result = await Product.create({ 
    ...payload, 
    price: Number(parseInt(payload.price.toString())),
    maxInvestCountPerPerson: Number(parseInt(payload.maxInvestCountPerPerson.toString())),
    dailyProfit: Number(parseFloat(payload.dailyProfit.toString())),
    investmentDayCycle: Number(parseInt(payload.investmentDayCycle.toString())),
  });
  return result;
};

const getAllProducts = async () => {
  const result = await Product.find();
  return result;
}


const getProductById = async (id: string) => {
  const products = await Product.findById(id);
  return products;
}



export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
};
