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

router.get("/",
    auth(userRole.ADMIN),
    withdrawController.getWithdrawList
)

router.patch("/approve/:withdrawId",
    auth(userRole.ADMIN),
    withdrawController.approveWithdraw
)

router.patch("/reject/:withdrawId",
    auth(userRole.ADMIN),
    withdrawController.rejectedWithdraw
)


export const WithdrawRoutes = router;