import { Tanda } from "../../../domain/entities/Tanda";
import { TandaRepository } from "../../../domain/ports/TandaRepository";

export class GetAvailableTandasUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(): Promise<Tanda[]> {
    return this.tandaRepository.findAvailable();
  }
}
