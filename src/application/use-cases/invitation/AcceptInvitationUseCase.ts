import { InvitationRepository } from "../../../domain/ports/InvitationRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { Participant } from "../../../domain/entities/Participant"

export class AcceptInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(token: string, userId: number): Promise<void> {
    const invitation = await this.invitationRepository.findByToken(token)
    if (!invitation) throw new Error("Invitation not found")

    invitation.accept()

    const tanda = await this.tandaRepository.findById(invitation.tandaId)
    if (!tanda) throw new Error("Tanda not found")

    tanda.addParticipant(userId)

    const participant = new Participant(
      0,
      userId,
      tanda.id,
      0,
      false,
      false,
      new Date()
    )

    await this.participantRepository.save(participant)
    await this.tandaRepository.update(tanda)
  }
}
