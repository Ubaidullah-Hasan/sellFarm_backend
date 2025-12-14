import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.post(
    "/",
    validateRequest(userValidation.registerUserZodSchema),
    userController.registerUser
);

export const userRoutes = router;