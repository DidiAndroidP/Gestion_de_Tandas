import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { UserRepository } from "../../../domain/ports/UserRepository" // <-- IMPORTANTE
import { TurnService } from "../../../domain/services/TurnService"
import { ScheduleResponse } from "../../dtos/tanda/ScheduleResponseDTO"

export class GenerateTandaScheduleUseCase {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly tandaRepository: TandaRepository,
    private readonly turnService: TurnService,
    private readonly userRepository: UserRepository 
  ) {}

  async execute(tandaId: number): Promise<ScheduleResponse> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) {
      throw new Error("Tanda no encontrada")
    }

    const participants = await this.participantRepository.findByTanda(tandaId)

    if (participants.length === 0) {
      throw new Error("No hay participantes en la tanda")
    }

    if (participants.length < tanda.totalMembers) {
      throw new Error(
        `La tanda requiere ${tanda.totalMembers} participantes, pero solo hay ${participants.length}`
      )
    }

    const totalAmount = tanda.contributionAmount * tanda.totalMembers

    const startDate = new Date()
    const scheduleResult = this.turnService.generateRandomSchedule(
      participants,
      startDate,
      tanda.paymentFrequency, 
      totalAmount
    )

    const turnosConNombres = await Promise.all(
        scheduleResult.assignments.map(async (assignment) => {
            const participant = participants.find(p => p.userId === assignment.participantId)
            
            if (participant) {
                participant.assignTurn(assignment.turnNumber)
                await this.participantRepository.save(participant)
            }

            const user = await this.userRepository.findById(assignment.participantId);
            const nombreCompleto = user ? user.name : `Usuario ID: ${assignment.participantId}`;

            return {
                participanteId: assignment.participantId,
                nombreParticipante: nombreCompleto, 
                numeroTurno: assignment.turnNumber,
                fechaCobro: assignment.collectionDate.toISOString().split('T')[0],
                montoRecibir: totalAmount,
                estado: "pendiente"
            };
        })
    );

    const response: ScheduleResponse = {
      tandaId,
      sorteoFecha: new Date(),
      metodo: "aleatorio",
      turnosAsignados: turnosConNombres,
      resumen: {
        totalPeriodos: tanda.totalMembers,
        montoPorPeriodo: tanda.contributionAmount,
        montoTotalPorParticipante: totalAmount,
        fechaFinalizacionEstimada: scheduleResult.endDate.toISOString().split('T')[0]
      }
    }

    return response
  }
}