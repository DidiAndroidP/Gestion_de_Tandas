import { PaymentRepository } from "../../../domain/ports/PaymentRepository";
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository";
import { UserRepository } from "../../../domain/ports/UserRepository";
import { TandaRepository } from "../../../domain/ports/TandaRepository";
import { NotificationPort } from "../../../domain/ports/NotificationPort";
import { Payment } from "../../../domain/entities/Payment";

export class ProcessWebhookPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly userRepository: UserRepository,
    private readonly tandaRepository: TandaRepository,
    private readonly notificationService: NotificationPort
  ) {}

  async execute(userId: number, tandaId: number, period: number, amount: number): Promise<void> {
    const participant = await this.participantRepository.findByUserAndTanda(userId, tandaId);
    if (!participant) {
      throw new Error("Participant not found");
    }

    const payment = new Payment(0, participant.id, period, amount, "paid", new Date(), new Date(), 0);
    await this.paymentRepository.save(payment);

    participant.markAsPaid();
    await this.participantRepository.save(participant);
    try {
      const payingUser = await this.userRepository.findById(userId);
      const tanda = await this.tandaRepository.findById(tandaId);
      const allParticipants = await this.participantRepository.findByTanda(tandaId);

      if (payingUser && tanda) {
        const otherUserIds = allParticipants
          .map(p => p.userId)
          .filter(id => id !== userId);

        const tokens: string[] = [];

        for (const id of otherUserIds) {
          const user = await this.userRepository.findById(id);
          if (user && user.fcmToken) {
            tokens.push(user.fcmToken);
          }
        }

        if (tokens.length > 0) {
          await this.notificationService.sendPushNotification(
            tokens,
            "¡Nuevo pago registrado!",
            `${payingUser.name} ha pagado su aportación en la tanda "${tanda.name}".`
          );
        }
      }
    } catch (error) {
      console.error("Error enviando notificaciones post-pago:", error);
    }
  }
}