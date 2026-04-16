import { Router } from "express"
import { reviewController, authMiddleware } from "../dependencies"

const router = Router()

router.use(authMiddleware)
router.post("/", reviewController.create.bind(reviewController))
router.get("/user/:creatorId", reviewController.getReputation.bind(reviewController))

export { router as reviewRouter }