import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidation } from "./products.validation";
import { ProductController } from "./products.controllers";
import auth from "../../middlewares/auth";
import { userRole } from "../users/user.constants";

const router = Router();

router.post(
  "/",
  auth(userRole.ADMIN),
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct,
);

router.get(
  "/",
  auth(userRole.ADMIN, userRole.INVESTOR),
  ProductController.getAllProducts,
);

router.get(
  '/:id',
  auth(userRole.ADMIN, userRole.INVESTOR),
  ProductController.getProductById
);

// router.put(
//   '/:id',
//   validateProductId,
//   validateUpdateProduct,
//   ProductController.updateProduct
// );

// router.delete(
//   '/:id',
//   validateProductId,
//   ProductController.deleteProduct
// );

export const ProductRoutes = router;
