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

    // --- LÓGICA DE NOTIFICACIONES CORREGIDA ---
    try {
      const payingUser = await this.userRepository.findById(userId);
      const tanda = await this.tandaRepository.findById(tandaId);
      const allParticipants = await this.participantRepository.findByTanda(tandaId);

      console.log(`📣 Buscando a quién notificar en Tanda ${tandaId}. Total miembros: ${allParticipants.length}`);

      if (payingUser && tanda) {
        // Excluimos al usuario que acaba de pagar para no notificarle a él mismo
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

        console.log(`📣 Se encontraron ${tokens.length} tokens FCM válidos para enviar.`);

        if (tokens.length > 0) {
          await this.notificationService.sendPushNotification(
            tokens,
            "¡Nuevo pago registrado!",
            `${payingUser.name} ha pagado su aportación en la tanda "${tanda.name}".`,
            { // <-- ESTO ES LO QUE NECESITABA ANDROID (TandaFirebaseService.kt)
               tandaId: tanda.id.toString(),
               title: "¡Nuevo pago registrado!",
               body: `${payingUser.name} ha pagado su aportación en la tanda "${tanda.name}".`
            }
          );
        } else {
           console.log("⚠️ No se enviaron notificaciones porque no hay otros usuarios con tokens en esta tanda.");
        }
      }
    } catch (error) {
      console.error("❌ Error enviando notificaciones post-pago:", error);
    }
  }
}