import { NotificationPort } from "../../../domain/ports/NotificationPort"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { UserRepository } from "../../../domain/ports/UserRepository"
import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { GenerateTandaScheduleUseCase } from "./GenerateTandaScheduleUseCase"
import { SocketService } from "../../../infrastructure/socket/SocketService"

export class PrepareLiveSorteoUseCase {
  constructor(
    private readonly notificationService: NotificationPort,
    private readonly participantRepository: ParticipantRepository,
    private readonly userRepository: UserRepository,
    private readonly generateSchedule: GenerateTandaScheduleUseCase,
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(tandaId: number): Promise<void> {
    const participants = await this.participantRepository.findByTanda(tandaId)
    
    const allTokens: string[] = []
    for (const p of participants) {
      const user = await this.userRepository.findById(p.userId)
      if (user && user.fcmToken) {
        allTokens.push(user.fcmToken)
      }
    }

    if (allTokens.length > 0) {
      await this.notificationService.sendPushNotification(
        allTokens,
        "¡El sorteo está por iniciar!",
        "Entra ahora para ver la asignación de turnos en vivo.",
        { type: "LIVE_SORTEO_START", tandaId: tandaId.toString() }
      )
    }

    SocketService.emitToTanda(tandaId, "sorteoIniciado", { countdown: 30 })

    setTimeout(async () => {
      try {
        const result = await this.generateSchedule.execute(tandaId)
        
        const tanda = await this.tandaRepository.findById(tandaId)
        if (tanda) {
            tanda.start()
            await this.tandaRepository.update(tanda)
        }

        SocketService.emitToTanda(tandaId, "sorteoFinalizado", result)

        for (const assignment of result.turnosAsignados) {
          const participant = participants.find(p => p.userId === assignment.participanteId)
          if (participant) {
            const user = await this.userRepository.findById(participant.userId)
            if (user && user.fcmToken) {
              await this.notificationService.sendPushNotification(
                [user.fcmToken],
                "Sorteo finalizado",
                `La tanda ha comenzado oficialmente. Tu número de turno es el: ${assignment.numeroTurno}`,
                { 
                  type: "SORTEO_RESULTS", 
                  tandaId: tandaId.toString(),
                  turn: assignment.numeroTurno.toString()
                }
              )
            }
          }
        }
      } catch (error) {
        SocketService.emitToTanda(tandaId, "sorteoError", { message: "Error al generar sorteo" })
      }
    }, 30000)
  }
}