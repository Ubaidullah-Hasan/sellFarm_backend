import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { userRole } from "../users/user.constants";
import { investmentZodValidation } from "./investment.validation";
import { InvestmentControllers } from "./investment.controller";


const router = Router();

/**
 * USER
 */
router.post(
  "/",
  auth(userRole.INVESTOR, userRole.ADMIN),
  validateRequest(investmentZodValidation.createInvestmentZodSchema),
  InvestmentControllers.createInvestment
);

// router.get(
//   "/my",
//   auth(userRole.USER, userRole.ADMIN),
//   investmentControllers.getMyInvestments
// );

/**
 * ADMIN
 */
// router.get(
//   "/pending",
//   auth(userRole.ADMIN),
//   investmentControllers.getPendingInvestments
// );

// router.patch(
//   "/:id/status",
//   auth(userRole.ADMIN),
//   validateRequest(updateInvestmentStatusZodSchema),
//   investmentControllers.updateInvestmentStatus
// );




export const InvestmentRoutes = router;