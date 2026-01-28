import { Router } from "express";
import auth from "../../middlewares/auth";
import { userRole } from "../users/user.constants";
import validateRequest from "../../middlewares/validateRequest";
import { createWithdrawZodSchema } from "./withdraw.validation";
import { withdrawController } from "./withdraw.controller";

const router = Router();

router.post("/", 
    auth(userRole.ADMIN, userRole.INVESTOR),
    validateRequest(createWithdrawZodSchema),
    withdrawController.createWithdraw
)


export const WithdrawRoutes = router;