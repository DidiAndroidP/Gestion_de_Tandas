import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { UserRepository } from "../../../domain/ports/UserRepository"
import { NotificationPort } from "../../../domain/ports/NotificationPort"

export class StartTandaUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationPort
  ) {}

  async execute(tandaId: number, userId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId)
    
    if (!tanda) {
      throw new Error("La tanda no existe.")
    }

    if (tanda.creatorId !== userId) {
      throw new Error("Solo el creador puede iniciar la tanda.")
    }

    const participants = await this.participantRepository.findByTanda(tandaId)

    if (!tanda.canStartWith(participants.length)) {
      throw new Error(`No se puede iniciar la tanda. Se requieren ${tanda.totalMembers} participantes y actualmente hay ${participants.length}.`)
    }

    tanda.start()
    await this.tandaRepository.update(tanda)

    const tokens: string[] = []
    for (const p of participants) {
      const user = await this.userRepository.findById(p.userId)
      if (user?.fcmToken) tokens.push(user.fcmToken)
    }

    if (tokens.length > 0) {
      await this.notificationService.sendPushNotification(
        tokens,
        "¡La tanda ha comenzado!",
        `El administrador ha iniciado "${tanda.name}". Revisa tu calendario de pagos.`,
        { type: "TANDA_STARTED", tandaId: tandaId.toString() }
      )
    }
  }
}