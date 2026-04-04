import { PaymentGatewayPort } from "../../../domain/ports/PaymentGatewayPort";
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository";
import { TandaRepository } from "../../../domain/ports/TandaRepository";

export class CreatePaymentSessionUseCase {
  constructor(
    private readonly paymentGatewayPort: PaymentGatewayPort,
    private readonly participantRepository: ParticipantRepository,
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(userId: number, tandaId: number, period: number, amount: number): Promise<string> {
    const tanda = await this.tandaRepository.findById(tandaId);

    if (!tanda) {
      throw new Error("Tanda not found");
    }

    if (!tanda.canReceivePayments()) {
      throw new Error("Tanda is not in progress");
    }

    const participant = await this.participantRepository.findByUserAndTanda(userId, tandaId);
    
    if (!participant) {
      throw new Error("Participant not found");
    }

    if (!participant.canPay()) {
      throw new Error("Participant cannot pay");
    }

    return this.paymentGatewayPort.createCheckoutSession(amount, tandaId, userId, period);
  }
}