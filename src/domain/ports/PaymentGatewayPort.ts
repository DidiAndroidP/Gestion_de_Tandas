export interface PaymentGatewayPort {
  createCheckoutSession(amount: number, tandaId: number, userId: number, period: number): Promise<string>;
}