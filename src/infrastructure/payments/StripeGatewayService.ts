import { PaymentGatewayPort } from '../../domain/ports/PaymentGatewayPort';

const StripeClient = require('stripe');

export class StripeGatewayService implements PaymentGatewayPort {
  private stripe: any; 

  constructor() {
    this.stripe = new StripeClient(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(amount: number, tandaId: number, userId: number, period: number): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `Tanda ${tandaId} - Periodo ${period}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?tanda=${tandaId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
      metadata: {
        tandaId: tandaId.toString(),
        userId: userId.toString(),
        period: period.toString(),
        amount: amount.toString()
      },
    });

    return session.url as string;
  }
}