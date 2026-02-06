import { InvitationRepository } from "../../../domain/ports/InvitationRepository"
import { JoinTandaUseCase } from "../../use-cases/tanda/JoinTandaUseCase"

export class AcceptInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly joinTandaUseCase: JoinTandaUseCase
  ) {}

  async execute(token: string, userId: number): Promise<void> {
    const invitation = await this.invitationRepository.findByToken(token)
    if (!invitation) {
      throw new Error(
        "La invitación no existe, ya expiró o el enlace es inválido."
      )
    }

    if (invitation.status !== "pending") {
      throw new Error(
        "Esta invitación ya fue utilizada o fue cancelada anteriormente."
      )
    }

    await this.joinTandaUseCase.execute(invitation.tandaId, userId)

    invitation.accept()

    await this.invitationRepository.save(invitation)
  }
}