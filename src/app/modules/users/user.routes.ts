import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { userRole } from "./user.constants";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/",
    validateRequest(userValidation.registerUserZodSchema),
    userController.registerUser
);

router.get(
    '/my-profile',
    auth(userRole.INVESTOR, userRole.ADMIN),
    userController.getUserProfile
);


export const userRoutes = router;