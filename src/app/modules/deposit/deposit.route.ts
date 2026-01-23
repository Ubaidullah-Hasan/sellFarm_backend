import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userRole } from "../users/user.constants";
import { depositControllers } from "./deposit.controller";
import {
    createDepositZodSchema,
    updateDepositStatusZodSchema,
} from "./deposit.validation";

const router = Router();

// USER
router.post(
    "/",
    auth(userRole.INVESTOR, userRole.ADMIN),
    validateRequest(createDepositZodSchema),
    depositControllers.createDeposit
);

router.get(
    "/my",
    auth(userRole.INVESTOR, userRole.ADMIN),
    depositControllers.getMyDeposits
);

// ADMIN
router.get(
    "/status",
    auth(userRole.ADMIN),
    depositControllers.getDepositsByStatus
);

router.patch(
    "/:id/status",
    auth(userRole.ADMIN),
    validateRequest(updateDepositStatusZodSchema),
    depositControllers.updateDepositStatus
);

export const DepositRoutes = router;
