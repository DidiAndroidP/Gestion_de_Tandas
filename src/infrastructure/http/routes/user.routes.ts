import { Router } from "express";
import { userController, authMiddleware } from "../dependencies";

const router = Router();

router.use(authMiddleware);

router.get("/me", userController.getById.bind(userController));
router.get("/:id", userController.getById.bind(userController));
router.patch("/me", userController.update.bind(userController));
router.patch("/:id/activate", userController.activate.bind(userController));

export { router as userRouter };