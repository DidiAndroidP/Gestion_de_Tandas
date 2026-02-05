import { Router } from "express";
import { authController } from "../dependencies";

const router = Router();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

export { router as authRouter };

