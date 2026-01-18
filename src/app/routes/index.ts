import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { ProductRoutes } from "../modules/products/products.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
