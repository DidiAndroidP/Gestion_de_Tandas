import { Router } from "express";
import express from "express";
import { paymentController, authMiddleware } from "../dependencies"; // Ajusta según tu estructura

const router = Router();

// 1. Ruta del webhook con express.raw (SIN authMiddleware)
router.post("/webhook", express.raw({ type: 'application/json' }), paymentController.webhook.bind(paymentController));

// 2. Aplicar Auth a las demás rutas
router.use(authMiddleware);
router.post("/", paymentController.register.bind(paymentController));
router.post("/notify", paymentController.notifyLate.bind(paymentController));
router.post("/session", paymentController.createSession.bind(paymentController));

export { router as paymentRouter };