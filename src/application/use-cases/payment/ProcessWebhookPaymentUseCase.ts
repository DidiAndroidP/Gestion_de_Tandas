import { PaymentRepository } from "../../../domain/ports/PaymentRepository";
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository";
import { Payment } from "../../../domain/entities/Payment";

export class ProcessWebhookPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute(userId: number, tandaId: number, period: number, amount: number): Promise<void> {
    const participant = await this.participantRepository.findByUserAndTanda(userId, tandaId);
    
    if (!participant) {
      throw new Error("Participant not found");
    }

    const payment = new Payment(
      0,
      participant.id,
      period,
      amount,
      "paid",
      new Date(),
      new Date(),
      0
    );

    await this.paymentRepository.save(payment);
    participant.markAsPaid();
    await this.participantRepository.save(participant);
  }
}