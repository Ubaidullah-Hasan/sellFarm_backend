import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/login",
  validateRequest(authValidation.loginUserZodSchema),
  authController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken,
);

router.post('/logout', authController.logoutUser);

export const authRoutes = router;
