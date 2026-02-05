import { Router } from "express";
import { invitationController, authMiddleware } from "../dependencies";

const router = Router();

router.use(authMiddleware);

router.post("/", invitationController.create.bind(invitationController));
router.post("/accept", invitationController.accept.bind(invitationController));

export { router as invitationRouter };