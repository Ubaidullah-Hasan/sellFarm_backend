import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { ProductRoutes } from "../modules/products/products.routes";
import { InvestmentRoutes } from "../modules/investments/investment.routes";
import { DepositRoutes } from "../modules/deposit/deposit.route";

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
  {
    path: "/investments",
    route: InvestmentRoutes,
  },
  {
    path: "/deposits",
    route: DepositRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
