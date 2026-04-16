import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { UserRepository } from "../../../domain/ports/UserRepository"
import { NotificationPort } from "../../../domain/ports/NotificationPort"

export class FinishTandaUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationPort
  ) {}

  async execute(tandaId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) throw new Error("Tanda not found")

    tanda.finish()
    await this.tandaRepository.update(tanda)

    const participants = await this.participantRepository.findByTanda(tandaId)
    const tokens: string[] = []
    
    for (const p of participants) {
      const user = await this.userRepository.findById(p.userId)
      if (user?.fcmToken) tokens.push(user.fcmToken)
    }

    if (tokens.length > 0) {
      await this.notificationService.sendPushNotification(
        tokens,
        "¡Tanda Finalizada!",
        `La tanda "${tanda.name}" ha concluido con éxito. ¡Gracias por participar!`,
        { type: "TANDA_FINISHED", tandaId: tandaId.toString() }
      )
    }
  }
}