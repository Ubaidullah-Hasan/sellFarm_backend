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

router.get(
  "/my",
  auth(userRole.INVESTOR, userRole.ADMIN),
  InvestmentControllers.getMyInvestments
);

/**
 * ADMIN
 */
router.get(
  "/pending",
  auth(userRole.ADMIN),
  InvestmentControllers.getPendingInvestments
);

router.patch(
  "/:id/status",
  auth(userRole.ADMIN),
  validateRequest(investmentZodValidation.updateInvestmentStatusZodSchema),
  InvestmentControllers.updateInvestmentStatus
);




export const InvestmentRoutes = router;