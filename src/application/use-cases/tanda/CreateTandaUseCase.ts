import { Tanda } from "../../../domain/entities/Tanda";
import { TandaRepository } from "../../../domain/ports/TandaRepository";

interface CreateTandaDTO {
  name: string;
  contributionAmount: number;
  paymentFrequency: "weekly" | "biweekly" | "monthly";
  totalMembers: number;
  delayToleranceDays: number;
  penaltyPerDay: number;
  creatorId: number;
}

export class CreateTandaUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(dto: CreateTandaDTO): Promise<Tanda> {
    const tanda = new Tanda(
      0,                          // id (MySQL lo genera)
      dto.name,
      dto.contributionAmount,
      dto.paymentFrequency,
      dto.totalMembers,
      dto.delayToleranceDays,
      dto.penaltyPerDay,
      "created",                  // status inicial
      dto.creatorId,
      new Date(),                 // createdAt
      null,                       // startedAt
      []                           // participants
    );

    // 👇 Guardamos pero NO retornamos el save
    await this.tandaRepository.save(tanda);

    // 👇 El UseCase retorna la entidad
    return tanda;
  }
}
