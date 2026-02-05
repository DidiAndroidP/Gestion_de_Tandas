import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";
import { tandaRouter } from "./tanda.routes";
import { invitationRouter } from "./invitation.routes";
import { paymentRouter } from "./payment.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/tandas", tandaRouter);
router.use("/invitations", invitationRouter);
router.use("/payments", paymentRouter);

export { router as AppRouter };