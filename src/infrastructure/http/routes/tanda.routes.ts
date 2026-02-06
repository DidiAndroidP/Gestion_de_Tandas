import { Router } from "express";
import { tandaController, authMiddleware } from "../dependencies";

const router = Router();

router.use(authMiddleware);

router.post("/", tandaController.create.bind(tandaController));
router.get("/available", tandaController.getAvailable.bind(tandaController));
router.post("/:id/leave", tandaController.leave.bind(tandaController))
router.post("/:id/join", tandaController.join.bind(tandaController));
router.get("/:id", tandaController.getById.bind(tandaController));
router.get("/:id/summary", tandaController.getSummary.bind(tandaController));
router.post("/:id/start", tandaController.start.bind(tandaController));
router.post("/:id/finish", tandaController.finish.bind(tandaController));
router.post("/:id/close", tandaController.close.bind(tandaController));
router.post("/:id/schedule", tandaController.generateSchedule.bind(tandaController));

export { router as tandaRouter };
