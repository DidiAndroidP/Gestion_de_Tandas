import { Router } from "express";
import express from "express";
import { paymentController, authMiddleware } from "../dependencies";

const router = Router();

router.post("/webhook", express.raw({ type: 'application/json' }), paymentController.webhook.bind(paymentController));

router.use(authMiddleware);
router.post("/", paymentController.register.bind(paymentController));
router.post("/notify", paymentController.notifyLate.bind(paymentController));
router.post("/session", paymentController.createSession.bind(paymentController));

export { router as paymentRouter };