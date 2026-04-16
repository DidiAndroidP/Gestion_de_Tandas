import { PaymentRepository } from "../../../domain/ports/PaymentRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { UserRepository } from "../../../domain/ports/UserRepository"
import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { NotificationPort } from "../../../domain/ports/NotificationPort"

export class NotifyUpcomingPaymentsUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly userRepository: UserRepository,
    private readonly tandaRepository: TandaRepository,
    private readonly notificationService: NotificationPort
  ) {}

  async execute(): Promise<void> {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const payments = await this.paymentRepository.findPendingByDate(tomorrow)

    for (const payment of payments) {
      const participant = await this.participantRepository.findById(payment.participantId)
      if (!participant) continue

      const user = await this.userRepository.findById(participant.userId)
      const tanda = await this.tandaRepository.findById(participant.tandaId)

      if (user?.fcmToken && tanda) {
        await this.notificationService.sendPushNotification(
          [user.fcmToken],
          "Recordatorio de pago",
          `Mañana vence tu aportación de $${payment.amount} para la tanda "${tanda.name}".`,
          { type: "PAYMENT_REMINDER", tandaId: tanda.id.toString() }
        )
      }
    }
  }
}