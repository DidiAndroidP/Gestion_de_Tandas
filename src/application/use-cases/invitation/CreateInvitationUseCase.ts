import { Invitation } from "../../../domain/entities/Invitation"
import { InvitationRepository } from "../../../domain/ports/InvitationRepository"
import { CreateInvitationDTO } from "../../dtos/invitation/CreateInvitationDTO"

export class CreateInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository
  ) {}

  async execute(dto: CreateInvitationDTO): Promise<void> {
    const invitation = new Invitation(
      null,
      dto.tandaId,
      dto.email,
      "pending",
      crypto.randomUUID()
    )

    await this.invitationRepository.save(invitation)
  }
}
