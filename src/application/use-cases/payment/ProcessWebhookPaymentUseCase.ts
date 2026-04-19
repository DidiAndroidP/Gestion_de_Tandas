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
          .filter(id => Number(id) !== Number(userId));

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
            `${payingUser.name} ha pagado su aportación en la tanda "${tanda.name}".`,
            { 
               tandaId: tanda.id.toString(),
               title: "¡Nuevo pago registrado!",
               body: `${payingUser.name} ha pagado su aportación en la tanda "${tanda.name}".`
            }
          );
        }

        const allPaid = allParticipants.every(p => p.alreadyPaid === true);
        
        if (allPaid && tanda.status !== 'finished') {
          tanda.finish();
          await this.tandaRepository.update(tanda);

          const allTokens: string[] = [];
          for (const p of allParticipants) {
            const user = await this.userRepository.findById(p.userId);
            if (user && user.fcmToken) allTokens.push(user.fcmToken);
          }

          if (allTokens.length > 0) {
            await this.notificationService.sendPushNotification(
              allTokens,
              "¡Tanda Finalizada!",
              `Todos han completado sus aportaciones. La tanda "${tanda.name}" ha concluido con éxito. ¡Ya puedes evaluarla!`,
              { 
                 type: "TANDA_FINISHED", 
                 tandaId: tanda.id.toString(),
                 title: "¡Tanda Finalizada!",
                 body: `La tanda "${tanda.name}" ha concluido con éxito.`
              }
            );
          }
        }
      }
    } catch (error) {
      console.error("❌ Error enviando notificaciones post-pago:", error);
    }
  }
}