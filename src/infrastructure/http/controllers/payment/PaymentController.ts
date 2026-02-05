import { Request, Response } from "express";
import { RegisterPaymentUseCase } from "../../../../application/use-cases/payment/RegisterPaymentUseCase";
import { NotifyLatePaymentsUseCase } from "../../../../application/use-cases/payment/NotifyLatePaymentsUseCase";

export class PaymentController {
  constructor(
    private readonly registerPaymentUseCase: RegisterPaymentUseCase,
    private readonly notifyLatePaymentsUseCase: NotifyLatePaymentsUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      await this.registerPaymentUseCase.execute(req.body);
      res.status(201).json({ message: "Payment registered" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async notifyLate(req: Request, res: Response) {
    try {
      const { tandaId, period } = req.body;
      const count = await this.notifyLatePaymentsUseCase.execute(tandaId, period);
      res.status(200).json({ message: `Notifications sent: ${count}` });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}