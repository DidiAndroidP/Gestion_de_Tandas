import { Router } from "express";
import { paymentController, authMiddleware } from "../dependencies";

const router = Router();

router.use(authMiddleware);

router.post("/", paymentController.register.bind(paymentController));
router.post("/notify", paymentController.notifyLate.bind(paymentController));

export { router as paymentRouter };