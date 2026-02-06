import { Payment } from "../../../domain/entities/Payment";
import { PaymentRepository } from "../../../domain/ports/PaymentRepository";
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository";
import { RegisterPaymentDTO } from "../../dtos/payment/RegisterPaymentDTO";

export class RegisterPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute(dto: RegisterPaymentDTO): Promise<void> {
    const participant =
      await this.participantRepository.findByUserAndTanda(
        dto.userId,
        dto.tandaId
      );

    if (!participant) {
      throw new Error("El usuario no pertenece a esta tanda");
    }

    if (!participant.canPay()) {
      throw new Error("El participante no puede realizar el pago");
    }

    const payment = new Payment(
      0,
      participant.id,
      dto.period,
      dto.amount,
      "paid",
      new Date(),
      dto.paymentDate,
      0
    );

    await this.paymentRepository.save(payment);

    participant.markAsPaid();
    await this.participantRepository.save(participant);
  }
}
