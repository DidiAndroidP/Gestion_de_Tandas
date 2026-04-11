import { Request, Response } from "express";
import { RegisterPaymentUseCase } from "../../../../application/use-cases/payment/RegisterPaymentUseCase";
import { NotifyLatePaymentsUseCase } from "../../../../application/use-cases/payment/NotifyLatePaymentsUseCase";
import { CreatePaymentSessionUseCase } from "../../../../application/use-cases/payment/CreatePaymentSessionUseCase";
import { ProcessWebhookPaymentUseCase } from "../../../../application/use-cases/payment/ProcessWebhookPaymentUseCase";

const StripeClient = require('stripe');

export class PaymentController {
  constructor(
    private readonly registerPaymentUseCase: RegisterPaymentUseCase,
    private readonly notifyLatePaymentsUseCase: NotifyLatePaymentsUseCase,
    private readonly createPaymentSessionUseCase: CreatePaymentSessionUseCase,
    private readonly processWebhookPaymentUseCase: ProcessWebhookPaymentUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      await this.registerPaymentUseCase.execute(req.body);
      res.status(201).json({ message: "Payment registered" });
    } catch (error: any) {
      console.error("❌ Error en registerPayment:", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async notifyLate(req: Request, res: Response) {
    try {
      const { tandaId, period } = req.body;
      const count = await this.notifyLatePaymentsUseCase.execute(tandaId, period);
      res.status(200).json({ message: `Notifications sent: ${count}` });
    } catch (error: any) {
      console.error("❌ Error en notifyLate:", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async createSession(req: Request, res: Response) {
    try {
      const { tandaId, period, amount } = req.body;
      const userId = req.user!.userId;
      const url = await this.createPaymentSessionUseCase.execute(userId, tandaId, period, amount);
      console.log(`🔗 Sesión de Stripe creada para Usuario ${userId}, Tanda ${tandaId}`);
      res.status(200).json({ url });
    } catch (error: any) {
      console.error("❌ Error en createSession:", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async webhook(req: Request, res: Response) {
    console.log("🔥 ¡STRIPE ENTRÓ CON ÉXITO AL CONTROLADOR!");

    const stripe = new StripeClient(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' });
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
      console.log(`✅ Firma verificada. Evento recibido: ${event.type}`);
    } catch (error: any) {
      console.error(`❌ Error verificando firma del Webhook: ${error.message}`);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any; 
      
      console.log("💳 Metadata recibida de Stripe:", session.metadata);

      const tandaId = Number(session.metadata?.tandaId);
      const userId = Number(session.metadata?.userId);
      const period = Number(session.metadata?.period);
      const amount = Number(session.metadata?.amount);

      try {
        await this.processWebhookPaymentUseCase.execute(userId, tandaId, period, amount);
        console.log(`🎉 ¡PAGO EXITOSO! Guardado para el usuario ${userId} en la tanda ${tandaId}`);
      } catch (error: any) {
        console.error("❌ Error guardando el pago en la base de datos:", error.message);
        return res.status(500).send("Error processing payment");
      }
    } else {
      console.log(`⚠️ Evento de Stripe ignorado (no es pago completado): ${event.type}`);
    }

    res.json({ received: true });
  }
}