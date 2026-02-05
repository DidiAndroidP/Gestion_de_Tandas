import { Payment } from "../../../domain/entities/Payment"
import { PaymentRepository } from "../../../domain/ports/PaymentRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { RegisterPaymentDTO } from "../../dtos/payment/RegisterPaymentDTO"

export class RegisterPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute(dto: RegisterPaymentDTO): Promise<void> {
    const participant = await this.participantRepository.findByUsuarioYTanda(
      dto.participantId,
      0
    )

    if (!participant || !participant.canPay()) {
      throw new Error("Participant cannot pay")
    }

    const payment = new Payment(
      0,
      dto.participantId,
      dto.period,
      dto.amount,
      "paid",
      new Date(),
      dto.paymentDate,
      0
    )

    await this.paymentRepository.save(payment)
  }
}
